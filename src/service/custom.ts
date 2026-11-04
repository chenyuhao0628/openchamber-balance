import type { CustomMapping, CustomRequest, UsageWindow } from '../shared/types.ts';
import type { Contribution } from './contribution.ts';
import { asNumber, makeBalance, makeWindow } from './normalize.ts';

const pathTokens = (path: string): string[] => {
  const cleaned = path.trim().replace(/^\$\.?/, '');
  if (!cleaned) return [];
  return cleaned.replace(/\[(\d+)\]/g, '.$1').split('.').filter((token) => token.length > 0);
};

/** Reads a dot/bracket path such as `data.accounts[0].remaining`. Never evaluates code. */
export const readPath = (value: unknown, path: string): unknown => {
  let current = value;
  for (const token of pathTokens(path)) {
    if (token === '__proto__' || token === 'prototype' || token === 'constructor') return undefined;
    if (Array.isArray(current)) {
      const index = Number(token);
      if (!Number.isInteger(index) || index < 0) return undefined;
      current = current[index];
    } else if (current && typeof current === 'object') {
      current = (current as Record<string, unknown>)[token];
    } else {
      return undefined;
    }
  }
  return current;
};

const textAt = (value: unknown, path: string): string | null => {
  if (!path.trim()) return null;
  const found = readPath(value, path);
  return typeof found === 'string' && found.trim() ? found.trim() : null;
};

const numberAt = (value: unknown, path: string): number | null => {
  if (!path.trim()) return null;
  return asNumber(readPath(value, path));
};

export const validateCustomRequest = (request: CustomRequest): void => {
  if (request.method !== 'GET' && request.method !== 'POST') throw new Error('请求方式必须是 GET 或 POST');
  if (request.authHeader.trim().length > 100) throw new Error('认证请求头名称过长');
  if (request.headers.length > 8_000) throw new Error('额外请求头过长');
  if (request.body.length > 16_000) throw new Error('请求体过长');
  if (request.method === 'GET' && request.body.trim()) throw new Error('GET 请求不能包含请求体。');
  const { mapping } = request;
  if (!mapping.balancePath.trim() && !mapping.usedPath.trim() && !mapping.limitPath.trim() && !mapping.usedPercentPath.trim()) {
    throw new Error('请至少填写余额字段或额度字段。');
  }
  if (mapping.balancePath.length > 300 || mapping.usedPath.length > 300 || mapping.limitPath.length > 300
    || mapping.usedPercentPath.length > 300 || mapping.resetAtPath.length > 300
    || mapping.planPath.length > 300 || mapping.detailPath.length > 300) {
    throw new Error('响应字段路径过长');
  }
  if (mapping.unit.length > 20) throw new Error('单位过长');
  if (mapping.windowLabel.length > 40) throw new Error('额度窗口名称过长');
};

export const parseCustomContribution = (body: unknown, mapping: CustomMapping): Contribution => {
  if (!body || typeof body !== 'object') throw new Error('自定义接口返回的不是 JSON 对象');
  const unit = mapping.unit.trim() || 'USD';
  const balance = numberAt(body, mapping.balancePath);
  const plan = textAt(body, mapping.planPath);
  const detail = textAt(body, mapping.detailPath);
  const windows: UsageWindow[] = [];

  let usedPercent = numberAt(body, mapping.usedPercentPath);
  let used = numberAt(body, mapping.usedPath);
  let limit = numberAt(body, mapping.limitPath);
  if (usedPercent === null && used !== null && limit !== null && limit > 0) usedPercent = (used / limit) * 100;

  if (usedPercent !== null) {
    const resetAt = mapping.resetAtPath.trim() ? readPath(body, mapping.resetAtPath) : null;
    const countDetail = used !== null && limit !== null ? `${used} / ${limit}` : null;
    windows.push(makeWindow('custom', mapping.windowLabel.trim() || '额度', usedPercent, resetAt, countDetail));
  }

  if (balance === null && windows.length === 0) {
    throw new Error('自定义接口没有可展示的余额或额度；请检查字段路径');
  }
  return {
    plan,
    balance: balance === null ? null : makeBalance(balance, unit),
    detail,
    windows,
  };
};
