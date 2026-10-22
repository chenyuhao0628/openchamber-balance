// src/service/main.ts
import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";

// src/shared/relay-url.ts
var normalizeRelayUrl = (input) => {
  const value = input.trim();
  if (!value) throw new Error("\u8BF7\u586B\u5199\u670D\u52A1\u5730\u5740");
  let url;
  try {
    url = new URL(value.includes("://") ? value : `https://${value}`);
  } catch {
    throw new Error("\u8BF7\u8F93\u5165\u6709\u6548\u7684\u670D\u52A1\u5730\u5740\uFF0C\u4F8B\u5982 https://relay.example.com");
  }
  if (!["https:", "http:"].includes(url.protocol) || !url.hostname) {
    throw new Error("\u670D\u52A1\u5730\u5740\u4EC5\u652F\u6301 HTTP \u6216 HTTPS");
  }
  if (url.username || url.password || url.search || url.hash) {
    throw new Error("\u670D\u52A1\u5730\u5740\u4E0D\u80FD\u5305\u542B\u8D26\u53F7\u3001\u5BC6\u94A5\u3001\u67E5\u8BE2\u53C2\u6570\u6216\u951A\u70B9");
  }
  const pathname = url.pathname.replace(/\/+$/, "").replace(/\/v1$/i, "");
  return `${url.origin}${pathname}`;
};
var changesRelayOrigin = (previous, next) => new URL(normalizeRelayUrl(previous)).origin !== new URL(normalizeRelayUrl(next)).origin;

// src/service/cache.ts
var createBalanceCache = (load) => {
  let cached = null;
  let previous = [];
  let revision = 0;
  let pending = null;
  const get = async (force = false) => {
    const started = revision;
    if (!force && cached) return cached;
    if (!pending || pending.revision !== started) {
      const promise = load(previous).then((result) => {
        if (revision === started) {
          cached = result;
          previous = result.providers;
        }
        return result;
      });
      pending = { revision: started, promise };
      void promise.finally(() => {
        if (pending?.promise === promise) pending = null;
      }).catch(() => void 0);
    }
    try {
      const result = await pending.promise;
      return revision === started ? result : get();
    } catch (error) {
      if (revision !== started) return get();
      throw error;
    }
  };
  const invalidate = (providerId) => {
    revision += 1;
    cached = null;
    previous = previous.filter((provider) => provider.id !== providerId);
  };
  return { get, invalidate };
};
var failedProvider = (id, name, error, previous) => ({
  id,
  name,
  ok: false,
  plan: previous?.plan ?? null,
  balance: previous?.balance ?? null,
  detail: previous?.detail ?? null,
  windows: previous?.windows ?? [],
  updatedAt: previous?.updatedAt ?? null,
  stale: previous?.updatedAt != null,
  error
});

// src/service/main.ts
var port = Number(process.env.OPENCHAMBER_SERVICE_PORT);
var token = process.env.OPENCHAMBER_SERVICE_TOKEN ?? "";
if (!port || !token) {
  console.error("OPENCHAMBER_SERVICE_PORT and OPENCHAMBER_SERVICE_TOKEN are required");
  process.exit(1);
}
var HOME = os.homedir();
var OPENCODE_DATA_DIR = path.join(HOME, ".local", "share", "opencode");
var OPENCODE_DB_FILE = path.join(
  OPENCODE_DATA_DIR,
  process.env.OPENCODE_DB && process.env.OPENCODE_DB !== ":memory:" ? process.env.OPENCODE_DB : "opencode.db"
);
var CONFIG_DIR = path.join(HOME, ".config", "openchamber", "balance");
var CONFIG_FILE = path.join(CONFIG_DIR, "config.json");
var REQUEST_TIMEOUT_MS = 8e3;
var projectCredential = (raw) => {
  let value = raw;
  if (typeof raw === "string") {
    try {
      value = JSON.parse(raw);
    } catch {
      return null;
    }
  }
  if (!value || typeof value !== "object") return null;
  const record = value;
  if (record.type === "key" && typeof record.key === "string") return { key: record.key, kind: "api" };
  if (record.type === "oauth" && typeof record.access === "string") return { key: record.access, kind: "oauth" };
  if (typeof record.key === "string") return { key: record.key, kind: "api" };
  if (typeof record.access === "string") return { key: record.access, kind: "oauth" };
  return null;
};
var databaseSyncPromise = null;
var loadDatabaseSync = () => {
  if (!databaseSyncPromise) {
    databaseSyncPromise = import("node:sqlite").then((module) => module.DatabaseSync ?? null).catch(() => null);
  }
  return databaseSyncPromise;
};
var readCredentials = async () => {
  const result = {};
  const DatabaseSync = await loadDatabaseSync();
  if (DatabaseSync && fs.existsSync(OPENCODE_DB_FILE)) {
    let db = null;
    try {
      db = new DatabaseSync(OPENCODE_DB_FILE, { readOnly: true });
      const rows = db.prepare(
        "SELECT integration_id, value, active, time_updated FROM credential WHERE integration_id IS NOT NULL ORDER BY integration_id, active DESC, time_updated DESC"
      ).all();
      for (const row of rows) {
        const id = typeof row.integration_id === "string" ? row.integration_id : "";
        if (!id || id in result) continue;
        const credential = projectCredential(row.value);
        if (credential) result[id] = credential;
      }
      return result;
    } catch (error) {
      console.warn("balance service: could not read OpenCode credentials database:", error instanceof Error ? error.message : error);
    } finally {
      try {
        db?.close();
      } catch {
      }
    }
  }
  try {
    const legacy = JSON.parse(fs.readFileSync(path.join(OPENCODE_DATA_DIR, "auth.json"), "utf8"));
    for (const [id, entry] of Object.entries(legacy)) {
      const credential = projectCredential(entry);
      if (credential) result[id] = credential;
    }
  } catch {
  }
  return result;
};
var firstCredential = (credentials, ids) => {
  for (const id of ids) {
    const found = credentials[id];
    if (found?.key) return found;
  }
  return null;
};
var isRelay = (value) => {
  if (!value || typeof value !== "object") return false;
  const record = value;
  return typeof record.id === "string" && typeof record.name === "string" && typeof record.baseUrl === "string" && typeof record.apiKey === "string";
};
var RequestError = class extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
};
var readConfig = () => {
  let raw;
  try {
    raw = fs.readFileSync(CONFIG_FILE, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return { relays: [] };
    throw new RequestError(500, "\u65E0\u6CD5\u8BFB\u53D6\u4E2D\u8F6C\u7AD9\u914D\u7F6E\uFF0C\u8BF7\u68C0\u67E5\u6587\u4EF6\u6743\u9650");
  }
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    const relays = parsed.relays ?? [];
    if (!Array.isArray(relays) || !relays.every(isRelay)) throw new Error();
    return { relays };
  } catch {
    throw new RequestError(500, "\u4E2D\u8F6C\u7AD9\u914D\u7F6E\u683C\u5F0F\u6709\u8BEF\uFF0C\u8BF7\u4FEE\u590D config.json \u540E\u91CD\u8BD5\uFF1B\u73B0\u6709\u6587\u4EF6\u672A\u4FEE\u6539");
  }
};
var writeConfig = (config) => {
  fs.mkdirSync(CONFIG_DIR, { recursive: true, mode: 448 });
  const temporary = `${CONFIG_FILE}.${randomUUID()}.tmp`;
  try {
    fs.writeFileSync(temporary, JSON.stringify(config, null, 2), { mode: 384 });
    fs.renameSync(temporary, CONFIG_FILE);
  } catch {
    try {
      fs.unlinkSync(temporary);
    } catch {
    }
    throw new RequestError(500, "\u4FDD\u5B58\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u914D\u7F6E\u76EE\u5F55\u7684\u5199\u5165\u6743\u9650");
  }
};
var fetchJson = async (url, headers, signal = AbortSignal.timeout(REQUEST_TIMEOUT_MS)) => {
  const response = await fetch(url, { headers, signal });
  const text = await response.text();
  let body = null;
  try {
    body = JSON.parse(text);
  } catch {
    body = null;
  }
  return { status: response.status, ok: response.ok, body };
};
var asNumber = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};
var clampPercent = (value) => Math.min(100, Math.max(0, value));
var toTimestamp = (value) => {
  const numeric = asNumber(value);
  if (numeric !== null) {
    if (numeric <= 0) return null;
    return numeric < 1e12 ? numeric * 1e3 : numeric;
  }
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
};
var formatReset = (timestamp) => {
  if (timestamp === null) return null;
  const date = new Date(timestamp);
  if (!Number.isFinite(date.getTime())) return null;
  const now = /* @__PURE__ */ new Date();
  const sameDay = date.toDateString() === now.toDateString();
  return sameDay ? date.toLocaleTimeString(void 0, { hour: "2-digit", minute: "2-digit" }) : date.toLocaleString(void 0, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
};
var makeWindow = (key, label, usedPercent, resetAtRaw, detail) => {
  const used = clampPercent(usedPercent);
  const resetAt = toTimestamp(resetAtRaw);
  return {
    key,
    label,
    usedPercent: used,
    remainingPercent: clampPercent(100 - used),
    resetAt,
    resetAtText: formatReset(resetAt),
    detail: detail ?? null
  };
};
var windowFromCounts = (key, label, usedRaw, capRaw, resetAtRaw) => {
  const used = asNumber(usedRaw);
  const cap = asNumber(capRaw);
  if (used === null || cap === null || cap <= 0) return null;
  const round = (value) => (Math.round(value * 100) / 100).toString();
  return makeWindow(key, label, used / cap * 100, resetAtRaw, `${round(used)} / ${round(cap)}`);
};
var moneyLabel = (value, unit) => {
  const symbol = unit === "USD" || unit === "$" ? "$" : unit === "CNY" || unit === "\xA5" ? "\xA5" : "";
  return symbol ? `${symbol}${value.toFixed(2)}` : `${Math.round(value * 10) / 10} ${unit}`;
};
var shortPlanLabel = (plan) => {
  if (!plan) return null;
  if (!/^[a-z0-9]+(?:[-_][a-z0-9]+)+$/i.test(plan)) return plan;
  const last = plan.split(/[-_]/).pop() ?? plan;
  return last.toUpperCase();
};
var makeBalance = (value, unit) => value === null ? null : { value, label: moneyLabel(value, unit), unit };
var COMMAND_CODE_HEADERS = {
  Accept: "application/json",
  "User-Agent": "command-code/0.40.0",
  "x-cli-environment": "production",
  "x-command-code-version": "0.40.0"
};
var fetchCommandCode = async (credential) => {
  if (!credential) return { configured: false };
  const headers = {
    ...COMMAND_CODE_HEADERS,
    Authorization: `Bearer ${credential.key}`,
    "x-api-key": credential.key
  };
  const whoami = await fetchJson("https://api.commandcode.ai/alpha/whoami", headers);
  if (!whoami.ok) throw new Error(`Command Code whoami \u8FD4\u56DE HTTP ${whoami.status}`);
  const org = whoami.body?.org ?? null;
  const orgId = org && typeof org.id === "string" ? org.id : null;
  const creditsUrl = orgId ? `https://api.commandcode.ai/alpha/billing/credits?orgId=${encodeURIComponent(orgId)}` : "https://api.commandcode.ai/alpha/billing/credits";
  const [credits, subscriptions, summary] = await Promise.all([
    fetchJson(creditsUrl, headers),
    fetchJson("https://api.commandcode.ai/alpha/billing/subscriptions", headers).catch(() => null),
    fetchJson("https://api.commandcode.ai/alpha/usage/summary", headers).catch(() => null)
  ]);
  if (!credits.ok) throw new Error(`Command Code \u8D26\u5355\u63A5\u53E3\u8FD4\u56DE HTTP ${credits.status}`);
  const body = credits.body;
  const subscriptionData = subscriptions?.ok ? subscriptions.body?.data ?? null : null;
  const periodEnd = subscriptionData?.currentPeriodEnd ?? subscriptionData?.expiresAt ?? null;
  const periodSpent = summary?.ok ? asNumber(summary.body?.totalCredits) ?? asNumber(summary.body?.totalCost) : null;
  const monthlyCredits = asNumber(body?.credits?.monthlyCredits);
  const windows = [];
  const fiveHour = windowFromCounts("5h", "5 \u5C0F\u65F6", body?.windowLimits?.fiveHour?.used, body?.windowLimits?.fiveHour?.cap, body?.windowLimits?.fiveHour?.resetAt);
  const weekly = windowFromCounts("weekly", "\u6BCF\u5468", body?.windowLimits?.weekly?.used, body?.windowLimits?.weekly?.cap, body?.windowLimits?.weekly?.resetAt);
  if (fiveHour) windows.push(fiveHour);
  if (weekly) windows.push(weekly);
  if (periodSpent !== null && monthlyCredits !== null && periodSpent >= 0 && monthlyCredits >= 0) {
    const cap = periodSpent + monthlyCredits;
    if (cap > 0) {
      const round = (value) => (Math.round(value * 100) / 100).toString();
      windows.push(makeWindow("monthly", "\u6BCF\u6708", periodSpent / cap * 100, periodEnd, `${round(periodSpent)} / ${round(cap)}`));
    }
  }
  const planId = typeof subscriptionData?.planId === "string" ? subscriptionData.planId : null;
  return {
    plan: shortPlanLabel(planId) ?? (org ? "\u7EC4\u7EC7" : null),
    windows,
    balance: makeBalance(monthlyCredits, "\u79EF\u5206")
  };
};
var fetchStepfun = async (credential) => {
  if (!credential) return { configured: false };
  const answer = await fetchJson("https://api.stepfun.com/v1/accounts", {
    Accept: "application/json",
    Authorization: `Bearer ${credential.key}`
  });
  if (!answer.ok) throw new Error(`StepFun \u8D26\u6237\u63A5\u53E3\u8FD4\u56DE HTTP ${answer.status}`);
  const body = answer.body;
  const total = asNumber(body?.balance);
  const cash = asNumber(body?.total_cash_balance);
  const voucher = asNumber(body?.total_voucher_balance);
  const parts = [];
  if (cash !== null) parts.push(`\u73B0\u91D1 \xA5${cash.toFixed(2)}`);
  if (voucher !== null) parts.push(`\u4EE3\u91D1\u5238 \xA5${voucher.toFixed(2)}`);
  return {
    plan: "\u9884\u4ED8\u8D39",
    balance: makeBalance(total, "CNY"),
    detail: parts.length > 0 ? parts.join(" \xB7 ") : null
  };
};
var parseSub2Api = (body) => {
  const unit = typeof body.unit === "string" ? body.unit : "USD";
  const plan = typeof body.planName === "string" ? body.planName : null;
  const remaining = asNumber(body.remaining) ?? asNumber(body.balance);
  const windows = [];
  const quota = body.quota;
  if (quota && typeof quota === "object") {
    const window = windowFromCounts("quota", "\u989D\u5EA6", quota.used, quota.limit, quota.reset_at);
    if (window) windows.push(window);
  }
  const subscription = body.subscription;
  if (subscription && typeof subscription === "object") {
    const percent = asNumber(subscription.used_percent);
    if (percent !== null) windows.push(makeWindow("subscription", "\u8BA2\u9605", percent, subscription.reset_at));
  }
  return {
    plan,
    balance: makeBalance(remaining, unit),
    windows
  };
};
var parseDashboardBilling = (subscription, usage) => {
  const limit = asNumber(subscription.hard_limit_usd) ?? asNumber(subscription.system_hard_limit_usd);
  if (limit === null) throw new Error("\u65E0\u6CD5\u8BFB\u53D6 hard_limit_usd");
  const usedCents = usage ? asNumber(usage.total_usage) : null;
  const used = usedCents === null ? null : usedCents / 100;
  const windows = used === null ? [] : [makeWindow("billing", "\u989D\u5EA6", limit > 0 ? used / limit * 100 : 0, null, `$${used.toFixed(2)} / $${limit.toFixed(2)}`)];
  return { plan: "\u6309\u91CF\u4ED8\u8D39", balance: makeBalance(used === null ? null : limit - used, "USD"), windows, detail: used === null ? "\u63A5\u53E3\u672A\u63D0\u4F9B\u5DF2\u7528\u91CF\uFF0C\u6682\u65E0\u6CD5\u8BA1\u7B97\u5269\u4F59\u4F59\u989D" : null };
};
var fetchRelay = async (relay) => {
  const base = normalizeRelayUrl(relay.baseUrl);
  const deadline = AbortSignal.timeout(12e3);
  const query = async (url) => {
    try {
      return await fetchJson(url, headers, deadline);
    } catch (error) {
      if (deadline.aborted) throw error;
      return { ok: false, status: 0, body: null };
    }
  };
  const headers = { Accept: "application/json", Authorization: `Bearer ${relay.apiKey}` };
  const usage = await query(`${base}/v1/usage`);
  if (usage.ok && usage.body && typeof usage.body === "object") {
    const record = usage.body;
    if ("remaining" in record || "balance" in record || "subscription" in record || "quota" in record) {
      return parseSub2Api(record);
    }
  }
  const subscription = await query(`${base}/v1/dashboard/billing/subscription`);
  if (subscription.ok && subscription.body && typeof subscription.body === "object" && "hard_limit_usd" in subscription.body) {
    const usageDetail = await query(`${base}/v1/dashboard/billing/usage`);
    return parseDashboardBilling(
      subscription.body,
      usageDetail.ok && usageDetail.body && typeof usageDetail.body === "object" ? usageDetail.body : null
    );
  }
  const newApi = await query(`${base}/api/usage/token/`);
  if (newApi.ok && newApi.body && typeof newApi.body === "object") {
    const data = newApi.body.data ?? newApi.body;
    const remaining = asNumber(data.total_available);
    const used = asNumber(data.total_used);
    const granted = asNumber(data.total_granted);
    if (remaining !== null) {
      const total = granted ?? (used !== null ? remaining + used : null);
      return {
        plan: "New API",
        balance: makeBalance(remaining / 5e5, "USD"),
        detail: total !== null ? `\u603B\u989D\u5EA6 $${(total / 5e5).toFixed(2)}` : null
      };
    }
  }
  throw new Error([usage.status, subscription.status, newApi.status].includes(401) ? "\u8BA4\u8BC1\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5 API Key \u662F\u5426\u6709\u6548" : [usage.status, subscription.status, newApi.status].includes(403) ? "\u5F53\u524D Key \u6CA1\u6709\u67E5\u8BE2\u4F59\u989D\u7684\u6743\u9650" : "\u65E0\u6CD5\u8BC6\u522B\u4F59\u989D\u63A5\u53E3\uFF0C\u8BF7\u68C0\u67E5\u670D\u52A1\u5730\u5740\u53CA\u7AD9\u70B9\u662F\u5426\u652F\u6301\u4F59\u989D\u67E5\u8BE2");
};
var buildBalances = async (previous) => {
  const credentials = await readCredentials();
  const relays = readConfig().relays;
  const jobs = [
    { id: "command-code", name: "Command Code", run: () => fetchCommandCode(firstCredential(credentials, ["command-code", "commandcode"])) },
    { id: "stepfun", name: "StepFun", run: () => fetchStepfun(firstCredential(credentials, ["stepfun-step-plan", "stepfun"])) },
    ...relays.map((relay) => ({
      id: `relay:${relay.id}`,
      name: relay.name,
      run: () => fetchRelay(relay)
    }))
  ];
  const providers = await Promise.all(
    jobs.map(async (job) => {
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
          stale: false
        };
      } catch (error) {
        return failedProvider(job.id, job.name, describeError(error), previous.find((provider) => provider.id === job.id));
      }
    })
  );
  return { fetchedAt: Date.now(), providers: providers.filter((provider) => provider !== null) };
};
var balanceCache = createBalanceCache(buildBalances);
var describeError = (error) => {
  if (error instanceof Error && ["TimeoutError", "AbortError"].includes(error.name)) return "\u67E5\u8BE2\u8D85\u65F6\uFF0C\u8BF7\u7A0D\u540E\u5237\u65B0";
  if (error instanceof TypeError) return "\u65E0\u6CD5\u8FDE\u63A5\u670D\u52A1\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC\u6216\u670D\u52A1\u5730\u5740";
  return error instanceof Error ? error.message : "\u67E5\u8BE2\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5";
};
var json = (res, status, body) => {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
};
var readBody = (req) => new Promise((resolve, reject) => {
  const chunks = [];
  let size = 0;
  let failed = false;
  req.on("data", (chunk) => {
    if (failed) return;
    size += chunk.length;
    if (size > 64 * 1024) {
      failed = true;
      chunks.length = 0;
      reject(new RequestError(413, "\u63D0\u4EA4\u5185\u5BB9\u8FC7\u5927\uFF0C\u8BF7\u7F29\u77ED\u5B57\u6BB5\u540E\u91CD\u8BD5"));
    } else chunks.push(chunk);
  });
  req.on("error", () => reject(new RequestError(400, "\u8BF7\u6C42\u4E2D\u65AD\uFF0C\u8BF7\u91CD\u8BD5")));
  req.on("end", () => {
    if (failed) return;
    try {
      const parsed = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
      resolve(parsed);
    } catch {
      reject(new RequestError(400, "\u8BF7\u6C42\u5185\u5BB9\u5FC5\u987B\u662F\u6709\u6548\u7684 JSON \u5BF9\u8C61"));
    }
  });
});
var publicRelay = (relay) => ({ id: relay.id, name: relay.name, baseUrl: relay.baseUrl, hasKey: relay.apiKey.length > 0 });
var field = (body, key, max) => {
  const value = typeof body[key] === "string" ? body[key].trim() : "";
  if (value.length > max) throw new RequestError(400, `${key} \u957F\u5EA6\u8D85\u51FA\u9650\u5236`);
  return value;
};
var resolveRelay = (body, config) => {
  const id = field(body, "id", 128);
  const stored = id ? config.relays.find((relay) => relay.id === id) : void 0;
  if (id && !stored) throw new RequestError(404, "\u6B64\u4E2D\u8F6C\u7AD9\u5DF2\u79FB\u9664\uFF0C\u8BF7\u91CD\u65B0\u6253\u5F00\u7BA1\u7406\u9875\u9762");
  let baseUrl;
  try {
    baseUrl = normalizeRelayUrl(field(body, "baseUrl", 2048));
  } catch (error) {
    throw new RequestError(400, describeError(error));
  }
  const typedKey = field(body, "apiKey", 4096);
  if (!typedKey && stored && changesRelayOrigin(stored.baseUrl, baseUrl)) {
    throw new RequestError(400, "\u66F4\u6362\u7AD9\u70B9\u5730\u5740\u65F6\uFF0C\u8BF7\u91CD\u65B0\u586B\u5199\u8BE5\u7AD9\u70B9\u7684 API Key");
  }
  const apiKey = typedKey || stored?.apiKey || "";
  if (!apiKey) throw new RequestError(400, "\u8BF7\u586B\u5199 API Key");
  return { id: stored?.id ?? randomUUID(), name: field(body, "name", 60), baseUrl, apiKey };
};
var handle = async (req, res) => {
  if (req.headers.authorization !== `Bearer ${token}`) throw new RequestError(401, "unauthorized");
  const url = new URL(req.url ?? "/", "http://127.0.0.1");
  if (url.pathname === "/health" && req.method === "GET") {
    json(res, 200, { ok: true });
  } else if (url.pathname === "/balances" && req.method === "GET") {
    json(res, 200, await balanceCache.get(url.searchParams.get("refresh") === "1"));
  } else if (url.pathname === "/relays" && req.method === "GET") {
    json(res, 200, { relays: readConfig().relays.map(publicRelay) });
  } else if (url.pathname === "/relays/test" && req.method === "POST") {
    const body = await readBody(req);
    const relay = resolveRelay(body, readConfig());
    try {
      const contribution = await fetchRelay(relay);
      json(res, 200, { ok: true, baseUrl: relay.baseUrl, ...contribution });
    } catch (error) {
      json(res, 200, { ok: false, error: describeError(error) });
    }
  } else if (url.pathname === "/relays" && req.method === "POST") {
    const body = await readBody(req);
    const config = readConfig();
    const relay = resolveRelay(body, config);
    if (!relay.name) throw new RequestError(400, "\u8BF7\u586B\u5199\u4E2D\u8F6C\u7AD9\u540D\u79F0");
    const index = config.relays.findIndex((item) => item.id === relay.id);
    if (index >= 0) config.relays[index] = relay;
    else config.relays.push(relay);
    writeConfig(config);
    balanceCache.invalidate(`relay:${relay.id}`);
    json(res, 200, { relays: config.relays.map(publicRelay) });
  } else if (url.pathname === "/relays" && req.method === "DELETE") {
    const id = url.searchParams.get("id");
    if (!id) throw new RequestError(400, "\u7F3A\u5C11\u4E2D\u8F6C\u7AD9\u7F16\u53F7");
    const config = readConfig();
    config.relays = config.relays.filter((relay) => relay.id !== id);
    writeConfig(config);
    balanceCache.invalidate(`relay:${id}`);
    json(res, 200, { relays: config.relays.map(publicRelay) });
  } else throw new RequestError(404, "not-found");
};
var server = http.createServer((req, res) => {
  void handle(req, res).catch((error) => {
    if (!res.headersSent && !res.destroyed) {
      json(res, error instanceof RequestError ? error.status : 500, {
        error: error instanceof RequestError ? error.message : "\u672C\u5730\u670D\u52A1\u5904\u7406\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5"
      });
    }
  });
});
server.listen(port, "127.0.0.1");
