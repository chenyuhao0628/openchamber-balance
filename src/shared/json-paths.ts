export type JsonPathCandidate = {
  path: string;
  preview: string;
  kind: 'number' | 'string';
};

const UNSAFE_KEYS = new Set(['__proto__', 'prototype', 'constructor']);
const SIMPLE_KEY = /^[A-Za-z_$][A-Za-z0-9_$-]*$/;

const isNumericText = (value: string): boolean => {
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.length <= 32 && Number.isFinite(Number(trimmed));
};

/**
 * Extracts safe dot/bracket paths (compatible with `readPath`) from a JSON response
 * so users can click to populate custom balance/quota field mappings instead of
 * hand-typing nested paths.
 */
export const extractJsonPaths = (root: unknown, maxItems = 36, maxDepth = 5): JsonPathCandidate[] => {
  if (!root || typeof root !== 'object' || Array.isArray(root)) return [];
  const items: JsonPathCandidate[] = [];

  const visit = (current: unknown, prefix: string, depth: number): void => {
    if (items.length >= maxItems || depth > maxDepth || current == null) return;
    if (typeof current === 'number' && Number.isFinite(current)) {
      if (prefix) items.push({ path: prefix, preview: String(current), kind: 'number' });
      return;
    }
    if (typeof current === 'string') {
      const trimmed = current.trim();
      if (!prefix || !trimmed) return;
      const numeric = isNumericText(trimmed);
      const preview = trimmed.length > 36 ? `${trimmed.slice(0, 35)}…` : trimmed;
      items.push({ path: prefix, preview: numeric ? trimmed : `"${preview}"`, kind: numeric ? 'number' : 'string' });
      return;
    }
    if (typeof current !== 'object') return;
    if (Array.isArray(current)) {
      const limit = Math.min(current.length, 3);
      for (let index = 0; index < limit; index += 1) {
        if (items.length >= maxItems) return;
        visit(current[index], `${prefix}[${index}]`, depth + 1);
      }
      return;
    }
    for (const [key, value] of Object.entries(current as Record<string, unknown>)) {
      if (items.length >= maxItems) return;
      if (!key || UNSAFE_KEYS.has(key) || !SIMPLE_KEY.test(key)) continue;
      const nextPath = prefix ? `${prefix}.${key}` : key;
      visit(value, nextPath, depth + 1);
    }
  };

  visit(root, '', 0);
  // Put numeric candidates first because balance/used/limit are the primary mappings.
  return items.sort((a, b) => (a.kind === b.kind ? 0 : a.kind === 'number' ? -1 : 1));
};
