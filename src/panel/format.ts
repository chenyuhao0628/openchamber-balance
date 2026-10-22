export const formatTime = (timestamp: number, locale = 'zh-CN', date = false): string =>
  new Intl.DateTimeFormat(locale, {
    ...(date ? { month: 'numeric' as const, day: 'numeric' as const } : {}),
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).format(timestamp);

export const formatReset = (timestamp: number | null, locale = 'zh-CN', now = Date.now()): string | null => {
  if (!timestamp || !Number.isFinite(timestamp)) return null;
  if (timestamp <= now) return '重置时间已到，请刷新';
  const target = new Date(timestamp);
  const today = new Date(now);
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const prefix = target.toDateString() === today.toDateString() ? '今天 ' : target.toDateString() === tomorrow.toDateString() ? '明天 ' : '';
  return `${prefix}${formatTime(timestamp, locale, !prefix)} 重置`;
};

export const formatBalance = (value: number | null, unit: string, locale = 'zh-CN'): string => {
  if (value === null || !Number.isFinite(value)) return '—';
  const currency = unit === 'USD' || unit === '$' ? 'USD' : unit === 'CNY' || unit === '¥' ? 'CNY' : null;
  const number = new Intl.NumberFormat(locale, { minimumFractionDigits: currency ? 2 : 0, maximumFractionDigits: currency ? 2 : 1 }).format(value);
  return `${currency === 'USD' ? '$' : currency === 'CNY' ? '¥' : ''}${number}${currency ? '' : ` ${unit}`}`;
};
