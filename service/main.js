// src/service/main.ts
import http from "node:http";
import fs2 from "node:fs";
import os from "node:os";
import path2 from "node:path";
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
var normalizeEndpointUrl = (input) => {
  const value = input.trim();
  if (!value) throw new Error("\u8BF7\u586B\u5199\u63A5\u53E3\u5730\u5740");
  let url;
  try {
    url = new URL(value.includes("://") ? value : `https://${value}`);
  } catch {
    throw new Error("\u8BF7\u8F93\u5165\u6709\u6548\u7684\u63A5\u53E3\u5730\u5740\uFF0C\u4F8B\u5982 https://api.example.com/v1/balance");
  }
  if (!["https:", "http:"].includes(url.protocol) || !url.hostname) {
    throw new Error("\u63A5\u53E3\u5730\u5740\u4EC5\u652F\u6301 HTTP \u6216 HTTPS");
  }
  if (url.username || url.password || url.hash) {
    throw new Error("\u63A5\u53E3\u5730\u5740\u4E0D\u80FD\u5305\u542B\u8D26\u53F7\u3001\u5BC6\u7801\u6216\u951A\u70B9");
  }
  return url.toString();
};
var changesEndpointOrigin = (previous, next) => new URL(normalizeEndpointUrl(previous)).origin !== new URL(normalizeEndpointUrl(next)).origin;

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

// src/service/normalize.ts
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

// src/service/custom.ts
var pathTokens = (path3) => {
  const cleaned = path3.trim().replace(/^\$\.?/, "");
  if (!cleaned) return [];
  return cleaned.replace(/\[(\d+)\]/g, ".$1").split(".").filter((token2) => token2.length > 0);
};
var readPath = (value, path3) => {
  let current = value;
  for (const token2 of pathTokens(path3)) {
    if (token2 === "__proto__" || token2 === "prototype" || token2 === "constructor") return void 0;
    if (Array.isArray(current)) {
      const index = Number(token2);
      if (!Number.isInteger(index) || index < 0) return void 0;
      current = current[index];
    } else if (current && typeof current === "object") {
      current = current[token2];
    } else {
      return void 0;
    }
  }
  return current;
};
var textAt = (value, path3) => {
  if (!path3.trim()) return null;
  const found = readPath(value, path3);
  return typeof found === "string" && found.trim() ? found.trim() : null;
};
var numberAt = (value, path3) => {
  if (!path3.trim()) return null;
  return asNumber(readPath(value, path3));
};
var hasAnyCustomMapping = (mapping) => Boolean(
  mapping.balancePath.trim() || mapping.usedPath.trim() || mapping.limitPath.trim() || mapping.usedPercentPath.trim()
);
var validateCustomRequest = (request, options = {}) => {
  if (request.method !== "GET" && request.method !== "POST") throw new Error("\u8BF7\u6C42\u65B9\u5F0F\u5FC5\u987B\u662F GET \u6216 POST");
  if (request.authHeader.trim().length > 100) throw new Error("\u8BA4\u8BC1\u8BF7\u6C42\u5934\u540D\u79F0\u8FC7\u957F");
  if (request.headers.length > 8e3) throw new Error("\u989D\u5916\u8BF7\u6C42\u5934\u8FC7\u957F");
  if (request.body.length > 16e3) throw new Error("\u8BF7\u6C42\u4F53\u8FC7\u957F");
  if (request.method === "GET" && request.body.trim()) throw new Error("GET \u8BF7\u6C42\u4E0D\u80FD\u5305\u542B\u8BF7\u6C42\u4F53\u3002");
  const { mapping } = request;
  if (!options.allowEmptyMapping && !hasAnyCustomMapping(mapping)) {
    throw new Error("\u8BF7\u81F3\u5C11\u586B\u5199\u4F59\u989D\u5B57\u6BB5\u6216\u989D\u5EA6\u5B57\u6BB5\u3002");
  }
  if (mapping.balancePath.length > 300 || mapping.usedPath.length > 300 || mapping.limitPath.length > 300 || mapping.usedPercentPath.length > 300 || mapping.resetAtPath.length > 300 || mapping.planPath.length > 300 || mapping.detailPath.length > 300) {
    throw new Error("\u54CD\u5E94\u5B57\u6BB5\u8DEF\u5F84\u8FC7\u957F");
  }
  if (mapping.unit.length > 20) throw new Error("\u5355\u4F4D\u8FC7\u957F");
  if (mapping.windowLabel.length > 40) throw new Error("\u989D\u5EA6\u7A97\u53E3\u540D\u79F0\u8FC7\u957F");
};
var parseCustomContribution = (body, mapping) => {
  if (!body || typeof body !== "object") throw new Error("\u81EA\u5B9A\u4E49\u63A5\u53E3\u8FD4\u56DE\u7684\u4E0D\u662F JSON \u5BF9\u8C61");
  const unit = mapping.unit.trim() || "USD";
  const balance = numberAt(body, mapping.balancePath);
  const plan = textAt(body, mapping.planPath);
  const detail = textAt(body, mapping.detailPath);
  const windows = [];
  let usedPercent = numberAt(body, mapping.usedPercentPath);
  const used = numberAt(body, mapping.usedPath);
  const limit = numberAt(body, mapping.limitPath);
  if (usedPercent === null && used !== null && limit !== null && limit > 0) usedPercent = used / limit * 100;
  if (usedPercent !== null) {
    const resetAt = mapping.resetAtPath.trim() ? readPath(body, mapping.resetAtPath) : null;
    const countDetail = used !== null && limit !== null ? `${used} / ${limit}` : null;
    windows.push(makeWindow("custom", mapping.windowLabel.trim() || "\u989D\u5EA6", usedPercent, resetAt, countDetail));
  }
  if (balance === null && windows.length === 0) {
    throw new Error("\u81EA\u5B9A\u4E49\u63A5\u53E3\u6CA1\u6709\u53EF\u5C55\u793A\u7684\u4F59\u989D\u6216\u989D\u5EA6\uFF1B\u8BF7\u68C0\u67E5\u5B57\u6BB5\u8DEF\u5F84");
  }
  return {
    plan,
    balance: balance === null ? null : makeBalance(balance, unit),
    detail,
    windows
  };
};

// src/service/opencode-config.ts
import fs from "node:fs";
import path from "node:path";
var NATIVE_USAGE_PROVIDER_IDS = /* @__PURE__ */ new Set([
  "anthropic",
  "claude",
  "openai",
  "codex",
  "cursor",
  "deepseek",
  "deepinfra",
  "google",
  "gemini",
  "antigravity",
  "kimi-for-coding",
  "moonshotai",
  "openrouter",
  "zai-coding-plan",
  "zhipuai-coding-plan",
  "minimax-coding-plan",
  "minimax-cn-coding-plan",
  "github-copilot",
  "nano-gpt",
  "ollama-cloud",
  "opencode",
  "opencode-go",
  "xai",
  "zenmux",
  "kilo",
  "neuralwatt",
  "wafer",
  "exe-dev",
  "hyper",
  "cline-pass",
  "command-code",
  "commandcode",
  "stepfun-step-plan",
  "stepfun"
]);
var VALID_PROVIDER_ID = /^[a-zA-Z0-9._:@/-]{1,120}$/;
var stripJsonc = (input) => {
  let out = "";
  let inString = false;
  let escaped = false;
  let index = 0;
  while (index < input.length) {
    const ch = input[index];
    const next = input[index + 1];
    if (inString) {
      out += ch;
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
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
    if (ch === "/" && next === "/") {
      index += 2;
      while (index < input.length && input[index] !== "\n") index += 1;
      continue;
    }
    if (ch === "/" && next === "*") {
      index += 2;
      while (index < input.length && !(input[index] === "*" && input[index + 1] === "/")) {
        if (input[index] === "\n") out += "\n";
        index += 1;
      }
      index += 2;
      continue;
    }
    out += ch;
    index += 1;
  }
  let cleaned = "";
  inString = false;
  escaped = false;
  for (let i = 0; i < out.length; i += 1) {
    const ch = out[i];
    if (inString) {
      cleaned += ch;
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') {
      inString = true;
      cleaned += ch;
      continue;
    }
    if (ch === ",") {
      let lookahead = i + 1;
      while (lookahead < out.length && /\s/.test(out[lookahead])) lookahead += 1;
      if (out[lookahead] === "}" || out[lookahead] === "]") continue;
    }
    cleaned += ch;
  }
  return cleaned;
};
var isRecord = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);
var sanitizeConfigBaseUrl = (raw) => {
  if (typeof raw !== "string" || !raw.trim()) return null;
  try {
    const parsed = new URL(raw.trim());
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    parsed.username = "";
    parsed.password = "";
    parsed.search = "";
    parsed.hash = "";
    return normalizeRelayUrl(parsed.toString());
  } catch {
    try {
      return normalizeRelayUrl(raw.trim());
    } catch {
      return null;
    }
  }
};
var extractLiteralKey = (raw) => {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed || /^\{env:[^}]+\}$/i.test(trimmed) || /^\$\{[^}]+\}$/.test(trimmed)) return null;
  return trimmed;
};
var resolveOpencodeConfigDir = (homeDir, env = process.env) => {
  if (env.OPENCODE_CONFIG_DIR && env.OPENCODE_CONFIG_DIR.trim()) {
    return env.OPENCODE_CONFIG_DIR.trim();
  }
  if (env.XDG_CONFIG_HOME && env.XDG_CONFIG_HOME.trim()) {
    return path.join(env.XDG_CONFIG_HOME.trim(), "opencode");
  }
  return path.join(homeDir, ".config", "opencode");
};
var readOpencodeProviderConfigs = (configDir) => {
  const merged = /* @__PURE__ */ new Map();
  for (const filename of ["opencode.json", "opencode.jsonc"]) {
    const fullPath = path.join(configDir, filename);
    let raw;
    try {
      raw = fs.readFileSync(fullPath, "utf8");
    } catch {
      continue;
    }
    let doc;
    try {
      doc = JSON.parse(stripJsonc(raw));
    } catch {
      continue;
    }
    if (!isRecord(doc)) continue;
    for (const rootKey of ["provider", "providers"]) {
      const section = doc[rootKey];
      if (!isRecord(section)) continue;
      for (const [id, entry] of Object.entries(section)) {
        if (!VALID_PROVIDER_ID.test(id) || !isRecord(entry)) continue;
        const options = isRecord(entry.options) ? entry.options : null;
        const settings = isRecord(entry.settings) ? entry.settings : null;
        const previous = merged.get(id);
        const name = typeof entry.name === "string" && entry.name.trim() ? entry.name.trim().slice(0, 60) : previous?.name ?? id;
        const rawUrl = settings?.baseURL ?? settings?.baseUrl ?? options?.baseURL ?? options?.baseUrl ?? entry.api;
        const baseUrl = sanitizeConfigBaseUrl(rawUrl) ?? previous?.baseUrl ?? null;
        const inlineApiKey = extractLiteralKey(settings?.apiKey ?? options?.apiKey ?? entry.apiKey) ?? previous?.inlineApiKey ?? null;
        merged.set(id, { id, name, baseUrl, inlineApiKey });
      }
    }
  }
  return merged;
};
var listOpencodeProviderCandidates = (configs, credentialIds) => {
  const hasCredSet = new Set(credentialIds);
  const allIds = /* @__PURE__ */ new Set([...configs.keys(), ...hasCredSet]);
  const list = [];
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
      isCustomConfig
    });
  }
  return list.sort((a, b) => {
    if (a.isCustomConfig !== b.isCustomConfig) return a.isCustomConfig ? -1 : 1;
    if (a.hasCredential !== b.hasCredential) return a.hasCredential ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
};

// src/service/quota.ts
var MAX_WINDOWS = 32;
var MAX_LABEL = 128;
var MAX_ERROR = 2e3;
var isRecord2 = (value) => !!value && typeof value === "object" && !Array.isArray(value);
var truncate = (value, max = MAX_LABEL) => value.length > max ? `${value.slice(0, max - 1)}\u2026` : value;
var readQuotaRequest = (body) => {
  if (!isRecord2(body)) return null;
  if (body.v !== 1 || body.method !== "usage.read") return null;
  if (typeof body.requestId !== "string" || !body.requestId || body.requestId.length > 200) return null;
  if (typeof body.provider !== "string" || !body.provider || body.provider.length > 128) return null;
  const input = body.input;
  if (!isRecord2(input) || !isRecord2(input.credentials)) return null;
  if (!Object.values(input.credentials).every(isRecord2)) return null;
  return {
    requestId: body.requestId,
    provider: body.provider,
    credentials: input.credentials
  };
};
var quotaCredential = (value) => {
  if (!isRecord2(value)) return null;
  if (value.type === "api" && typeof value.key === "string" && value.key) {
    return { key: value.key, kind: "api" };
  }
  if (value.type === "oauth" && typeof value.access === "string" && value.access) {
    return { key: value.access, kind: "oauth" };
  }
  return null;
};
var uniqueKey = (windows, base) => {
  if (!windows[base]) return base;
  for (let index = 2; index < 100; index += 1) {
    const candidate = `${truncate(base, MAX_LABEL - 5)} (${index})`;
    if (!windows[candidate]) return candidate;
  }
  return truncate(base, MAX_LABEL);
};
var buildQuotaUsage = (input) => {
  const windows = {};
  let added = 0;
  const add = (providerName, label, window) => {
    if (added >= MAX_WINDOWS) return;
    const key = uniqueKey(windows, truncate(`${providerName} \xB7 ${label}`));
    windows[key] = window;
    added += 1;
  };
  for (const provider of input.providers) {
    const hasData = provider.ok && (provider.balance !== null || provider.windows.length > 0 || !!provider.detail);
    if (provider.windows.length > 0) {
      for (const window of provider.windows) {
        add(provider.name, window.label, {
          usedPercent: window.usedPercent,
          ...window.resetAt === null ? {} : { resetAt: window.resetAt },
          ...window.detail ? { valueLabel: truncate(window.detail) } : {}
        });
      }
    }
    if (provider.balance) {
      add(provider.name, "\u4F59\u989D", {
        usedPercent: null,
        valueLabel: truncate(provider.balance.label)
      });
    }
    if (provider.windows.length === 0 && !provider.balance) {
      add(provider.name, "\u72B6\u6001", {
        usedPercent: null,
        valueLabel: truncate(
          provider.ok ? provider.detail ?? "\u5DF2\u8FDE\u63A5\uFF0C\u63A5\u53E3\u672A\u63D0\u4F9B\u4F59\u989D\u6216\u989D\u5EA6" : provider.error ?? "\u67E5\u8BE2\u5931\u8D25"
        )
      });
    } else if (!provider.ok) {
      add(provider.name, "\u72B6\u6001", {
        usedPercent: null,
        valueLabel: truncate(provider.error ?? "\u4E0A\u6B21\u7ED3\u679C\u4FDD\u7559\uFF0C\u672C\u6B21\u67E5\u8BE2\u5931\u8D25")
      });
    } else if (!hasData) {
      add(provider.name, "\u72B6\u6001", {
        usedPercent: null,
        valueLabel: "\u5DF2\u8FDE\u63A5\uFF0C\u63A5\u53E3\u672A\u63D0\u4F9B\u4F59\u989D\u6216\u989D\u5EA6"
      });
    }
  }
  const plans = [...new Set(
    input.providers.map((provider) => provider.plan).filter((plan) => !!plan)
  )];
  const failures = input.providers.filter((provider) => !provider.ok).map((provider) => `${provider.name}\uFF1A${provider.error ?? "\u67E5\u8BE2\u5931\u8D25"}`);
  const live = input.providers.some((provider) => provider.ok);
  const usage = added > 0 ? { windows } : null;
  return {
    ok: live,
    configured: input.configured,
    ...failures.length > 0 ? { error: truncate(failures.slice(0, 2).join("\uFF1B"), MAX_ERROR) } : {},
    planLabel: plans.length > 0 ? truncate(plans.join(" \xB7 ")) : null,
    usage
  };
};

// src/service/main.ts
var port = Number(process.env.OPENCHAMBER_SERVICE_PORT);
var token = process.env.OPENCHAMBER_SERVICE_TOKEN ?? "";
if (!port || !token) {
  console.error("OPENCHAMBER_SERVICE_PORT and OPENCHAMBER_SERVICE_TOKEN are required");
  process.exit(1);
}
var HOME = os.homedir();
var OPENCODE_DATA_DIR = path2.join(HOME, ".local", "share", "opencode");
var OPENCODE_DB_FILE = path2.join(
  OPENCODE_DATA_DIR,
  process.env.OPENCODE_DB && process.env.OPENCODE_DB !== ":memory:" ? process.env.OPENCODE_DB : "opencode.db"
);
var CONFIG_DIR = path2.join(HOME, ".config", "openchamber", "balance");
var CONFIG_FILE = path2.join(CONFIG_DIR, "config.json");
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
  if (record.type === "key" && typeof record.key === "string" && record.key) return { key: record.key, kind: "api" };
  if (record.type === "oauth" && typeof record.access === "string" && record.access) return { key: record.access, kind: "oauth" };
  if (typeof record.key === "string" && record.key) return { key: record.key, kind: "api" };
  if (typeof record.access === "string" && record.access) return { key: record.access, kind: "oauth" };
  return null;
};
var databaseSyncPromise = null;
var loadDatabaseSync = () => {
  if (!databaseSyncPromise) {
    databaseSyncPromise = import("node:sqlite").then((module) => module.DatabaseSync ?? null).catch(() => null);
  }
  return databaseSyncPromise;
};
var readStoreCredentials = async () => {
  const result = {};
  const DatabaseSync = await loadDatabaseSync();
  if (DatabaseSync && fs2.existsSync(OPENCODE_DB_FILE)) {
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
    const legacy = JSON.parse(fs2.readFileSync(path2.join(OPENCODE_DATA_DIR, "auth.json"), "utf8"));
    for (const [id, entry] of Object.entries(legacy)) {
      const credential = projectCredential(entry);
      if (credential) result[id] = credential;
    }
  } catch {
  }
  return result;
};
var readCredentials = async () => {
  const result = await readStoreCredentials();
  const configs = readOpencodeProviderConfigs(resolveOpencodeConfigDir(HOME));
  for (const [id, cfg] of configs.entries()) {
    if (!(id in result) && cfg.inlineApiKey) {
      result[id] = { key: cfg.inlineApiKey, kind: "api" };
    }
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
var storedText = (value, max, fallback = "") => {
  if (value === void 0) return fallback;
  if (typeof value !== "string" || value.length > max) throw new Error();
  return value;
};
var parseStoredCustom = (value) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error();
  const record = value;
  const mappingRecord = record.mapping;
  if (!mappingRecord || typeof mappingRecord !== "object" || Array.isArray(mappingRecord)) throw new Error();
  const mapping = mappingRecord;
  const method = record.method === "POST" ? "POST" : "GET";
  const authScheme = record.authScheme === "raw" ? "raw" : "bearer";
  return {
    method,
    authHeader: storedText(record.authHeader, 100),
    authScheme,
    headers: storedText(record.headers, 8e3),
    body: storedText(record.body, 16e3),
    mapping: {
      balancePath: storedText(mapping.balancePath, 300),
      unit: storedText(mapping.unit, 20, "USD") || "USD",
      usedPath: storedText(mapping.usedPath, 300),
      limitPath: storedText(mapping.limitPath, 300),
      usedPercentPath: storedText(mapping.usedPercentPath, 300),
      resetAtPath: storedText(mapping.resetAtPath, 300),
      planPath: storedText(mapping.planPath, 300),
      detailPath: storedText(mapping.detailPath, 300),
      windowLabel: storedText(mapping.windowLabel, 40, "\u989D\u5EA6") || "\u989D\u5EA6"
    }
  };
};
var parseStoredRelay = (value) => {
  if (!value || typeof value !== "object") throw new Error();
  const record = value;
  if (typeof record.id !== "string" || typeof record.name !== "string" || typeof record.baseUrl !== "string" || typeof record.apiKey !== "string") throw new Error();
  const providerId = record.providerId === void 0 || record.providerId === "" ? void 0 : typeof record.providerId === "string" && VALID_PROVIDER_ID.test(record.providerId) ? record.providerId : (() => {
    throw new Error();
  })();
  const enabled = record.enabled === void 0 ? true : Boolean(record.enabled);
  const kind = record.kind === "custom" ? "custom" : "auto";
  const base = {
    id: record.id,
    name: record.name,
    baseUrl: record.baseUrl,
    apiKey: record.apiKey,
    ...providerId ? { providerId } : {},
    enabled,
    kind
  };
  if (kind === "auto") return base;
  return {
    ...base,
    custom: parseStoredCustom(record.custom)
  };
};
var RequestError = class extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
};
var CustomMappingTestError = class extends Error {
  constructor(message, raw) {
    super(message);
    this.raw = raw;
  }
};
var readConfig = () => {
  let raw;
  try {
    raw = fs2.readFileSync(CONFIG_FILE, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return { relays: [] };
    throw new RequestError(500, "\u65E0\u6CD5\u8BFB\u53D6\u63A5\u53E3\u914D\u7F6E\uFF0C\u8BF7\u68C0\u67E5\u6587\u4EF6\u6743\u9650");
  }
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    const relays = parsed.relays ?? [];
    if (!Array.isArray(relays)) throw new Error();
    return { relays: relays.map(parseStoredRelay) };
  } catch {
    throw new RequestError(500, "\u63A5\u53E3\u914D\u7F6E\u683C\u5F0F\u6709\u8BEF\uFF0C\u8BF7\u4FEE\u590D config.json \u540E\u91CD\u8BD5\uFF1B\u73B0\u6709\u6587\u4EF6\u672A\u4FEE\u6539");
  }
};
var writeConfig = (config) => {
  fs2.mkdirSync(CONFIG_DIR, { recursive: true, mode: 448 });
  const temporary = `${CONFIG_FILE}.${randomUUID()}.tmp`;
  try {
    fs2.writeFileSync(temporary, JSON.stringify(config, null, 2), { mode: 384 });
    fs2.renameSync(temporary, CONFIG_FILE);
  } catch {
    try {
      fs2.unlinkSync(temporary);
    } catch {
    }
    throw new RequestError(500, "\u4FDD\u5B58\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u914D\u7F6E\u76EE\u5F55\u7684\u5199\u5165\u6743\u9650");
  }
};
var fetchJson = async (url, headers, signal = AbortSignal.timeout(REQUEST_TIMEOUT_MS), init = {}) => {
  const response = await fetch(url, { headers, signal, method: init.method, body: init.body });
  const text = await response.text();
  let body = null;
  try {
    body = JSON.parse(text);
  } catch {
    body = null;
  }
  return { status: response.status, ok: response.ok, body };
};
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
var fetchRelay = async (relay, apiKey) => {
  const base = normalizeRelayUrl(relay.baseUrl);
  const deadline = AbortSignal.timeout(12e3);
  const headers = { Accept: "application/json", Authorization: `Bearer ${apiKey}` };
  const query = async (url) => {
    try {
      return await fetchJson(url, headers, deadline);
    } catch (error) {
      if (deadline.aborted) throw error;
      return { ok: false, status: 0, body: null };
    }
  };
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
  throw new Error(
    [usage.status, subscription.status, newApi.status].includes(401) ? "\u8BA4\u8BC1\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5 API Key \u662F\u5426\u6709\u6548" : [usage.status, subscription.status, newApi.status].includes(403) ? "\u5F53\u524D Key \u6CA1\u6709\u67E5\u8BE2\u4F59\u989D\u7684\u6743\u9650\uFF08\u90E8\u5206\u4E2D\u8F6C\u7AD9\u63A8\u7406\u5BC6\u94A5\u4E0E\u8D26\u5355\u67E5\u8BE2\u4EE4\u724C\u5206\u79BB\uFF0C\u53EF\u5728\u7F16\u8F91\u4E2D\u5355\u72EC\u586B\u5199\u67E5\u8BE2\u5BC6\u94A5\uFF09" : "\u65E0\u6CD5\u8BC6\u522B\u4F59\u989D\u63A5\u53E3\uFF0C\u8BF7\u68C0\u67E5\u670D\u52A1\u5730\u5740\u53CA\u7AD9\u70B9\u662F\u5426\u652F\u6301\u4F59\u989D\u67E5\u8BE2"
  );
};
var parseHeaderLines = (raw) => {
  const headers = {};
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const separator = trimmed.indexOf(":");
    if (separator <= 0) throw new Error("\u989D\u5916\u8BF7\u6C42\u5934\u683C\u5F0F\u5E94\u4E3A Name: value");
    const name = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    if (!/^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/.test(name) || /[\r\n]/.test(value)) {
      throw new Error("\u989D\u5916\u8BF7\u6C42\u5934\u683C\u5F0F\u4E0D\u6B63\u786E");
    }
    headers[name] = value;
  }
  return headers;
};
var redact = (text, secret) => secret ? text.split(secret).join("{key}") : text;
var sanitizeRawBody = (raw, secret) => {
  if (!secret || raw == null || typeof raw !== "object") return raw;
  try {
    return JSON.parse(redact(JSON.stringify(raw), secret));
  } catch {
    return void 0;
  }
};
var fetchCustom = async (relay, apiKey, options = {}) => {
  const custom = relay.custom;
  if (!custom) throw new Error("\u81EA\u5B9A\u4E49\u63A5\u53E3\u7F3A\u5C11\u8BF7\u6C42\u914D\u7F6E");
  validateCustomRequest(custom, { allowEmptyMapping: options.testMode === true });
  if (apiKey && (custom.headers.includes(apiKey) || custom.body.includes(apiKey))) {
    throw new Error("\u4E0D\u8981\u628A API Key \u5199\u8FDB\u989D\u5916\u8BF7\u6C42\u5934\u6216\u8BF7\u6C42\u4F53");
  }
  const headers = { Accept: "application/json", ...parseHeaderLines(custom.headers) };
  const authHeader = custom.authHeader.trim();
  if (authHeader && apiKey) headers[authHeader] = custom.authScheme === "bearer" ? `Bearer ${apiKey}` : apiKey;
  if (custom.method === "POST" && custom.body.trim() && !Object.keys(headers).some((name) => name.toLowerCase() === "content-type")) {
    headers["Content-Type"] = "application/json";
  }
  const answer = await fetchJson(relay.baseUrl, headers, void 0, {
    method: custom.method,
    body: custom.method === "POST" && custom.body.trim() ? custom.body : void 0
  });
  if (!answer.ok) throw new Error(`\u81EA\u5B9A\u4E49\u63A5\u53E3\u8FD4\u56DE HTTP ${answer.status}`);
  const safeRaw = sanitizeRawBody(answer.body, apiKey);
  if (options.testMode && !hasAnyCustomMapping(custom.mapping)) {
    throw new CustomMappingTestError("\u5DF2\u83B7\u53D6\u63A5\u53E3\u54CD\u5E94\uFF0C\u8BF7\u5728\u4E0B\u65B9\u70B9\u9009\u5B57\u6BB5\u6216\u586B\u5199 JSON \u8DEF\u5F84\u540E\u4FDD\u5B58", safeRaw);
  }
  try {
    return { ...parseCustomContribution(answer.body, custom.mapping), raw: safeRaw };
  } catch (error) {
    if (options.testMode && safeRaw && typeof safeRaw === "object") {
      throw new CustomMappingTestError(describeError(error), safeRaw);
    }
    throw error;
  }
};
var resolveRelayApiKey = (relay, credentials, options = {}) => {
  if (relay.apiKey) return relay.apiKey;
  if (relay.providerId) {
    const found = credentials[relay.providerId];
    if (found?.key) return found.key;
    if (options.quotaMode) return null;
    throw new Error(`\u672A\u5728\u4F9B\u5E94\u5546\u9875\u9762\u627E\u5230\u201C${relay.providerId}\u201D\u7684\u5BC6\u94A5\uFF0C\u8BF7\u5148\u5728 OpenChamber \u4F9B\u5E94\u5546\u9875\u9762\u914D\u7F6E\u6216\u6539\u7528\u5355\u72EC\u5BC6\u94A5`);
  }
  if (options.quotaMode) return null;
  throw new Error("\u8BF7\u586B\u5199 API Key");
};
var fetchConnection = async (relay, credentials, options = {}) => {
  const apiKey = resolveRelayApiKey(relay, credentials, options);
  if (apiKey === null) return { configured: false };
  return relay.kind === "custom" ? fetchCustom(relay, apiKey, { testMode: options.testMode }) : fetchRelay(relay, apiKey);
};
var BUILTIN_PROVIDERS = [
  { id: "command-code", name: "Command Code", credentialIds: ["command-code", "commandcode"], fetch: fetchCommandCode },
  { id: "stepfun", name: "StepFun", credentialIds: ["stepfun-step-plan", "stepfun"], fetch: fetchStepfun }
];
var buildProviders = async (previous, credentials, options = {}) => {
  const relays = readConfig().relays.filter((relay) => relay.enabled !== false);
  const jobs = [
    ...BUILTIN_PROVIDERS.map((provider) => ({
      id: provider.id,
      name: provider.name,
      run: () => provider.fetch(firstCredential(credentials, provider.credentialIds))
    })),
    ...relays.map((relay) => ({
      id: `relay:${relay.id}`,
      name: relay.name,
      run: () => fetchConnection(relay, credentials, { quotaMode: options.quotaMode })
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
  return providers.filter((provider) => provider !== null);
};
var buildBalances = async (previous) => {
  const credentials = await readCredentials();
  return { fetchedAt: Date.now(), providers: await buildProviders(previous, credentials) };
};
var buildQuotaData = async (raw) => {
  try {
    const credentials = {};
    for (const [id, value] of Object.entries(raw)) {
      const credential = quotaCredential(value);
      if (credential) credentials[id] = credential;
    }
    const activeRelays = readConfig().relays.filter((relay) => relay.enabled !== false);
    const quotaRelays = activeRelays.filter(
      (relay) => relay.apiKey.length > 0 || Boolean(relay.providerId && credentials[relay.providerId]?.key)
    );
    const configured = quotaRelays.length > 0 || BUILTIN_PROVIDERS.some(
      (provider) => firstCredential(credentials, provider.credentialIds) !== null
    );
    if (!configured) {
      return {
        ok: false,
        configured: true,
        error: activeRelays.some((relay) => Boolean(relay.providerId)) ? "\u590D\u7528\u4F9B\u5E94\u5546\u5BC6\u94A5\u7684\u63A5\u53E3\u5DF2\u5728\u300C\u4F59\u989D\u300D\u4FA7\u680F\u4E0E\u5DE5\u4F5C\u72B6\u6001\u4E2D\u751F\u6548" : "\u5728\u300C\u4F59\u989D\u300D\u9762\u677F\u6DFB\u52A0\u63A5\u53E3\uFF0C\u6216\u5728 OpenChamber Providers \u767B\u5F55 Command Code/StepFun",
        usage: null
      };
    }
    const providers = await buildProviders([], credentials, { quotaMode: true });
    return buildQuotaUsage({ providers, configured });
  } catch (error) {
    return { ok: false, configured: true, error: describeError(error), usage: null };
  }
};
var balanceCache = createBalanceCache(buildBalances);
function describeError(error) {
  if (error instanceof Error && ["TimeoutError", "AbortError"].includes(error.name)) return "\u67E5\u8BE2\u8D85\u65F6\uFF0C\u8BF7\u7A0D\u540E\u5237\u65B0";
  if (error instanceof TypeError) return "\u65E0\u6CD5\u8FDE\u63A5\u670D\u52A1\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC\u6216\u670D\u52A1\u5730\u5740";
  return error instanceof Error ? error.message : "\u67E5\u8BE2\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5";
}
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
var publicRelay = (relay) => ({
  id: relay.id,
  name: relay.name,
  baseUrl: relay.baseUrl,
  hasKey: relay.apiKey.length > 0,
  ...relay.providerId ? { providerId: relay.providerId } : {},
  enabled: relay.enabled !== false,
  kind: relay.kind ?? "auto",
  ...relay.kind === "custom" && relay.custom ? {
    custom: {
      ...relay.custom,
      headers: redact(relay.custom.headers, relay.apiKey),
      body: redact(relay.custom.body, relay.apiKey)
    }
  } : {}
});
var field = (body, key, max) => {
  const value = typeof body[key] === "string" ? body[key].trim() : "";
  if (value.length > max) throw new RequestError(400, `${key} \u957F\u5EA6\u8D85\u51FA\u9650\u5236`);
  return value;
};
var nestedText = (record, key, max, fallback = "") => {
  const value = record[key];
  if (value === void 0) return fallback;
  if (typeof value !== "string") throw new RequestError(400, `${key} \u5FC5\u987B\u662F\u6587\u672C`);
  if (value.length > max) throw new RequestError(400, `${key} \u957F\u5EA6\u8D85\u51FA\u9650\u5236`);
  return value;
};
var customRequest = (body, apiKey, options = {}) => {
  const raw = body.custom;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new RequestError(400, "\u7F3A\u5C11\u81EA\u5B9A\u4E49\u63A5\u53E3\u914D\u7F6E");
  const record = raw;
  const rawMapping = record.mapping;
  if (!rawMapping || typeof rawMapping !== "object" || Array.isArray(rawMapping)) throw new RequestError(400, "\u7F3A\u5C11\u54CD\u5E94\u5B57\u6BB5\u6620\u5C04");
  const mapping = rawMapping;
  const request = {
    method: record.method === "POST" ? "POST" : "GET",
    authHeader: nestedText(record, "authHeader", 100, "Authorization").trim(),
    authScheme: record.authScheme === "raw" ? "raw" : "bearer",
    headers: nestedText(record, "headers", 8e3),
    body: nestedText(record, "body", 16e3),
    mapping: {
      balancePath: nestedText(mapping, "balancePath", 300).trim(),
      unit: nestedText(mapping, "unit", 20, "USD").trim() || "USD",
      usedPath: nestedText(mapping, "usedPath", 300).trim(),
      limitPath: nestedText(mapping, "limitPath", 300).trim(),
      usedPercentPath: nestedText(mapping, "usedPercentPath", 300).trim(),
      resetAtPath: nestedText(mapping, "resetAtPath", 300).trim(),
      planPath: nestedText(mapping, "planPath", 300).trim(),
      detailPath: nestedText(mapping, "detailPath", 300).trim(),
      windowLabel: nestedText(mapping, "windowLabel", 40, "\u989D\u5EA6").trim() || "\u989D\u5EA6"
    }
  };
  try {
    validateCustomRequest(request, options);
  } catch (error) {
    throw new RequestError(400, error instanceof Error ? error.message : "\u81EA\u5B9A\u4E49\u63A5\u53E3\u914D\u7F6E\u4E0D\u6B63\u786E");
  }
  if (apiKey && (request.headers.includes(apiKey) || request.body.includes(apiKey))) {
    throw new RequestError(400, "\u4E0D\u8981\u628A API Key \u5199\u8FDB\u989D\u5916\u8BF7\u6C42\u5934\u6216\u8BF7\u6C42\u4F53");
  }
  return request;
};
var resolveRelay = (body, config, options = {}) => {
  const id = field(body, "id", 128);
  const stored = id ? config.relays.find((relay) => relay.id === id) : void 0;
  if (id && !stored) throw new RequestError(404, "\u6B64\u63A5\u53E3\u5DF2\u79FB\u9664\uFF0C\u8BF7\u91CD\u65B0\u6253\u5F00\u7BA1\u7406\u9875\u9762");
  const kind = body.kind === "custom" ? "custom" : "auto";
  let baseUrl;
  try {
    baseUrl = kind === "custom" ? normalizeEndpointUrl(field(body, "baseUrl", 4096)) : normalizeRelayUrl(field(body, "baseUrl", 2048));
  } catch (error) {
    throw new RequestError(400, describeError(error));
  }
  const rawProviderId = field(body, "providerId", 120);
  if (rawProviderId && !VALID_PROVIDER_ID.test(rawProviderId)) {
    throw new RequestError(400, "\u4F9B\u5E94\u5546\u6807\u8BC6\u683C\u5F0F\u4E0D\u6B63\u786E");
  }
  let apiKey = "";
  let providerId;
  if (rawProviderId) {
    providerId = rawProviderId;
    apiKey = "";
  } else {
    const typedKey = field(body, "apiKey", 4096);
    const originChanged = stored ? stored.kind === "custom" || kind === "custom" ? changesEndpointOrigin(stored.baseUrl, baseUrl) : changesRelayOrigin(stored.baseUrl, baseUrl) : false;
    if (!typedKey && stored?.apiKey && originChanged) {
      throw new RequestError(400, "\u66F4\u6362\u63A5\u53E3\u5730\u5740\u65F6\uFF0C\u8BF7\u91CD\u65B0\u586B\u5199 API Key");
    }
    apiKey = typedKey || stored?.apiKey || "";
    if (!apiKey) throw new RequestError(400, "\u8BF7\u586B\u5199 API Key");
  }
  const enabled = typeof body.enabled === "boolean" ? body.enabled : stored?.enabled ?? true;
  const custom = kind === "custom" ? customRequest(body, apiKey, { allowEmptyMapping: options.forTest === true }) : void 0;
  return {
    id: stored?.id ?? randomUUID(),
    name: field(body, "name", 60),
    baseUrl,
    apiKey,
    ...providerId ? { providerId } : {},
    enabled,
    kind,
    ...custom ? { custom } : {}
  };
};
var handle = async (req, res) => {
  if (req.headers.authorization !== `Bearer ${token}`) throw new RequestError(401, "unauthorized");
  const url = new URL(req.url ?? "/", "http://127.0.0.1");
  if (url.pathname === "/health" && req.method === "GET") {
    json(res, 200, { ok: true });
  } else if (url.pathname === "/balances" && req.method === "GET") {
    json(res, 200, await balanceCache.get(url.searchParams.get("refresh") === "1"));
  } else if (url.pathname === "/opencode-providers" && req.method === "GET") {
    const [storeCredentials, configs] = await Promise.all([
      readStoreCredentials(),
      Promise.resolve(readOpencodeProviderConfigs(resolveOpencodeConfigDir(HOME)))
    ]);
    json(res, 200, {
      providers: listOpencodeProviderCandidates(configs, Object.keys(storeCredentials))
    });
  } else if (url.pathname === "/quota" && req.method === "POST") {
    const body = await readBody(req);
    const request = readQuotaRequest(body);
    if (!request) {
      json(res, 400, { ok: false, error: { message: "invalid quota request" } });
      return;
    }
    json(res, 200, { ok: true, data: await buildQuotaData(request.credentials) });
  } else if (url.pathname === "/relays" && req.method === "GET") {
    json(res, 200, { relays: readConfig().relays.map(publicRelay) });
  } else if (url.pathname === "/relays/test" && req.method === "POST") {
    const body = await readBody(req);
    const relay = resolveRelay(body, readConfig(), { forTest: true });
    try {
      const credentials = relay.providerId ? await readCredentials() : {};
      const contribution = await fetchConnection(relay, credentials, { testMode: true });
      json(res, 200, { ok: true, baseUrl: relay.baseUrl, ...contribution });
    } catch (error) {
      if (error instanceof CustomMappingTestError) {
        json(res, 200, { ok: false, error: error.message, raw: error.raw });
      } else {
        json(res, 200, { ok: false, error: describeError(error) });
      }
    }
  } else if (url.pathname === "/relays/toggle" && req.method === "POST") {
    const body = await readBody(req);
    const id = field(body, "id", 128);
    if (!id) throw new RequestError(400, "\u7F3A\u5C11\u63A5\u53E3\u7F16\u53F7");
    const config = readConfig();
    const target = config.relays.find((relay) => relay.id === id);
    if (!target) throw new RequestError(404, "\u6B64\u63A5\u53E3\u5DF2\u79FB\u9664\uFF0C\u8BF7\u91CD\u65B0\u6253\u5F00\u7BA1\u7406\u9875\u9762");
    target.enabled = Boolean(body.enabled);
    writeConfig(config);
    balanceCache.invalidate(`relay:${id}`);
    json(res, 200, { relays: config.relays.map(publicRelay) });
  } else if (url.pathname === "/relays" && req.method === "POST") {
    const body = await readBody(req);
    const config = readConfig();
    const relay = resolveRelay(body, config);
    if (!relay.name) throw new RequestError(400, "\u8BF7\u586B\u5199\u63A5\u53E3\u540D\u79F0");
    if (relay.providerId && relay.kind === "custom" && relay.custom) {
      const credentials = await readCredentials();
      const resolvedKey = credentials[relay.providerId]?.key ?? "";
      if (resolvedKey && (relay.custom.headers.includes(resolvedKey) || relay.custom.body.includes(resolvedKey))) {
        throw new RequestError(400, "\u4E0D\u8981\u628A API Key \u5199\u8FDB\u989D\u5916\u8BF7\u6C42\u5934\u6216\u8BF7\u6C42\u4F53");
      }
    }
    const index = config.relays.findIndex((item) => item.id === relay.id);
    if (index >= 0) config.relays[index] = relay;
    else config.relays.push(relay);
    writeConfig(config);
    balanceCache.invalidate(`relay:${relay.id}`);
    json(res, 200, { relays: config.relays.map(publicRelay) });
  } else if (url.pathname === "/relays" && req.method === "DELETE") {
    const id = url.searchParams.get("id");
    if (!id) throw new RequestError(400, "\u7F3A\u5C11\u63A5\u53E3\u7F16\u53F7");
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
