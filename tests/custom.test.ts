import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { EMPTY_CUSTOM_MAPPING, type CustomRequest } from '../src/shared/types.ts';
import { extractJsonPaths } from '../src/shared/json-paths.ts';
import { changesEndpointOrigin, normalizeEndpointUrl } from '../src/shared/relay-url.ts';
import { parseCustomContribution, readPath, validateCustomRequest } from '../src/service/custom.ts';
import { listOpencodeProviderCandidates, readOpencodeProviderConfigs, stripJsonc } from '../src/service/opencode-config.ts';

const request = (patch: Partial<CustomRequest> = {}): CustomRequest => ({
  method: 'GET',
  authHeader: 'Authorization',
  authScheme: 'bearer',
  headers: '',
  body: '',
  mapping: { ...EMPTY_CUSTOM_MAPPING },
  ...patch,
});

test('reads dot and bracket paths without evaluating code', () => {
  const body = { data: { items: [{ remaining: 12.5 }], note: 'fixture' } };
  assert.equal(readPath(body, 'data.items[0].remaining'), 12.5);
  assert.equal(readPath(body, 'data.note'), 'fixture');
  assert.equal(readPath(body, 'data.missing'), undefined);
  assert.equal(readPath(body, 'constructor'), undefined);
});

test('maps a balance, a quota window and a reset time', () => {
  const body = {
    data: {
      balance: '12.5',
      used: 30,
      limit: 100,
      reset_at: '2026-11-01T00:00:00Z',
      plan: 'Pro',
      note: 'fixture',
    },
  };
  const result = parseCustomContribution(body, {
    ...EMPTY_CUSTOM_MAPPING,
    balancePath: 'data.balance',
    usedPath: 'data.used',
    limitPath: 'data.limit',
    resetAtPath: 'data.reset_at',
    planPath: 'data.plan',
    detailPath: 'data.note',
    unit: 'USD',
    windowLabel: '额度',
  });
  assert.equal(result.balance?.value, 12.5);
  assert.equal(result.balance?.unit, 'USD');
  assert.equal(result.plan, 'Pro');
  assert.equal(result.detail, 'fixture');
  assert.equal(result.windows?.[0]?.usedPercent, 30);
  assert.equal(result.windows?.[0]?.detail, '30 / 100');
  assert.ok(result.windows?.[0]?.resetAt);
});

test('uses the explicit percent field before used and limit', () => {
  const result = parseCustomContribution({ balance: 4, used: 1, limit: 10, percent: 75 }, {
    ...EMPTY_CUSTOM_MAPPING,
    balancePath: 'balance',
    usedPath: 'used',
    limitPath: 'limit',
    usedPercentPath: 'percent',
  });
  assert.equal(result.windows?.[0]?.usedPercent, 75);
});

test('rejects a response with no mapped values', () => {
  assert.throws(() => parseCustomContribution({ data: {} }, { ...EMPTY_CUSTOM_MAPPING, balancePath: 'data.balance' }), /没有可展示/);
});

test('validates custom requests before they are saved', () => {
  assert.throws(() => validateCustomRequest(request()), /至少填写/);
  assert.throws(() => validateCustomRequest(request({ method: 'GET', body: '{}', mapping: { ...EMPTY_CUSTOM_MAPPING, balancePath: 'balance' } })), /GET/);
  assert.doesNotThrow(() => validateCustomRequest(request({ mapping: { ...EMPTY_CUSTOM_MAPPING, balancePath: 'balance' } })));
});

test('keeps a custom endpoint path and compares only its origin for key reuse', () => {
  assert.equal(normalizeEndpointUrl('https://api.example.com/v1/balance?tenant=a'), 'https://api.example.com/v1/balance?tenant=a');
  assert.equal(changesEndpointOrigin('https://api.example.com/v1/balance', 'https://api.example.com/v2/credits'), false);
  assert.equal(changesEndpointOrigin('https://api.example.com/v1/balance', 'https://other.example.com/v1/balance'), true);
  assert.throws(() => normalizeEndpointUrl('https://user:pass@api.example.com/balance'));
});

test('extracts safe numeric and string JSON paths for the interactive picker', () => {
  const sample = JSON.parse('{"data":{"items":[{"remaining":18.5,"plan":"Team"}],"reset_at":"2026-12-01"},"__proto__":{"polluted":1},"constructor":{"bad":2}}');
  const paths = extractJsonPaths(sample);
  assert.deepEqual(paths.map(item => ({ path: item.path, kind: item.kind })), [
    { path: 'data.items[0].remaining', kind: 'number' },
    { path: 'data.items[0].plan', kind: 'string' },
    { path: 'data.reset_at', kind: 'string' },
  ]);
});

test('parses JSONC opencode provider configs and sanitizes URLs without leaking secrets', () => {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'balance-opencode-cfg-'));
  try {
    const jsonc = `{
      // OpenCode custom provider with https:// inside string
      "providers": {
        "my-relay": {
          "name": "主力中转站",
          "settings": {
            "baseURL": "https://user:secret@relay.example.com/v1/?api_key=leak",
          },
        },
        "deepseek": {
          "name": "DeepSeek",
          "settings": { "baseURL": "https://api.deepseek.com/v1" },
        },
      },
    }`;
    assert.doesNotThrow(() => JSON.parse(stripJsonc(jsonc)));
    writeFileSync(path.join(dir, 'opencode.jsonc'), jsonc, 'utf8');
    const configs = readOpencodeProviderConfigs(dir);
    const candidates = listOpencodeProviderCandidates(configs, ['my-relay', 'deepseek']);
    const relay = candidates.find(item => item.id === 'my-relay');
    const builtin = candidates.find(item => item.id === 'deepseek');
    assert.deepEqual(relay, {
      id: 'my-relay',
      name: '主力中转站',
      baseUrl: 'https://relay.example.com',
      hasCredential: true,
      isCustomConfig: true,
    });
    assert.equal(builtin?.isCustomConfig, false);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
