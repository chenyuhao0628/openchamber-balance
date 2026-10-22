import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';

const project = fileURLToPath(new URL('..', import.meta.url));
test('local HTTP service with isolated files and a synthetic upstream', async (t) => {
  const fixture = await mkdtemp(path.join(os.tmpdir(), 'balance-service-test-'));
  const configDir = path.join(fixture, '.config/openchamber/balance');
  const configFile = path.join(configDir, 'config.json');
  await mkdir(configDir, { recursive: true });
  const prelude = path.join(fixture, 'isolate.cjs');
  // Change only this child process's homedir implementation, never the user's HOME.
  await writeFile(prelude, `require('node:os').homedir = () => ${JSON.stringify(fixture)}; require('node:module').syncBuiltinESMExports();`);
  let mode = 'normal';
  let requests = 0;
  const upstream = http.createServer((req, res) => {
    requests++;
    res.setHeader('Content-Type', 'application/json');
    if (mode === 'offline') { res.writeHead(503); res.end('{}'); return; }
    if (mode === 'no-usage') {
      if (req.url === '/v1/dashboard/billing/subscription') res.end(JSON.stringify({ hard_limit_usd: 100 }));
      else { res.writeHead(404); res.end('{}'); }
      return;
    }
    if (req.url === '/v1/usage') res.end(JSON.stringify({ remaining: 25, unit: 'USD', quota: { used: 75, limit: 100 } }));
    else { res.writeHead(404); res.end('{}'); }
  });
  upstream.listen(0, '127.0.0.1'); await once(upstream, 'listening');
  const base = `http://127.0.0.1:${upstream.address().port}`;
  const reservation = http.createServer(); reservation.listen(0, '127.0.0.1'); await once(reservation, 'listening');
  const port = reservation.address().port; await new Promise(resolve => reservation.close(resolve));
  const token = 'fixture-host-token';
  const child = spawn(process.execPath, ['--require', prelude, path.join(project, 'service/main.js')], {
    env: { ...process.env, OPENCHAMBER_SERVICE_PORT: String(port), OPENCHAMBER_SERVICE_TOKEN: token }, stdio: ['ignore', 'pipe', 'pipe'],
  });
  let logs = ''; child.stdout.on('data', chunk => { logs += chunk; }); child.stderr.on('data', chunk => { logs += chunk; });
  t.after(async () => {
    if (child.exitCode === null) { child.kill(); await once(child, 'exit'); }
    upstream.closeAllConnections(); await new Promise(resolve => upstream.close(resolve));
    await rm(fixture, { recursive: true, force: true });
  });
  const call = async (route, method = 'GET', body, authenticated = true) => {
    const response = await fetch(`http://127.0.0.1:${port}${route}`, { method, headers: authenticated ? { Authorization: `Bearer ${token}` } : {}, ...(body === undefined ? {} : { body: typeof body === 'string' ? body : JSON.stringify(body) }) });
    return { status: response.status, data: await response.json() };
  };
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    try { ready = (await call('/health')).status === 200; if (ready) break; } catch {}
    if (child.exitCode !== null) throw new Error(`Service exited: ${logs}`);
    await delay(25);
  }
  assert.ok(ready, 'service starts');
  let id;
  await t.test('all routes require host authentication', async () => {
    assert.equal((await call('/health', 'GET', undefined, false)).status, 401);
    assert.equal((await call('/balances', 'GET', undefined, false)).status, 401);
  });
  await t.test('connection test does not persist configuration', async () => {
    const result = await call('/relays/test', 'POST', { baseUrl: base + '/v1/', apiKey: 'fixture-only-key' });
    assert.equal(result.data.ok, true);
    assert.equal(result.data.balance.value, 25);
    assert.deepEqual((await call('/relays')).data.relays, []);
  });
  await t.test('saving normalizes the URL and never returns the stored key', async () => {
    const result = await call('/relays', 'POST', { name: 'Fixture', baseUrl: base + '/v1', apiKey: 'fixture-only-key' });
    assert.equal(result.status, 200);
    id = result.data.relays[0].id;
    assert.equal(result.data.relays[0].baseUrl, base);
    assert.equal(result.data.relays[0].hasKey, true);
    assert.equal(JSON.stringify(result.data).includes('fixture-only-key'), false);
    const document = JSON.parse(await readFile(configFile, 'utf8'));
    assert.equal(document.relays[0].apiKey, 'fixture-only-key');
  });
  await t.test('cache reuse avoids upstream calls and refresh failures preserve stale data', async () => {
    const first = await call('/balances');
    assert.equal(first.data.providers[0].balance.value, 25);
    const fetched = requests;
    await call('/balances'); assert.equal(requests, fetched);
    mode = 'offline';
    const result = await call('/balances?refresh=1');
    assert.equal(result.data.providers[0].ok, false);
    assert.equal(result.data.providers[0].stale, true);
    assert.equal(result.data.providers[0].balance.value, 25);
    assert.equal(result.data.providers[0].updatedAt, first.data.providers[0].updatedAt);
    mode = 'normal';
  });
  await t.test('blank keys survive edits, but cannot be forwarded to a different site', async () => {
    const result = await call('/relays', 'POST', { id, name: 'Renamed', baseUrl: base, apiKey: '' });
    assert.equal(result.status, 200);
    assert.equal(JSON.parse(await readFile(configFile, 'utf8')).relays[0].apiKey, 'fixture-only-key');
    const denied = await call('/relays/test', 'POST', { id, baseUrl: 'https://different.example.com', apiKey: '' });
    assert.equal(denied.status, 400);
    assert.match(denied.data.error, /重新填写/);
    assert.equal((await call('/balances')).data.providers[0].name, 'Renamed');
  });
  await t.test('a missing usage result does not show the full budget as remaining balance', async () => {
    mode = 'no-usage';
    const result = await call('/relays/test', 'POST', { id, baseUrl: base, apiKey: '' });
    assert.equal(result.data.ok, true);
    assert.equal(result.data.balance, null);
    assert.match(result.data.detail, /无法计算/);
    mode = 'normal';
  });
  await t.test('malformed, oversized and stale edits fail without stopping the service', async () => {
    assert.equal((await call('/relays', 'POST', '{broken')).status, 400);
    assert.equal((await call('/relays', 'POST', 'x'.repeat(66000))).status, 413);
    assert.equal((await call('/relays', 'POST', { id: 'removed', name: 'Unknown', baseUrl: base, apiKey: 'fixture-key' })).status, 404);
    assert.equal((await call('/health')).status, 200);
  });
  await t.test('configuration corruption is not silently replaced with an empty list', async () => {
    const original = await readFile(configFile, 'utf8');
    await writeFile(configFile, '{broken');
    assert.equal((await call('/relays')).status, 500);
    assert.equal((await call('/relays', 'POST', { name: 'New', baseUrl: base, apiKey: 'fixture' })).status, 500);
    assert.equal(await readFile(configFile, 'utf8'), '{broken');
    await writeFile(configFile, original);
  });
  await t.test('deleting invalidates cached balances', async () => {
    assert.equal((await call('/relays?id=' + id, 'DELETE')).status, 200);
    assert.deepEqual((await call('/balances')).data.providers, []);
    assert.equal(logs.includes('fixture-only-key'), false);
  });
});
