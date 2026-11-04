import type { Balance, UsageWindow } from '../shared/types.ts';

export const asNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

export const clampPercent = (value: number): number => Math.min(100, Math.max(0, value));

export const toTimestamp = (value: unknown): number | null => {
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

export const formatReset = (timestamp: number | null): string | null => {
  if (timestamp === null) return null;
  const date = new Date(timestamp);
  if (!Number.isFinite(date.getTime())) return null;
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  return sameDay
    ? date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    : date.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export const makeWindow = (
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

export const windowFromCounts = (
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

export const moneyLabel = (value: number, unit: string): string => {
  const symbol = unit === 'USD' || unit === '$' ? '$' : unit === 'CNY' || unit === '¥' ? '¥' : '';
  // Currencies get cents; credit-style units stay to one decimal so the card
  // does not overflow into a wrapped line.
  return symbol ? `${symbol}${value.toFixed(2)}` : `${Math.round(value * 10) / 10} ${unit}`;
};

/**
 * `individual-goat` reads as `GOAT`, `step-plan` as `PLAN`. Anything that is
 * not an id-shaped string (StepFun's 预付费, a relay's 钱包余额) is kept.
 */
export const shortPlanLabel = (plan: string | null): string | null => {
  if (!plan) return null;
  if (!/^[a-z0-9]+(?:[-_][a-z0-9]+)+$/i.test(plan)) return plan;
  const last = plan.split(/[-_]/).pop() ?? plan;
  return last.toUpperCase();
};

export const makeBalance = (value: number | null, unit: string): Balance | null =>
  value === null ? null : { value, label: moneyLabel(value, unit), unit };
