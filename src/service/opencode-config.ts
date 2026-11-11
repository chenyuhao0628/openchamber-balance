import fs from 'node:fs';
import path from 'node:path';
import type { OpencodeProviderCandidate } from '../shared/types.ts';
import { normalizeRelayUrl } from '../shared/relay-url.ts';

/**
 * Providers already natively covered by OpenChamber's built-in Usage cards or
 * by `openchamber-balance`'s own built-in fetchers (`command-code`, `stepfun`).
 * Excluded from the "unlinked custom relay" discovery prompt, while still selectable
 * in the credential-reuse dropdown if credentials exist.
 */
const NATIVE_USAGE_PROVIDER_IDS = new Set([
  'anthropic',
  'claude',
  'openai',
  'codex',
  'cursor',
  'deepseek',
  'deepinfra',
  'google',
  'gemini',
  'antigravity',
  'kimi-for-coding',
  'moonshotai',
  'openrouter',
  'zai-coding-plan',
  'zhipuai-coding-plan',
  'minimax-coding-plan',
  'minimax-cn-coding-plan',
  'github-copilot',
  'nano-gpt',
  'ollama-cloud',
  'opencode',
  'opencode-go',
  'xai',
  'zenmux',
  'kilo',
  'neuralwatt',
  'wafer',
  'exe-dev',
  'hyper',
  'cline-pass',
  'command-code',
  'commandcode',
  'stepfun-step-plan',
  'stepfun',
]);

export const VALID_PROVIDER_ID = /^[a-zA-Z0-9._:@/-]{1,120}$/;

/**
 * Strips `//` line comments, `/* ... * /` block comments, and trailing commas
 * outside JSON string literals so `opencode.jsonc` can be parsed safely with `JSON.parse`.
 */
export const stripJsonc = (input: string): string => {
  let out = '';
  let inString = false;
  let escaped = false;
  let index = 0;

  while (index < input.length) {
    const ch = input[index];
    const next = input[index + 1];

    if (inString) {
      out += ch;
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === '"') inString = false;
      index += 1;
      continue;
    }

    if (ch === '"') {
      inString = true;
      out += ch;
      index += 1;
      continue;
    }

    if (ch === '/' && next === '/') {
      index += 2;
      while (index < input.length && input[index] !== '\n') index += 1;
      continue;
    }

    if (ch === '/' && next === '*') {
      index += 2;
      while (index < input.length && !(input[index] === '*' && input[index + 1] === '/')) {
        if (input[index] === '\n') out += '\n';
        index += 1;
      }
      index += 2;
      continue;
    }

    out += ch;
    index += 1;
  }

  // Strip trailing commas before `}` or `]` outside strings.
  let cleaned = '';
  inString = false;
  escaped = false;
  for (let i = 0; i < out.length; i += 1) {
    const ch = out[i];
    if (inString) {
      cleaned += ch;
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') {
      inString = true;
      cleaned += ch;
      continue;
    }
    if (ch === ',') {
      let lookahead = i + 1;
      while (lookahead < out.length && /\s/.test(out[lookahead])) lookahead += 1;
      if (out[lookahead] === '}' || out[lookahead] === ']') continue;
    }
    cleaned += ch;
  }
  return cleaned;
};

const isRecord = (value: unknown): value is Record<string, unknown> => (
  Boolean(value) && typeof value === 'object' && !Array.isArray(value)
);

const sanitizeConfigBaseUrl = (raw: unknown): string | null => {
  if (typeof raw !== 'string' || !raw.trim()) return null;
  try {
    const parsed = new URL(raw.trim());
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
    // Strip any query/hash/credentials before normalizing so no embedded secret ever leaves the service.
    parsed.username = '';
    parsed.password = '';
    parsed.search = '';
    parsed.hash = '';
    return normalizeRelayUrl(parsed.toString());
  } catch {
    try {
      return normalizeRelayUrl(raw.trim());
    } catch {
      return null;
    }
  }
};

export type ParsedOpencodeProviderConfig = {
  id: string;
  name: string;
  baseUrl: string | null;
  /** Optional literal API key in opencode.json(c) options/settings (never returned to panel!). */
  inlineApiKey: string | null;
};

const extractLiteralKey = (raw: unknown): string | null => {
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed || /^\{env:[^}]+\}$/i.test(trimmed) || /^\$\{[^}]+\}$/.test(trimmed)) return null;
  return trimmed;
};

export const resolveOpencodeConfigDir = (homeDir: string, env: NodeJS.ProcessEnv = process.env): string => {
  if (env.OPENCODE_CONFIG_DIR && env.OPENCODE_CONFIG_DIR.trim()) {
    return env.OPENCODE_CONFIG_DIR.trim();
  }
  if (env.XDG_CONFIG_HOME && env.XDG_CONFIG_HOME.trim()) {
    return path.join(env.XDG_CONFIG_HOME.trim(), 'opencode');
  }
  return path.join(homeDir, '.config', 'opencode');
};

export const readOpencodeProviderConfigs = (configDir: string): Map<string, ParsedOpencodeProviderConfig> => {
  const merged = new Map<string, ParsedOpencodeProviderConfig>();
  for (const filename of ['opencode.json', 'opencode.jsonc']) {
    const fullPath = path.join(configDir, filename);
    let raw: string;
    try {
      raw = fs.readFileSync(fullPath, 'utf8');
    } catch {
      continue;
    }
    let doc: unknown;
    try {
      doc = JSON.parse(stripJsonc(raw));
    } catch {
      continue;
    }
    if (!isRecord(doc)) continue;

    // Support both OpenCode v1 (`provider`) and v2 (`providers`) schemas.
    for (const rootKey of ['provider', 'providers'] as const) {
      const section = doc[rootKey];
      if (!isRecord(section)) continue;
      for (const [id, entry] of Object.entries(section)) {
        if (!VALID_PROVIDER_ID.test(id) || !isRecord(entry)) continue;
        const options = isRecord(entry.options) ? entry.options : null;
        const settings = isRecord(entry.settings) ? entry.settings : null;
        const previous = merged.get(id);
        const name = (typeof entry.name === 'string' && entry.name.trim())
          ? entry.name.trim().slice(0, 60)
          : (previous?.name ?? id);
        const rawUrl = settings?.baseURL ?? settings?.baseUrl ?? options?.baseURL ?? options?.baseUrl ?? entry.api;
        const baseUrl = sanitizeConfigBaseUrl(rawUrl) ?? previous?.baseUrl ?? null;
        const inlineApiKey = extractLiteralKey(settings?.apiKey ?? options?.apiKey ?? entry.apiKey)
          ?? previous?.inlineApiKey
          ?? null;
        merged.set(id, { id, name, baseUrl, inlineApiKey });
      }
    }
  }
  return merged;
};

export const listOpencodeProviderCandidates = (
  configs: Map<string, ParsedOpencodeProviderConfig>,
  credentialIds: Iterable<string>,
): OpencodeProviderCandidate[] => {
  const hasCredSet = new Set(credentialIds);
  const allIds = new Set<string>([...configs.keys(), ...hasCredSet]);
  const list: OpencodeProviderCandidate[] = [];

  for (const id of allIds) {
    if (!VALID_PROVIDER_ID.test(id)) continue;
    const cfg = configs.get(id);
    const hasCredential = hasCredSet.has(id) || Boolean(cfg?.inlineApiKey);
    const baseUrl = cfg?.baseUrl ?? null;
    const isCustomConfig = Boolean(cfg && baseUrl && !NATIVE_USAGE_PROVIDER_IDS.has(id));
    if (!hasCredential && !baseUrl) continue;
    list.push({
      id,
      name: cfg?.name ?? id,
      baseUrl,
      hasCredential,
      isCustomConfig,
    });
  }

  return list.sort((a, b) => {
    if (a.isCustomConfig !== b.isCustomConfig) return a.isCustomConfig ? -1 : 1;
    if (a.hasCredential !== b.hasCredential) return a.hasCredential ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
};
