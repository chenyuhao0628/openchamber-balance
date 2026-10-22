import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeRelayUrl, changesRelayOrigin } from '../src/shared/relay-url.ts';
import { parseProvider } from '../src/panel/data.ts';
import { formatBalance, formatReset } from '../src/panel/format.ts';

test('normalizes copied API bases while retaining custom proxy paths', () => {
  assert.equal(normalizeRelayUrl(' relay.example.com/v1/ '), 'https://relay.example.com');
  assert.equal(normalizeRelayUrl('https://relay.example.com/proxy/v1'), 'https://relay.example.com/proxy');
  assert.equal(normalizeRelayUrl('http://127.0.0.1:1234/'), 'http://127.0.0.1:1234');
});
test('rejects embedded credentials and non-HTTP addresses', () => {
  for (const url of ['', 'ftp://relay.example.com', 'https://user:pass@relay.example.com', 'https://relay.example.com?key=secret', 'https://relay.example.com/#key']) {
    assert.throws(() => normalizeRelayUrl(url));
  }
});
test('detects changes in destination before reusing a stored key', () => {
  assert.equal(changesRelayOrigin('https://one.example.com/v1', 'https://two.example.com'), true);
  assert.equal(changesRelayOrigin('https://one.example.com', 'http://one.example.com'), true);
  assert.equal(changesRelayOrigin('https://one.example.com', 'https://one.example.com/proxy'), false);
});
test('unknown money is not formatted as zero; long amounts have grouping', () => {
  assert.equal(formatBalance(null, 'USD'), '—');
  assert.equal(formatBalance(0, 'CNY'), '¥0.00');
  assert.equal(formatBalance(12345.67, 'USD'), '$12,345.67');
});
test('expired reset dates ask for a refresh and unknown dates stay absent', () => {
  assert.equal(formatReset(100, 'zh-CN', 200), '重置时间已到，请刷新');
  assert.equal(formatReset(null), null);
});
test('panel parser preserves stale metadata and drops invalid numeric values', () => {
  const parsed = parseProvider({ id: 'one', name: 'Fixture', ok: false, stale: true, updatedAt: 100, balance: { value: NaN, label: 'invalid', unit: 'USD' } });
  assert.equal(parsed?.balance?.value, null);
  assert.equal(parsed?.stale, true);
  assert.equal(parsed?.updatedAt, 100);
});
