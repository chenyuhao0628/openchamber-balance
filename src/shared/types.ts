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

export type RelayKind = 'auto' | 'custom';
export type CustomAuthScheme = 'bearer' | 'raw';
export type CustomMapping = {
  /** Dot/bracket JSON path to a number, for example `data.balance`. */
  balancePath: string;
  /** Currency code or credit unit; defaults to USD. */
  unit: string;
  usedPath: string;
  limitPath: string;
  usedPercentPath: string;
  resetAtPath: string;
  planPath: string;
  detailPath: string;
  windowLabel: string;
};
export type CustomRequest = {
  method: 'GET' | 'POST';
  authHeader: string;
  authScheme: CustomAuthScheme;
  /** Extra headers, one `Name: value` per line. Do not put the API key here. */
  headers: string;
  /** Request body for POST. Do not put the API key here. */
  body: string;
  mapping: CustomMapping;
};
export type Relay = {
  id: string;
  name: string;
  /** Auto relays use a base URL; custom relays use the full request URL. */
  baseUrl: string;
  /** Standalone stored API key, or empty string when reusing `providerId`. */
  apiKey: string;
  /** Optional OpenCode provider ID whose credential is reused read-only. */
  providerId?: string;
  /** Defaults to true when omitted. */
  enabled?: boolean;
  kind?: RelayKind;
  custom?: CustomRequest;
};
export type PublicRelay = {
  id: string;
  name: string;
  baseUrl: string;
  hasKey: boolean;
  providerId?: string;
  enabled: boolean;
  kind: RelayKind;
  custom?: CustomRequest;
};
export type OpencodeProviderCandidate = {
  id: string;
  name: string;
  /** Sanitized base URL from opencode.json(c) without credentials or query params, or null. */
  baseUrl: string | null;
  hasCredential: boolean;
  /** True when declared in opencode.json(c) with a baseURL and not a built-in native quota provider. */
  isCustomConfig: boolean;
};

export const EMPTY_CUSTOM_MAPPING: CustomMapping = {
  balancePath: '',
  unit: 'USD',
  usedPath: '',
  limitPath: '',
  usedPercentPath: '',
  resetAtPath: '',
  planPath: '',
  detailPath: '',
  windowLabel: '额度',
};

export const EMPTY_CUSTOM_REQUEST: CustomRequest = {
  method: 'GET',
  authHeader: 'Authorization',
  authScheme: 'bearer',
  headers: '',
  body: '',
  mapping: { ...EMPTY_CUSTOM_MAPPING },
};
