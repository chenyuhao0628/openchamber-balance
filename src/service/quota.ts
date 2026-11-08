import type { Provider } from '../shared/types.ts';

/** The credential shape OpenChamber sends for a listed OpenCode provider. */
export type QuotaCredential = { key: string; kind: 'api' | 'oauth' };

export type QuotaRequest = {
  requestId: string;
  provider: string;
  credentials: Record<string, unknown>;
};

export type QuotaWindow = {
  usedPercent: number | null;
  resetAt?: number;
  valueLabel?: string;
};

export type QuotaUsageData = {
  ok: boolean;
  configured: boolean;
  error?: string;
  planLabel?: string | null;
  usage: { windows: Record<string, QuotaWindow> } | null;
};

const MAX_WINDOWS = 32;
const MAX_LABEL = 128;
const MAX_ERROR = 2000;

const isRecord = (value: unknown): value is Record<string, unknown> => (
  !!value && typeof value === 'object' && !Array.isArray(value)
);

const truncate = (value: string, max = MAX_LABEL): string => (
  value.length > max ? `${value.slice(0, max - 1)}…` : value
);

/** Parse the one quota call OpenChamber may post to `/quota`. */
export const readQuotaRequest = (body: unknown): QuotaRequest | null => {
  if (!isRecord(body)) return null;
  if (body.v !== 1 || body.method !== 'usage.read') return null;
  if (typeof body.requestId !== 'string' || !body.requestId || body.requestId.length > 200) return null;
  if (typeof body.provider !== 'string' || !body.provider || body.provider.length > 128) return null;
  const input = body.input;
  if (!isRecord(input) || !isRecord(input.credentials)) return null;
  if (!Object.values(input.credentials).every(isRecord)) return null;
  return {
    requestId: body.requestId,
    provider: body.provider,
    credentials: input.credentials,
  };
};

/** Read one host-provided credential, ignoring provider-specific metadata. */
export const quotaCredential = (value: unknown): QuotaCredential | null => {
  if (!isRecord(value)) return null;
  if (value.type === 'api' && typeof value.key === 'string' && value.key) {
    return { key: value.key, kind: 'api' };
  }
  if (value.type === 'oauth' && typeof value.access === 'string' && value.access) {
    return { key: value.access, kind: 'oauth' };
  }
  return null;
};

const uniqueKey = (windows: Record<string, QuotaWindow>, base: string): string => {
  if (!windows[base]) return base;
  for (let index = 2; index < 100; index += 1) {
    const candidate = `${truncate(base, MAX_LABEL - 5)} (${index})`;
    if (!windows[candidate]) return candidate;
  }
  return truncate(base, MAX_LABEL);
};

export const buildQuotaUsage = (input: {
  providers: Provider[];
  configured: boolean;
}): QuotaUsageData => {
  const windows: Record<string, QuotaWindow> = {};
  let added = 0;
  const add = (providerName: string, label: string, window: QuotaWindow): void => {
    if (added >= MAX_WINDOWS) return;
    const key = uniqueKey(windows, truncate(`${providerName} · ${label}`));
    windows[key] = window;
    added += 1;
  };

  for (const provider of input.providers) {
    const hasData = provider.ok && (
      provider.balance !== null ||
      provider.windows.length > 0 ||
      !!provider.detail
    );
    if (provider.windows.length > 0) {
      for (const window of provider.windows) {
        add(provider.name, window.label, {
          usedPercent: window.usedPercent,
          ...(window.resetAt === null ? {} : { resetAt: window.resetAt }),
          ...(window.detail ? { valueLabel: truncate(window.detail) } : {}),
        });
      }
    }
    if (provider.balance) {
      add(provider.name, '余额', {
        usedPercent: null,
        valueLabel: truncate(provider.balance.label),
      });
    }
    if (provider.windows.length === 0 && !provider.balance) {
      add(provider.name, '状态', {
        usedPercent: null,
        valueLabel: truncate(
          provider.ok
            ? provider.detail ?? '已连接，接口未提供余额或额度'
            : provider.error ?? '查询失败',
        ),
      });
    } else if (!provider.ok) {
      add(provider.name, '状态', {
        usedPercent: null,
        valueLabel: truncate(provider.error ?? '上次结果保留，本次查询失败'),
      });
    } else if (!hasData) {
      add(provider.name, '状态', {
        usedPercent: null,
        valueLabel: '已连接，接口未提供余额或额度',
      });
    }
  }

  const plans = [...new Set(
    input.providers
      .map((provider) => provider.plan)
      .filter((plan): plan is string => !!plan),
  )];
  const failures = input.providers
    .filter((provider) => !provider.ok)
    .map((provider) => `${provider.name}：${provider.error ?? '查询失败'}`);
  const live = input.providers.some((provider) => provider.ok);
  const usage = added > 0 ? { windows } : null;

  return {
    ok: live,
    configured: input.configured,
    ...(failures.length > 0
      ? { error: truncate(failures.slice(0, 2).join('；'), MAX_ERROR) }
      : {}),
    planLabel: plans.length > 0 ? truncate(plans.join(' · ')) : null,
    usage,
  };
};
