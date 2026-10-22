/** Accept the two common pasted forms: a site root and an OpenAI-style /v1 base. */
export const normalizeRelayUrl = (input: string): string => {
  const value = input.trim();
  if (!value) throw new Error('请填写服务地址');
  let url: URL;
  try {
    url = new URL(value.includes('://') ? value : `https://${value}`);
  } catch {
    throw new Error('请输入有效的服务地址，例如 https://relay.example.com');
  }
  if (!['https:', 'http:'].includes(url.protocol) || !url.hostname) {
    throw new Error('服务地址仅支持 HTTP 或 HTTPS');
  }
  if (url.username || url.password || url.search || url.hash) {
    throw new Error('服务地址不能包含账号、密钥、查询参数或锚点');
  }
  const pathname = url.pathname.replace(/\/+$/, '').replace(/\/v1$/i, '');
  return `${url.origin}${pathname}`;
};

export const changesRelayOrigin = (previous: string, next: string): boolean =>
  new URL(normalizeRelayUrl(previous)).origin !== new URL(normalizeRelayUrl(next)).origin;
