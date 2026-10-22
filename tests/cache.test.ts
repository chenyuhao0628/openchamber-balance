import test from 'node:test';
import assert from 'node:assert/strict';
import { createBalanceCache, failedProvider } from '../src/service/cache.ts';
import type { BalancesResult, Provider } from '../src/shared/types.ts';

const provider: Provider = { id: 'relay:one', name: 'Fixture', ok: true, plan: null, balance: { value: 12, label: '$12.00', unit: 'USD' }, detail: null, windows: [], updatedAt: 100, stale: false };
const snapshot = (providers = [provider]): BalancesResult => ({ fetchedAt: 200, providers });

test('ordinary loads are cached; concurrent refreshes share the same request', async () => {
  let calls = 0;
  const cache = createBalanceCache(async () => { calls++; return snapshot(); });
  await Promise.all([cache.get(), cache.get(), cache.get(true)]);
  assert.equal(calls, 1);
  await cache.get();
  assert.equal(calls, 1);
  await cache.get(true);
  assert.equal(calls, 2);
});

test('an in-flight result cannot restore a relay deleted during the request', async () => {
  let finish!: (result: BalancesResult) => void;
  let calls = 0;
  const cache = createBalanceCache(async () => {
    if (++calls === 1) return new Promise<BalancesResult>((resolve) => { finish = resolve; });
    return snapshot([]);
  });
  const old = cache.get();
  cache.invalidate('relay:one');
  assert.deepEqual((await cache.get()).providers, []);
  finish(snapshot());
  assert.deepEqual((await old).providers, []);
  assert.deepEqual((await cache.get()).providers, []);
  assert.equal(calls, 2);
});

test('configuration changes discard previous balances for the changed account', async () => {
  let previous: Provider[] = [];
  const cache = createBalanceCache(async (value) => { previous = value; return snapshot(); });
  await cache.get();
  cache.invalidate('relay:one');
  await cache.get();
  assert.deepEqual(previous, []);
});

test('obsolete request failures do not hide a successful newer configuration', async () => {
  let reject!: (error: Error) => void;
  let calls = 0;
  const cache = createBalanceCache(async () => ++calls === 1 ? new Promise<BalancesResult>((_, fail) => { reject = fail; }) : snapshot([]));
  const old = cache.get();
  cache.invalidate('relay:one');
  await cache.get();
  reject(new Error('obsolete'));
  assert.deepEqual((await old).providers, []);
});

test('failed queries preserve explicitly stale successful data; missing data stays unknown', () => {
  const stale = failedProvider(provider.id, provider.name, 'timeout', provider);
  assert.equal(stale.ok, false);
  assert.equal(stale.stale, true);
  assert.equal(stale.updatedAt, 100);
  assert.equal(stale.balance?.value, 12);
  const unknown = failedProvider('new', 'New', 'timeout');
  assert.equal(unknown.balance, null);
  assert.equal(unknown.stale, false);
});
