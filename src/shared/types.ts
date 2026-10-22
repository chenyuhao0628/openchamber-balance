export type UsageWindow = {
  key: string;
  label: string;
  usedPercent: number;
  remainingPercent: number;
  resetAt: number | null;
  resetAtText: string | null;
  detail: string | null;
};

export type Balance = { value: number | null; label: string; unit: string };
export type Provider = {
  id: string;
  name: string;
  ok: boolean;
  plan: string | null;
  balance: Balance | null;
  detail: string | null;
  windows: UsageWindow[];
  updatedAt: number | null;
  stale: boolean;
  error?: string;
};
export type BalancesResult = { fetchedAt: number; providers: Provider[] };
export type PublicRelay = { id: string; name: string; baseUrl: string; hasKey: boolean };
export type Relay = { id: string; name: string; baseUrl: string; apiKey: string };
