import type { Provider, PublicRelay as Relay, UsageWindow } from '../shared/types.ts';

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

export const parseRelay = (value: unknown): Relay | null => {
  if (!value || typeof value !== 'object') return null;
  const record = value as Record<string, unknown>;
  if (typeof record.id !== 'string' || typeof record.name !== 'string' || typeof record.baseUrl !== 'string') return null;
  return { id: record.id, name: record.name, baseUrl: record.baseUrl, hasKey: record.hasKey === true };
};
