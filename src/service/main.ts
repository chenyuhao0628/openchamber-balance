// OpenChamber "余额" extension — local service.
//
// Runs under the app's own Node runtime (ELECTRON_RUN_AS_NODE), bound to
// 127.0.0.1, reachable only through the OpenChamber host proxy. It is the only
// part that talks to the network or reads credentials; the sandboxed panel
// only submits newly entered keys; stored keys are never returned to the panel.
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import type { Balance, BalancesResult, Provider, Relay, UsageWindow } from '../shared/types.ts';
import { changesRelayOrigin, normalizeRelayUrl } from '../shared/relay-url.ts';
import { createBalanceCache, failedProvider } from './cache.ts';

const port = Number(process.env.OPENCHAMBER_SERVICE_PORT);
const token = process.env.OPENCHAMBER_SERVICE_TOKEN ?? '';
if (!port || !token) {
  console.error('OPENCHAMBER_SERVICE_PORT and OPENCHAMBER_SERVICE_TOKEN are required');
  process.exit(1);
}

const HOME = os.homedir();
const OPENCODE_DATA_DIR = path.join(HOME, '.local', 'share', 'opencode');
const OPENCODE_DB_FILE = path.join(
  OPENCODE_DATA_DIR,
  process.env.OPENCODE_DB && process.env.OPENCODE_DB !== ':memory:' ? process.env.OPENCODE_DB : 'opencode.db',
);
const CONFIG_DIR = path.join(HOME, '.config', 'openchamber', 'balance');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');
const REQUEST_TIMEOUT_MS = 8_000;

// ---------------------------------------------------------------------------
// Credentials (read-only mirror of OpenChamber's opencode/credential-db.js)
// ---------------------------------------------------------------------------

type Credential = { key: string; kind: 'api' | 'oauth' };

const projectCredential = (raw: unknown): Credential | null => {
  let value: unknown = raw;
  if (typeof raw === 'string') {
    try {
      value = JSON.parse(raw);
    } catch {
      return null;
    }
  }
  if (!value || typeof value !== 'object') return null;
  const record = value as Record<string, unknown>;
  if (record.type === 'key' && typeof record.key === 'string') return { key: record.key, kind: 'api' };
  if (record.type === 'oauth' && typeof record.access === 'string') return { key: record.access, kind: 'oauth' };
  // Legacy auth.json shape: { type: 'api', key } already handled by the two
  // branches above; some entries store { type: 'oauth', access, refresh }.
  if (typeof record.key === 'string') return { key: record.key, kind: 'api' };
  if (typeof record.access === 'string') return { key: record.access, kind: 'oauth' };
  return null;
};

type SqliteRow = { integration_id?: unknown; value?: unknown; active?: unknown; time_updated?: unknown };

let databaseSyncPromise: Promise<unknown> | null = null;
const loadDatabaseSync = (): Promise<unknown> => {
  if (!databaseSyncPromise) {
    databaseSyncPromise = import('node:sqlite')
      .then((module) => (module as { DatabaseSync?: unknown }).DatabaseSync ?? null)
      .catch(() => null);
  }
  return databaseSyncPromise;
};

const readCredentials = async (): Promise<Record<string, Credential>> => {
  const result: Record<string, Credential> = {};
  const DatabaseSync = (await loadDatabaseSync()) as
    | (new (file: string, options: { readOnly: boolean }) => {
        prepare: (sql: string) => { all: () => SqliteRow[] };
        close: () => void;
      })
    | null;

  if (DatabaseSync && fs.existsSync(OPENCODE_DB_FILE)) {
    let db: { prepare: (sql: string) => { all: () => SqliteRow[] }; close: () => void } | null = null;
    try {
      db = new DatabaseSync(OPENCODE_DB_FILE, { readOnly: true });
      const rows = db
        .prepare(
          'SELECT integration_id, value, active, time_updated FROM credential ' +
            'WHERE integration_id IS NOT NULL ORDER BY integration_id, active DESC, time_updated DESC',
        )
        .all();
      for (const row of rows) {
        const id = typeof row.integration_id === 'string' ? row.integration_id : '';
        if (!id || id in result) continue;
        const credential = projectCredential(row.value);
        if (credential) result[id] = credential;
      }
      return result;
    } catch (error) {
      console.warn('balance service: could not read OpenCode credentials database:', error instanceof Error ? error.message : error);
    } finally {
      try {
        db?.close();
      } catch {
        // read-only connection; a failed close changes nothing
      }
    }
  }

  // Fallback: the legacy auth.json, for an OpenCode old enough to still use it.
  try {
    const legacy = JSON.parse(fs.readFileSync(path.join(OPENCODE_DATA_DIR, 'auth.json'), 'utf8')) as Record<string, unknown>;
    for (const [id, entry] of Object.entries(legacy)) {
      const credential = projectCredential(entry);
      if (credential) result[id] = credential;
    }
  } catch {
    // no legacy file either; provider simply shows as not configured
  }
  return result;
};

const firstCredential = (credentials: Record<string, Credential>, ids: string[]): Credential | null => {
  for (const id of ids) {
    const found = credentials[id];
    if (found?.key) return found;
  }
  return null;
};

// ---------------------------------------------------------------------------
// Relay (OpenAI/NewAPI/Sub2API compatible) config
// ---------------------------------------------------------------------------

const isRelay = (value: unknown): value is Relay => {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === 'string' &&
    typeof record.name === 'string' &&
    typeof record.baseUrl === 'string' &&
    typeof record.apiKey === 'string'
  );
};

class RequestError extends Error {
  constructor(readonly status: number, message: string) { super(message); }
}

const readConfig = (): { relays: Relay[] } => {
  let raw: string;
  try {
    raw = fs.readFileSync(CONFIG_FILE, 'utf8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return { relays: [] };
    throw new RequestError(500, '无法读取中转站配置，请检查文件权限');
  }
  try {
    const parsed = JSON.parse(raw) as { relays?: unknown };
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error();
    const relays = parsed.relays ?? [];
    if (!Array.isArray(relays) || !relays.every(isRelay)) throw new Error();
    return { relays };
  } catch {
    throw new RequestError(500, '中转站配置格式有误，请修复 config.json 后重试；现有文件未修改');
  }
};

const writeConfig = (config: { relays: Relay[] }): void => {
  fs.mkdirSync(CONFIG_DIR, { recursive: true, mode: 0o700 });
  const temporary = `${CONFIG_FILE}.${randomUUID()}.tmp`;
  try {
    fs.writeFileSync(temporary, JSON.stringify(config, null, 2), { mode: 0o600 });
    fs.renameSync(temporary, CONFIG_FILE);
  } catch {
    try { fs.unlinkSync(temporary); } catch { /* No temporary file to remove. */ }
    throw new RequestError(500, '保存失败，请检查配置目录的写入权限');
  }
};

// ---------------------------------------------------------------------------
// Fetching helpers
// ---------------------------------------------------------------------------

type JsonAnswer = { status: number; ok: boolean; body: unknown };

const fetchJson = async (url: string, headers: Record<string, string>, signal = AbortSignal.timeout(REQUEST_TIMEOUT_MS)): Promise<JsonAnswer> => {
  const response = await fetch(url, { headers, signal });
  const text = await response.text();
  let body: unknown = null;
  try {
    body = JSON.parse(text);
  } catch {
    body = null;
  }
  return { status: response.status, ok: response.ok, body };
};

const asNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const clampPercent = (value: number): number => Math.min(100, Math.max(0, value));

const toTimestamp = (value: unknown): number | null => {
  const numeric = asNumber(value);
  if (numeric !== null) {
    if (numeric <= 0) return null;
    return numeric < 1_000_000_000_000 ? numeric * 1000 : numeric;
  }
  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
};

const formatReset = (timestamp: number | null): string | null => {
  if (timestamp === null) return null;
  const date = new Date(timestamp);
  if (!Number.isFinite(date.getTime())) return null;
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  return sameDay
    ? date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    : date.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const makeWindow = (
  key: string,
  label: string,
  usedPercent: number,
  resetAtRaw: unknown,
  detail?: string | null,
): UsageWindow => {
  const used = clampPercent(usedPercent);
  const resetAt = toTimestamp(resetAtRaw);
  return {
    key,
    label,
    usedPercent: used,
    remainingPercent: clampPercent(100 - used),
    resetAt,
    resetAtText: formatReset(resetAt),
    detail: detail ?? null,
  };
};

const windowFromCounts = (
  key: string,
  label: string,
  usedRaw: unknown,
  capRaw: unknown,
  resetAtRaw: unknown,
): UsageWindow | null => {
  const used = asNumber(usedRaw);
  const cap = asNumber(capRaw);
  if (used === null || cap === null || cap <= 0) return null;
  const round = (value: number): string => (Math.round(value * 100) / 100).toString();
  return makeWindow(key, label, (used / cap) * 100, resetAtRaw, `${round(used)} / ${round(cap)}`);
};

const moneyLabel = (value: number, unit: string): string => {
  const symbol = unit === 'USD' || unit === '$' ? '$' : unit === 'CNY' || unit === '¥' ? '¥' : '';
  // Currencies get cents; credit-style units stay to one decimal so the card
  // does not overflow into a wrapped line.
  return symbol ? `${symbol}${value.toFixed(2)}` : `${Math.round(value * 10) / 10} ${unit}`;
};

/**
 * `individual-goat` reads as `GOAT`, `step-plan` as `PLAN`. Anything that is
 * not an id-shaped string (StepFun's 预付费, a relay's 钱包余额) is kept.
 */
const shortPlanLabel = (plan: string | null): string | null => {
  if (!plan) return null;
  if (!/^[a-z0-9]+(?:[-_][a-z0-9]+)+$/i.test(plan)) return plan;
  const last = plan.split(/[-_]/).pop() ?? plan;
  return last.toUpperCase();
};

const makeBalance = (value: number | null, unit: string): Balance | null =>
  value === null ? null : { value, label: moneyLabel(value, unit), unit };

// ---------------------------------------------------------------------------
// Provider fetchers — each returns a normalized contribution
// ---------------------------------------------------------------------------

type Contribution = {
  configured?: boolean;
  plan?: string | null;
  balance?: Balance | null;
  detail?: string | null;
  windows?: UsageWindow[];
};

const COMMAND_CODE_HEADERS = {
  Accept: 'application/json',
  'User-Agent': 'command-code/0.40.0',
  'x-cli-environment': 'production',
  'x-command-code-version': '0.40.0',
};

const fetchCommandCode = async (credential: Credential | null): Promise<Contribution> => {
  if (!credential) return { configured: false };
  const headers = {
    ...COMMAND_CODE_HEADERS,
    Authorization: `Bearer ${credential.key}`,
    'x-api-key': credential.key,
  };

  const whoami = await fetchJson('https://api.commandcode.ai/alpha/whoami', headers);
  if (!whoami.ok) throw new Error(`Command Code whoami 返回 HTTP ${whoami.status}`);
  const org = (whoami.body as { org?: { id?: unknown } | null } | null)?.org ?? null;
  const orgId = org && typeof org.id === 'string' ? org.id : null;

  const creditsUrl = orgId
    ? `https://api.commandcode.ai/alpha/billing/credits?orgId=${encodeURIComponent(orgId)}`
    : 'https://api.commandcode.ai/alpha/billing/credits';
  const [credits, subscriptions, summary] = await Promise.all([
    fetchJson(creditsUrl, headers),
    fetchJson('https://api.commandcode.ai/alpha/billing/subscriptions', headers).catch(() => null),
    fetchJson('https://api.commandcode.ai/alpha/usage/summary', headers).catch(() => null),
  ]);
  if (!credits.ok) throw new Error(`Command Code 账单接口返回 HTTP ${credits.status}`);

  const body = credits.body as
    | {
        credits?: { monthlyCredits?: unknown };
        windowLimits?: { fiveHour?: { used?: unknown; cap?: unknown; resetAt?: unknown }; weekly?: { used?: unknown; cap?: unknown; resetAt?: unknown } };
      }
    | null;

  // Optional: billing period end + spend for the monthly window. Both are
  // best-effort; without them the monthly row is omitted rather than invented.
  const subscriptionData = subscriptions?.ok
    ? ((subscriptions.body as { data?: Record<string, unknown> } | null)?.data ?? null)
    : null;
  const periodEnd = subscriptionData?.currentPeriodEnd ?? subscriptionData?.expiresAt ?? null;
  const periodSpent = summary?.ok
    ? asNumber((summary.body as { totalCredits?: unknown; totalCost?: unknown } | null)?.totalCredits) ??
      asNumber((summary.body as { totalCredits?: unknown; totalCost?: unknown } | null)?.totalCost)
    : null;

  const monthlyCredits = asNumber(body?.credits?.monthlyCredits);
  const windows: UsageWindow[] = [];
  const fiveHour = windowFromCounts('5h', '5 小时', body?.windowLimits?.fiveHour?.used, body?.windowLimits?.fiveHour?.cap, body?.windowLimits?.fiveHour?.resetAt);
  const weekly = windowFromCounts('weekly', '每周', body?.windowLimits?.weekly?.used, body?.windowLimits?.weekly?.cap, body?.windowLimits?.weekly?.resetAt);
  if (fiveHour) windows.push(fiveHour);
  if (weekly) windows.push(weekly);

  // The alpha API never states the monthly allowance: it reports what is left
  // this period and what the period has spent. Their sum is the effective cap.
  if (periodSpent !== null && monthlyCredits !== null && periodSpent >= 0 && monthlyCredits >= 0) {
    const cap = periodSpent + monthlyCredits;
    if (cap > 0) {
      const round = (value: number): string => (Math.round(value * 100) / 100).toString();
      windows.push(makeWindow('monthly', '每月', (periodSpent / cap) * 100, periodEnd, `${round(periodSpent)} / ${round(cap)}`));
    }
  }

  const planId = typeof subscriptionData?.planId === 'string' ? subscriptionData.planId : null;
  return {
    plan: shortPlanLabel(planId) ?? (org ? '组织' : null),
    windows,
    balance: makeBalance(monthlyCredits, '积分'),
  };
};

const fetchStepfun = async (credential: Credential | null): Promise<Contribution> => {
  if (!credential) return { configured: false };
  const answer = await fetchJson('https://api.stepfun.com/v1/accounts', {
    Accept: 'application/json',
    Authorization: `Bearer ${credential.key}`,
  });
  if (!answer.ok) throw new Error(`StepFun 账户接口返回 HTTP ${answer.status}`);
  const body = answer.body as { balance?: unknown; total_cash_balance?: unknown; total_voucher_balance?: unknown } | null;
  const total = asNumber(body?.balance);
  const cash = asNumber(body?.total_cash_balance);
  const voucher = asNumber(body?.total_voucher_balance);
  const parts: string[] = [];
  if (cash !== null) parts.push(`现金 ¥${cash.toFixed(2)}`);
  if (voucher !== null) parts.push(`代金券 ¥${voucher.toFixed(2)}`);
  return {
    plan: '预付费',
    balance: makeBalance(total, 'CNY'),
    detail: parts.length > 0 ? parts.join(' · ') : null,
  };
};

const parseSub2Api = (body: Record<string, unknown>): Contribution => {
  const unit = typeof body.unit === 'string' ? body.unit : 'USD';
  const plan = typeof body.planName === 'string' ? body.planName : null;
  const remaining = asNumber(body.remaining) ?? asNumber(body.balance);
  const windows: UsageWindow[] = [];

  const quota = body.quota as { used?: unknown; limit?: unknown; reset_at?: unknown } | undefined;
  if (quota && typeof quota === 'object') {
    const window = windowFromCounts('quota', '额度', quota.used, quota.limit, quota.reset_at);
    if (window) windows.push(window);
  }

  const subscription = body.subscription as { used?: unknown; limit?: unknown; reset_at?: unknown; used_percent?: unknown } | undefined;
  if (subscription && typeof subscription === 'object') {
    const percent = asNumber(subscription.used_percent);
    if (percent !== null) windows.push(makeWindow('subscription', '订阅', percent, subscription.reset_at));
  }

  return {
    plan,
    balance: makeBalance(remaining, unit),
    windows,
  };
};

const parseDashboardBilling = (subscription: Record<string, unknown>, usage: Record<string, unknown> | null): Contribution => {
  const limit = asNumber(subscription.hard_limit_usd) ?? asNumber(subscription.system_hard_limit_usd);
  if (limit === null) throw new Error('无法读取 hard_limit_usd');
  const usedCents = usage ? asNumber(usage.total_usage) : null;
  const used = usedCents === null ? null : usedCents / 100;
  const windows: UsageWindow[] = used === null ? [] : [makeWindow('billing', '额度', limit > 0 ? (used / limit) * 100 : 0, null, `$${used.toFixed(2)} / $${limit.toFixed(2)}`)];
  return { plan: '按量付费', balance: makeBalance(used === null ? null : limit - used, 'USD'), windows, detail: used === null ? '接口未提供已用量，暂无法计算剩余余额' : null };
};

const fetchRelay = async (relay: Relay): Promise<Contribution> => {
  const base = normalizeRelayUrl(relay.baseUrl);
  const deadline = AbortSignal.timeout(12_000);
  const query = async (url: string): Promise<JsonAnswer> => {
    try { return await fetchJson(url, headers, deadline); }
    catch (error) {
      if (deadline.aborted) throw error;
      return { ok: false, status: 0, body: null };
    }
  };
  const headers = { Accept: 'application/json', Authorization: `Bearer ${relay.apiKey}` };

  const usage = await query(`${base}/v1/usage`);
  if (usage.ok && usage.body && typeof usage.body === 'object') {
    const record = usage.body as Record<string, unknown>;
    if ('remaining' in record || 'balance' in record || 'subscription' in record || 'quota' in record) {
      return parseSub2Api(record);
    }
  }

  const subscription = await query(`${base}/v1/dashboard/billing/subscription`);
  if (subscription.ok && subscription.body && typeof subscription.body === 'object' && 'hard_limit_usd' in (subscription.body as Record<string, unknown>)) {
    const usageDetail = await query(`${base}/v1/dashboard/billing/usage`);
    return parseDashboardBilling(
      subscription.body as Record<string, unknown>,
      usageDetail.ok && usageDetail.body && typeof usageDetail.body === 'object' ? (usageDetail.body as Record<string, unknown>) : null,
    );
  }

  const newApi = await query(`${base}/api/usage/token/`);
  if (newApi.ok && newApi.body && typeof newApi.body === 'object') {
    const data = ((newApi.body as { data?: Record<string, unknown> }).data ?? newApi.body) as Record<string, unknown>;
    const remaining = asNumber(data.total_available);
    const used = asNumber(data.total_used);
    const granted = asNumber(data.total_granted);
    if (remaining !== null) {
      const total = granted ?? (used !== null ? remaining + used : null);
      return {
        plan: 'New API',
        balance: makeBalance(remaining / 500_000, 'USD'),
        detail: total !== null ? `总额度 $${(total / 500_000).toFixed(2)}` : null,
      };
    }
  }

  throw new Error([usage.status, subscription.status, newApi.status].includes(401) ? '认证失败，请检查 API Key 是否有效' : [usage.status, subscription.status, newApi.status].includes(403) ? '当前 Key 没有查询余额的权限' : '无法识别余额接口，请检查服务地址及站点是否支持余额查询');
};

// ---------------------------------------------------------------------------
// Assembly
// ---------------------------------------------------------------------------

const buildBalances = async (previous: Provider[]): Promise<BalancesResult> => {
  const credentials = await readCredentials();
  const relays = readConfig().relays;

  const jobs: Array<{ id: string; name: string; run: () => Promise<Contribution> }> = [
    { id: 'command-code', name: 'Command Code', run: () => fetchCommandCode(firstCredential(credentials, ['command-code', 'commandcode'])) },
    { id: 'stepfun', name: 'StepFun', run: () => fetchStepfun(firstCredential(credentials, ['stepfun-step-plan', 'stepfun'])) },
    ...relays.map((relay) => ({
      id: `relay:${relay.id}`,
      name: relay.name,
      run: () => fetchRelay(relay),
    })),
  ];

  const providers = await Promise.all(
    jobs.map(async (job): Promise<Provider | null> => {
      try {
        const contribution = await job.run();
        if (contribution.configured === false) return null;
        return {
          id: job.id,
          name: job.name,
          ok: true,
          plan: contribution.plan ?? null,
          balance: contribution.balance ?? null,
          detail: contribution.detail ?? null,
          windows: contribution.windows ?? [],
          updatedAt: Date.now(),
          stale: false,
        };
      } catch (error) {
        return failedProvider(job.id, job.name, describeError(error), previous.find((provider) => provider.id === job.id));
      }
    }),
  );

  return { fetchedAt: Date.now(), providers: providers.filter((provider) => provider !== null) };
};

const balanceCache = createBalanceCache(buildBalances);

const describeError = (error: unknown): string => {
  if (error instanceof Error && ['TimeoutError', 'AbortError'].includes(error.name)) return '查询超时，请稍后刷新';
  if (error instanceof TypeError) return '无法连接服务，请检查网络或服务地址';
  return error instanceof Error ? error.message : '查询失败，请稍后重试';
};

// ---------------------------------------------------------------------------
// HTTP
// ---------------------------------------------------------------------------

const json = (res: http.ServerResponse, status: number, body: unknown): void => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
};

const readBody = (req: http.IncomingMessage): Promise<Record<string, unknown>> =>
  new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    let failed = false;
    req.on('data', (chunk: Buffer) => {
      if (failed) return;
      size += chunk.length;
      if (size > 64 * 1024) {
        failed = true;
        chunks.length = 0;
        reject(new RequestError(413, '提交内容过大，请缩短字段后重试'));
      } else chunks.push(chunk);
    });
    req.on('error', () => reject(new RequestError(400, '请求中断，请重试')));
    req.on('end', () => {
      if (failed) return;
      try {
        const parsed: unknown = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error();
        resolve(parsed as Record<string, unknown>);
      } catch { reject(new RequestError(400, '请求内容必须是有效的 JSON 对象')); }
    });
  });

const publicRelay = (relay: Relay) => ({ id: relay.id, name: relay.name, baseUrl: relay.baseUrl, hasKey: relay.apiKey.length > 0 });
const field = (body: Record<string, unknown>, key: string, max: number): string => {
  const value = typeof body[key] === 'string' ? body[key].trim() : '';
  if (value.length > max) throw new RequestError(400, `${key} 长度超出限制`);
  return value;
};
const resolveRelay = (body: Record<string, unknown>, config: { relays: Relay[] }): Relay => {
  const id = field(body, 'id', 128);
  const stored = id ? config.relays.find((relay) => relay.id === id) : undefined;
  if (id && !stored) throw new RequestError(404, '此中转站已移除，请重新打开管理页面');
  let baseUrl: string;
  try { baseUrl = normalizeRelayUrl(field(body, 'baseUrl', 2048)); }
  catch (error) { throw new RequestError(400, describeError(error)); }
  const typedKey = field(body, 'apiKey', 4096);
  if (!typedKey && stored && changesRelayOrigin(stored.baseUrl, baseUrl)) {
    throw new RequestError(400, '更换站点地址时，请重新填写该站点的 API Key');
  }
  const apiKey = typedKey || stored?.apiKey || '';
  if (!apiKey) throw new RequestError(400, '请填写 API Key');
  return { id: stored?.id ?? randomUUID(), name: field(body, 'name', 60), baseUrl, apiKey };
};

const handle = async (req: http.IncomingMessage, res: http.ServerResponse): Promise<void> => {
  if (req.headers.authorization !== `Bearer ${token}`) throw new RequestError(401, 'unauthorized');
  const url = new URL(req.url ?? '/', 'http://127.0.0.1');
  if (url.pathname === '/health' && req.method === 'GET') {
    json(res, 200, { ok: true });
  } else if (url.pathname === '/balances' && req.method === 'GET') {
    json(res, 200, await balanceCache.get(url.searchParams.get('refresh') === '1'));
  } else if (url.pathname === '/relays' && req.method === 'GET') {
    json(res, 200, { relays: readConfig().relays.map(publicRelay) });
  } else if (url.pathname === '/relays/test' && req.method === 'POST') {
    const body = await readBody(req);
    const relay = resolveRelay(body, readConfig());
    try {
      const contribution = await fetchRelay(relay);
      json(res, 200, { ok: true, baseUrl: relay.baseUrl, ...contribution });
    } catch (error) {
      json(res, 200, { ok: false, error: describeError(error) });
    }
  } else if (url.pathname === '/relays' && req.method === 'POST') {
    const body = await readBody(req);
    const config = readConfig();
    const relay = resolveRelay(body, config);
    if (!relay.name) throw new RequestError(400, '请填写中转站名称');
    const index = config.relays.findIndex((item) => item.id === relay.id);
    if (index >= 0) config.relays[index] = relay;
    else config.relays.push(relay);
    writeConfig(config);
    balanceCache.invalidate(`relay:${relay.id}`);
    json(res, 200, { relays: config.relays.map(publicRelay) });
  } else if (url.pathname === '/relays' && req.method === 'DELETE') {
    const id = url.searchParams.get('id');
    if (!id) throw new RequestError(400, '缺少中转站编号');
    const config = readConfig();
    config.relays = config.relays.filter((relay) => relay.id !== id);
    writeConfig(config);
    balanceCache.invalidate(`relay:${id}`);
    json(res, 200, { relays: config.relays.map(publicRelay) });
  } else throw new RequestError(404, 'not-found');
};

const server = http.createServer((req, res) => {
  void handle(req, res).catch((error: unknown) => {
    if (!res.headersSent && !res.destroyed) {
      json(res, error instanceof RequestError ? error.status : 500, {
        error: error instanceof RequestError ? error.message : '本地服务处理失败，请重试',
      });
    }
  });
});
server.listen(port, '127.0.0.1');
