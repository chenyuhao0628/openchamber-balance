import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildQuotaUsage, quotaCredential, readQuotaRequest } from "../src/service/quota.ts";
import type { Provider } from "../src/shared/types.ts";

const provider = (overrides: Partial<Provider>): Provider => ({
  id: "provider",
  name: "Provider",
  ok: true,
  plan: null,
  balance: null,
  detail: null,
  windows: [],
  updatedAt: 1,
  stale: false,
  ...overrides,
});

test("quota request parses only the supported wire call", () => {
  const valid = {
    v: 1,
    requestId: "req-1",
    method: "usage.read",
    provider: "ext-balance",
    input: { credentials: { "command-code": { type: "api", key: "secret" } } },
  };
  assert.deepEqual(readQuotaRequest(valid), {
    requestId: "req-1",
    provider: "ext-balance",
    credentials: { "command-code": { type: "api", key: "secret" } },
  });
  assert.equal(readQuotaRequest({ ...valid, v: 2 }), null);
  assert.equal(readQuotaRequest({ ...valid, method: "usage.write" }), null);
  assert.equal(readQuotaRequest({ ...valid, input: { credentials: [] } }), null);
  assert.equal(readQuotaRequest({ ...valid, input: { credentials: { x: null } } }), null);
});

test("quota credentials keep only what the service can use", () => {
  assert.deepEqual(quotaCredential({ type: "api", key: "sk-1", metadata: { org: "x" } }), {
    key: "sk-1",
    kind: "api",
  });
  assert.deepEqual(quotaCredential({ type: "oauth", access: "token", refresh: "r" }), {
    key: "token",
    kind: "oauth",
  });
  assert.equal(quotaCredential({ type: "api", key: "" }), null);
  assert.equal(quotaCredential("secret"), null);
});

test("quota usage maps providers, windows, balances and partial failures", () => {
  const data = buildQuotaUsage({
    configured: true,
    providers: [
      provider({
        id: "command-code",
        name: "Command Code",
        plan: "Pro",
        windows: [
          {
            key: "five-hour",
            label: "5 小时",
            usedPercent: 42,
            remainingPercent: 58,
            resetAt: 1_800_000_000_000,
            resetAtText: "later",
            detail: "21 / 50",
          },
        ],
      }),
      provider({
        id: "stepfun",
        name: "StepFun",
        plan: "预付费",
        balance: { value: 12.5, label: "$12.50", unit: "USD" },
      }),
      provider({
        id: "relay:one",
        name: "Relay One",
        ok: false,
        error: "查询超时",
      }),
    ],
  });

  assert.equal(data.ok, true);
  assert.equal(data.configured, true);
  assert.equal(data.planLabel, "Pro · 预付费");
  assert.equal(data.usage?.windows["Command Code · 5 小时"].usedPercent, 42);
  assert.equal(data.usage?.windows["Command Code · 5 小时"].valueLabel, "21 / 50");
  assert.equal(data.usage?.windows["Command Code · 5 小时"].resetAt, 1_800_000_000_000);
  assert.equal(data.usage?.windows["StepFun · 余额"].usedPercent, null);
  assert.equal(data.usage?.windows["StepFun · 余额"].valueLabel, "$12.50");
  assert.equal(data.usage?.windows["Relay One · 状态"].valueLabel, "查询超时");
  assert.match(data.error ?? "", /Relay One：查询超时/);
});

test("quota usage stays empty and unconfigured when nothing is configured", () => {
  const data = buildQuotaUsage({ providers: [], configured: false });
  assert.equal(data.ok, false);
  assert.equal(data.configured, false);
  assert.equal(data.usage, null);
  assert.equal(data.error, undefined);
});

test("the manifest declares the quota role for the 2.7 host", () => {
  const manifest = JSON.parse(
    readFileSync(new URL("../package.json", import.meta.url), "utf8"),
  ) as {
    version: string;
    openchamber: {
      engines: { openchamber: string };
      contributes: {
        service: { provides?: string[] };
        quota?: { providers?: string[] };
      };
    };
  };
  assert.equal(manifest.version, "0.3.0");
  assert.equal(manifest.openchamber.engines.openchamber, ">=2.7.0");
  assert.deepEqual(manifest.openchamber.contributes.service.provides, ["quota"]);
  assert.deepEqual(manifest.openchamber.contributes.quota?.providers, [
    "command-code",
    "commandcode",
    "stepfun-step-plan",
    "stepfun",
  ]);
});
