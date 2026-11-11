import {
  EMPTY_CUSTOM_MAPPING,
  type CustomRequest,
  type OpencodeProviderCandidate,
  type Provider,
  type PublicRelay as Relay,
  type UsageWindow,
} from '../shared/types.ts';

export const asNumber = (value: unknown): number | null => (typeof value === 'number' && Number.isFinite(value) ? value : null);

const parseWindow = (value: unknown): UsageWindow | null => {
  if (!value || typeof value !== 'object') return null;
  const record = value as Record<string, unknown>;
  const used = asNumber(record.usedPercent);
  if (typeof record.key !== 'string' || typeof record.label !== 'string' || used === null) return null;
  return {
    key: record.key,
    label: record.label,
    usedPercent: used,
    remainingPercent: asNumber(record.remainingPercent) ?? Math.max(0, 100 - used),
    resetAt: asNumber(record.resetAt),
    resetAtText: typeof record.resetAtText === 'string' ? record.resetAtText : null,
    detail: typeof record.detail === 'string' ? record.detail : null,
  };
};

export const parseProvider = (value: unknown): Provider | null => {
  if (!value || typeof value !== 'object') return null;
  const record = value as Record<string, unknown>;
  if (typeof record.id !== 'string' || typeof record.name !== 'string') return null;
  const balanceRecord = record.balance && typeof record.balance === 'object' ? (record.balance as Record<string, unknown>) : null;
  return {
    id: record.id,
    name: record.name,
    ok: record.ok !== false,
    plan: typeof record.plan === 'string' ? record.plan : null,
    balance: balanceRecord && typeof balanceRecord.label === 'string'
      ? { value: asNumber(balanceRecord.value), label: balanceRecord.label, unit: typeof balanceRecord.unit === 'string' ? balanceRecord.unit : '' }
      : null,
    detail: typeof record.detail === 'string' ? record.detail : null,
    windows: Array.isArray(record.windows) ? record.windows.map(parseWindow).filter((window): window is UsageWindow => window !== null) : [],
    updatedAt: asNumber(record.updatedAt),
    stale: record.stale === true,
    error: typeof record.error === 'string' ? record.error : undefined,
  };
};

const text = (value: unknown, fallback = ''): string => typeof value === 'string' ? value : fallback;

const parseCustomRequest = (value: unknown): CustomRequest | undefined => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
  const record = value as Record<string, unknown>;
  const rawMapping = record.mapping;
  if (!rawMapping || typeof rawMapping !== 'object' || Array.isArray(rawMapping)) return undefined;
  const mapping = rawMapping as Record<string, unknown>;
  return {
    method: record.method === 'POST' ? 'POST' : 'GET',
    authHeader: text(record.authHeader, 'Authorization'),
    authScheme: record.authScheme === 'raw' ? 'raw' : 'bearer',
    headers: text(record.headers),
    body: text(record.body),
    mapping: {
      ...EMPTY_CUSTOM_MAPPING,
      balancePath: text(mapping.balancePath),
      unit: text(mapping.unit, 'USD'),
      usedPath: text(mapping.usedPath),
      limitPath: text(mapping.limitPath),
      usedPercentPath: text(mapping.usedPercentPath),
      resetAtPath: text(mapping.resetAtPath),
      planPath: text(mapping.planPath),
      detailPath: text(mapping.detailPath),
      windowLabel: text(mapping.windowLabel, '额度'),
    },
  };
};

export const parseRelay = (value: unknown): Relay | null => {
  if (!value || typeof value !== 'object') return null;
  const record = value as Record<string, unknown>;
  if (typeof record.id !== 'string' || typeof record.name !== 'string' || typeof record.baseUrl !== 'string') return null;
  const kind = record.kind === 'custom' ? 'custom' : 'auto';
  const custom = kind === 'custom' ? parseCustomRequest(record.custom) : undefined;
  if (kind === 'custom' && !custom) return null;
  const providerId = typeof record.providerId === 'string' && record.providerId.trim() ? record.providerId.trim() : undefined;
  return {
    id: record.id,
    name: record.name,
    baseUrl: record.baseUrl,
    hasKey: record.hasKey === true,
    ...(providerId ? { providerId } : {}),
    enabled: record.enabled !== false,
    kind,
    ...(custom ? { custom } : {}),
  };
};

export const parseOpencodeProvider = (value: unknown): OpencodeProviderCandidate | null => {
  if (!value || typeof value !== 'object') return null;
  const record = value as Record<string, unknown>;
  if (typeof record.id !== 'string' || !record.id || typeof record.name !== 'string' || !record.name) return null;
  return {
    id: record.id,
    name: record.name,
    baseUrl: typeof record.baseUrl === 'string' && record.baseUrl ? record.baseUrl : null,
    hasCredential: record.hasCredential === true,
    isCustomConfig: record.isCustomConfig === true,
  };
};
