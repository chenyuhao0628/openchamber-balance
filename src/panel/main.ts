// Two host surfaces share rendering; the status bundle never mounts relay management.
declare const IS_SECTION: boolean;
import { connectHost, HostRequestError, type GuestRequestMethod, type GuestStatusControl } from '@openchamber/sdk';
import { applyHostReady, mountButton, mountTabs, mountTextField, mountSpinner } from '@openchamber/sdk/ui';
import type { Provider, PublicRelay, UsageWindow } from '../shared/types.ts';
import { changesRelayOrigin, normalizeRelayUrl } from '../shared/relay-url.ts';
import { asNumber, parseProvider, parseRelay } from './data.ts';
import { formatBalance, formatReset, formatTime } from './format.ts';
import css from './style.css';
import native from '../../ui/native.css';
import { openManager } from '../../ui/navigation.ts';

const host = connectHost({ requestTimeoutMs: 30_000 });
const root = document.querySelector<HTMLElement>('#root');
if (!root) throw new Error('Missing #root');
const style = document.createElement('style');
style.textContent = native + css;
document.head.append(style);
const el = <K extends keyof HTMLElementTagNameMap>(tag: K, className = '', text?: string): HTMLElementTagNameMap[K] => {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

let providers: Provider[] = [];
let relays: PublicRelay[] = [];
let fetchedAt: number | null = null;
let locale = 'zh-CN';
let initialized = false;
let loading = false;
let loadingRelays = false;
let loadError: string | null = null;
let relayError: string | null = null;
let loadGeneration = 0;
let relayGeneration = 0;
let activeView: 'overview' | 'relays' = 'overview';
let tabSignature = '';
let editor: 'new' | PublicRelay | null = null;
let pendingDelete: string | null = null;
let operation: 'test' | 'save' | 'delete' | null = null;
let formName = '';
let formUrl = '';
let formKey = '';
let showKey = false;
let notice: { text: string; tone: 'success' | 'error' } | null = null;
let navigationMessage: string | null = null;
let statusControlsSupported = false;
let statusControlSignature = '';

const refreshBalances = (): void => { notice = null; void loadBalances(true); };
const openBalanceManager = (): void => {
  void openManager(host, { id: 'balance', name: '余额' }).catch((error) => { navigationMessage = error.message; render(); });
};
if (IS_SECTION) {
  host.onStatusControl((event) => {
    if (event.id === 'refresh') refreshBalances();
    else if (event.id === 'manage') openBalanceManager();
  });
}

const describeError = (error: unknown): string => {
  if (error instanceof HostRequestError) {
    if (error.code === 'NO_SERVICE') return '请在设置 → 扩展中允许“余额”运行本地服务。';
    if (error.code === 'SERVICE_FAILED') return '本地服务尚未就绪，请重新加载扩展后重试。';
    if (error.code === 'HOST_TIMEOUT') return '查询耗时较长，请稍后重试。';
    if (error.code === 'DISABLED') return '余额扩展已停用，请在扩展设置中启用。';
    return '暂时无法连接本地服务，请稍后重试。';
  }
  return error instanceof Error ? error.message : '操作失败，请重试。';
};
const request = async (method: GuestRequestMethod, path: string, options: { query?: Record<string, string>; body?: unknown } = {}): Promise<Record<string, unknown>> => {
  const response = await host.serviceRequest({ method, path, ...(options.query ? { query: options.query } : {}), ...(options.body === undefined ? {} : { body: JSON.stringify(options.body) }) });
  let data: Record<string, unknown>;
  try { data = JSON.parse(response.body) as Record<string, unknown>; }
  catch { throw new Error('服务返回了无法识别的数据，请重试。'); }
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('服务返回的数据格式不正确。');
  if (response.status >= 400) throw new Error(typeof data.error === 'string' ? data.error : `请求失败（${response.status}）`);
  return data;
};
const noteElement = (text: string, tone: 'success' | 'error' | 'warning' = 'warning'): HTMLElement => {
  const node = el('div', 'bx-notice', text);
  node.dataset.tone = tone;
  node.setAttribute('role', tone === 'error' ? 'alert' : 'status');
  return node;
};

const app = el('main', 'ext bx');
app.setAttribute('aria-label', '余额与额度');
const top = el('header', 'bx-top');
const tabRoot = el('div', 'bx-tabs');
const toolbar = el('div', 'bx-toolbar');
const meta = el('div', 'bx-meta');
const count = el('span', 'bx-count');
const time = el('span', 'bx-time');
time.setAttribute('role', 'status');
meta.append(count, time);
const toolbarActions = el('div', 'bx-actions');
const refresh = mountButton(toolbarActions, { label: '刷新', variant: 'ghost', size: 'sm', onClick: refreshBalances });
if (IS_SECTION) mountButton(toolbarActions, { label: '管理', variant: 'ghost', size: 'sm', onClick: openBalanceManager });
toolbar.append(meta, toolbarActions);
top.append(toolbar);
const overview = el('section', 'bx-view');
overview.id = 'balance-overview';
overview.setAttribute('aria-label', '余额总览');
const alerts = el('div');
const list = el('div');
const footer = el('p', 'bx-footer', '余额按服务分别显示。点击刷新，获取最新数据。');
overview.append(alerts, list, footer);
const management = el('section', 'bx-view');
management.id = 'balance-relays';
management.setAttribute('aria-label', '中转站管理');
const managementContent = el('div');
const managementHead = el('div', 'bx-management-head');
managementHead.append(el('p', '', '管理用于查询余额的连接'));
const add = mountButton(managementHead, { label: '添加中转站', size: 'sm', onClick: () => openEditor('new') });
const relayList = el('div');
managementContent.append(managementHead, relayList);
const editorRoot = el('div', 'bx-editor');
const editorHead = el('div', 'bx-editor-head');
const editorTitle = el('h2', 'bx-editor-title');
const cancel = mountButton(editorHead, { label: '取消', variant: 'ghost', size: 'sm', onClick: () => closeEditor() });
editorHead.prepend(editorTitle);
const editorIntro = el('p', 'bx-editor-intro', '填写连接信息，可先测试再保存。');
const form = el('form', 'bx-form');
form.noValidate = true;
form.addEventListener('submit', (event) => { event.preventDefault(); void saveRelay(); });
const nameRoot = el('div', 'bx-field');
const urlRoot = el('div', 'bx-field');
const keyRoot = el('div', 'bx-field');
const nameField = mountTextField(nameRoot, { label: '名称', placeholder: '例如：日常使用', value: '', onChange: (value) => { formName = value; nameField.update({ value, error: undefined }); clearTest(); } });
const urlField = mountTextField(urlRoot, { label: '服务地址', placeholder: 'https://relay.example.com', value: '', helper: '可粘贴网站地址或以 /v1 结尾的 API 地址。', onChange: (value) => { formUrl = value; urlField.update({ value, error: undefined }); clearTest(); } });
const keyField = mountTextField(keyRoot, { label: 'API Key', placeholder: '填写该站点的 API Key', password: true, mono: true, value: '', onChange: (value) => { formKey = value; keyField.update({ value, error: undefined }); clearTest(); } });
const keyActions = el('div', 'bx-key-actions');
const reveal = mountButton(keyActions, { label: '显示密钥', variant: 'ghost', size: 'xs', onClick: () => { showKey = !showKey; keyField.update({ password: !showKey }); reveal.update({ label: showKey ? '隐藏密钥' : '显示密钥' }); } });
keyRoot.append(keyActions);
const testNote = el('div');
const formActions = el('div', 'bx-form-actions');
const test = mountButton(formActions, { label: '测试连接', variant: 'outline', size: 'sm', onClick: () => { void testRelay(); } });
const saveRoot = el('span');
const save = mountButton(saveRoot, { label: '保存', size: 'sm', onClick: () => {} });
saveRoot.querySelector('button')!.type = 'submit';
formActions.append(saveRoot);
form.append(nameRoot, urlRoot, keyRoot, testNote, formActions);
editorRoot.append(editorHead, editorIntro, form);
management.append(managementContent, editorRoot);
const tabs = !IS_SECTION ? mountTabs(tabRoot, { items: [{ id: 'overview', label: '总览' }, { id: 'relays', label: '中转站' }], activeId: 'overview', onChange: (id) => {
  activeView = id === 'relays' ? 'relays' : 'overview';
  render();
  if (activeView === 'relays') void loadRelays();
} }) : null;
if (!IS_SECTION) top.prepend(tabRoot);
if (!IS_SECTION) app.append(top);
app.append(overview);
if (!IS_SECTION) app.append(management);
root.append(app);

const inputs = [nameRoot, urlRoot, keyRoot].map((field, index) => {
  const input = field.querySelector('input')!;
  const note = field.querySelector('.oc-sdk-field-note')!;
  input.id = ['relay-name', 'relay-url', 'relay-key'][index];
  input.name = input.id;
  input.setAttribute('aria-label', ['名称', '服务地址', 'API Key'][index]);
  input.autocomplete = index === 2 ? 'new-password' : 'off';
  input.spellcheck = false;
  input.maxLength = [60, 2048, 4096][index];
  note.id = `${input.id}-hint`;
  input.setAttribute('aria-describedby', note.id);
  return input;
});
inputs[1].inputMode = 'url';
const clearTest = (): void => { testNote.replaceChildren(); };
const syncBusy = (): void => {
  const busy = operation !== null;
  nameField.update({ disabled: busy });
  urlField.update({ disabled: busy });
  keyField.update({ disabled: busy });
  cancel.update({ disabled: busy });
  reveal.update({ disabled: busy });
  add.update({ disabled: busy || Boolean(relayError) || loadingRelays });
  test.update({ disabled: busy, loading: operation === 'test', label: operation === 'test' ? '测试中…' : '测试连接' });
  save.update({ disabled: busy, loading: operation === 'save', label: operation === 'save' ? '保存中…' : editor === 'new' ? '添加中转站' : '保存更改' });
};
function openEditor(value: 'new' | PublicRelay): void {
  if (operation) return;
  editor = value;
  pendingDelete = null;
  formName = value === 'new' ? '' : value.name;
  formUrl = value === 'new' ? '' : value.baseUrl;
  formKey = '';
  showKey = false;
  nameField.update({ value: formName, error: undefined });
  urlField.update({ value: formUrl, error: undefined });
  keyField.update({ value: '', error: undefined, password: true, placeholder: value === 'new' ? '填写该站点的 API Key' : '留空保留现有密钥', helper: value === 'new' ? '保存后不会显示完整密钥。' : '留空保留现有密钥；更换站点时需重新填写。' });
  reveal.update({ label: '显示密钥' });
  clearTest();
  activeView = 'relays';
  render();
  management.scrollTop = 0;
  inputs[0].focus();
}
function closeEditor(): void {
  if (operation) return;
  editor = null;
  formKey = '';
  keyField.update({ value: '', password: true });
  clearTest();
  render();
  managementHead.querySelector('button')?.focus();
}
const validate = (requireName: boolean): { name: string; baseUrl: string; apiKey: string; id?: string } | null => {
  nameField.update({ error: undefined }); urlField.update({ error: undefined }); keyField.update({ error: undefined });
  let first: HTMLInputElement | null = null;
  if (requireName && !formName.trim()) { nameField.update({ error: '为这个连接取一个便于识别的名称。' }); first = inputs[0]; }
  let baseUrl = '';
  try { baseUrl = normalizeRelayUrl(formUrl); }
  catch (error) { urlField.update({ error: describeError(error) }); first ??= inputs[1]; }
  let needsKey = editor === 'new';
  if (baseUrl && editor && editor !== 'new') needsKey = changesRelayOrigin(editor.baseUrl, baseUrl);
  if (needsKey && !formKey.trim()) { keyField.update({ error: editor === 'new' ? '请填写 API Key。' : '更换站点时，请填写新站点的 API Key。' }); first ??= inputs[2]; }
  if (first) { first.focus(); return null; }
  return { name: formName.trim(), baseUrl, apiKey: formKey.trim(), ...(editor && editor !== 'new' ? { id: editor.id } : {}) };
};
async function testRelay(): Promise<void> {
  if (operation || !editor) return;
  const data = validate(false);
  if (!data) return;
  operation = 'test'; clearTest(); syncBusy();
  try {
    const result = await request('POST', '/relays/test', { body: data });
    if (result.ok !== true) throw new Error(typeof result.error === 'string' ? result.error : '连接未成功，请检查地址和密钥。');
    const balance = result.balance as { value?: unknown; unit?: unknown } | null;
    const amount = balance && asNumber(balance.value) !== null ? ` · 可用 ${formatBalance(asNumber(balance.value), typeof balance.unit === 'string' ? balance.unit : 'USD', locale)}` : '';
    testNote.replaceChildren(noteElement(`连接成功${amount}。尚未保存。`, 'success'));
  } catch (error) { testNote.replaceChildren(noteElement(describeError(error), 'error')); }
  finally { operation = null; syncBusy(); }
}
async function saveRelay(): Promise<void> {
  if (operation || !editor) return;
  const data = validate(true);
  if (!data) return;
  operation = 'save'; clearTest(); syncBusy();
  try {
    const result = await request('POST', '/relays', { body: data });
    relayGeneration += 1;
    loadingRelays = false;
    setRelays(result);
    editor = null;
    formKey = '';
    keyField.update({ value: '', password: true });
    activeView = 'overview';
    notice = { text: `已保存“${data.name}”。`, tone: 'success' };
    render();
    await loadBalances(true);
  } catch (error) { testNote.replaceChildren(noteElement(describeError(error), 'error')); }
  finally { operation = null; render(); }
}
async function deleteRelay(relay: PublicRelay): Promise<void> {
  if (operation) return;
  operation = 'delete'; render();
  try {
    const result = await request('DELETE', '/relays', { query: { id: relay.id } });
    relayGeneration += 1;
    loadingRelays = false;
    setRelays(result);
    providers = providers.filter((provider) => provider.id !== `relay:${relay.id}`);
    pendingDelete = null;
    await loadBalances(true);
  } catch (error) { relayError = describeError(error); }
  finally { operation = null; render(); }
}
const setRelays = (payload: Record<string, unknown>): void => {
  if (!Array.isArray(payload.relays)) throw new Error('服务未返回中转站列表，请重试。');
  relays = payload.relays.map(parseRelay).filter((relay): relay is PublicRelay => relay !== null);
  relayError = null;
};

const renderWindow = (window: UsageWindow): HTMLElement => {
  const node = el('div', 'bx-window');
  node.dataset.tone = window.usedPercent >= 90 ? 'error' : window.usedPercent >= 70 ? 'warning' : 'normal';
  const row = el('div', 'bx-window-head');
  row.append(el('span', 'bx-window-label', window.label), el('span', 'bx-percent', `已用 ${Math.round(window.usedPercent)}%`));
  const track = el('div', 'bx-track');
  track.setAttribute('role', 'progressbar');
  track.setAttribute('aria-label', `${window.label}已用额度`);
  track.setAttribute('aria-valuemin', '0'); track.setAttribute('aria-valuemax', '100');
  track.setAttribute('aria-valuenow', String(Math.round(window.usedPercent)));
  const fill = el('div', 'bx-fill'); fill.style.width = `${Math.max(0, Math.min(100, window.usedPercent))}%`; track.append(fill);
  const foot = el('div', 'bx-window-foot');
  if (window.detail) foot.append(el('span', '', window.detail));
  const reset = formatReset(window.resetAt, locale);
  if (reset) { const text = el('span', 'bx-reset', reset); text.title = new Date(window.resetAt!).toLocaleString(locale); foot.append(text); }
  node.append(row, track);
  if (foot.childNodes.length) node.append(foot);
  return node;
};
const terminalBoxIcon = (): SVGSVGElement => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('fill', 'currentColor');
  svg.setAttribute('class', 'bx-status-provider-icon');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM4 5V19H20V5H4ZM12 15H18V17H12V15ZM8.66685 12L5.83842 9.17157L7.25264 7.75736L11.4953 12L7.25264 16.2426L5.83842 14.8284L8.66685 12Z');
  svg.append(path);
  return svg;
};

const formatStatusReset = (timestamp: number | null): string | null => {
  if (!timestamp || !Number.isFinite(timestamp) || timestamp <= Date.now()) return null;
  return new Intl.DateTimeFormat(locale, {
    month: 'long', day: 'numeric', weekday: 'short',
    hour: 'numeric', minute: '2-digit', hourCycle: 'h23',
  }).format(timestamp);
};

const statusRow = (
  label: string,
  value: string,
  options: { reset?: string; title?: string; tone?: 'warning' | 'error'; muted?: boolean } = {},
): HTMLElement => {
  const row = el('div', 'bx-status-row');
  if (options.title) row.title = options.title;
  const labelWrap = el('span', 'bx-status-label-wrap');
  labelWrap.append(el('span', 'bx-status-label', label));
  if (options.reset) labelWrap.append(el('span', 'bx-status-reset', options.reset));
  const valueNode = el('span', 'bx-status-value', value);
  if (options.tone) valueNode.dataset.tone = options.tone;
  if (options.muted) valueNode.dataset.muted = 'true';
  row.append(labelWrap, valueNode);
  return row;
};

const renderStatusProvider = (provider: Provider): HTMLElement => {
  const node = el('article', 'bx-status-provider');
  node.setAttribute('aria-label', provider.name);
  const head = el('div', 'bx-status-row bx-status-provider-head');
  const nameWrap = el('span', 'bx-status-name-wrap');
  if (provider.id === 'command-code') nameWrap.append(terminalBoxIcon());
  nameWrap.append(el('span', 'bx-status-name', provider.name));
  if (provider.plan) head.title = `${provider.name} · ${provider.plan}`;
  head.append(nameWrap);
  node.append(head);

  for (const window of provider.windows) {
    const reset = formatReset(window.resetAt, locale);
    const compactReset = formatStatusReset(window.resetAt);
    const tone = window.usedPercent >= 80 ? 'error' : window.usedPercent >= 50 ? 'warning' : undefined;
    node.append(statusRow(window.label, `${Math.round(window.usedPercent)}%`, {
      reset: compactReset ?? undefined,
      tone,
      title: [window.detail, reset].filter(Boolean).join(' · ') || undefined,
    }));
  }

  const balance = provider.balance;
  const showBalance = Boolean(balance && balance.value !== null
    && !(provider.id === 'command-code' && provider.windows.length > 0));
  if (showBalance && balance) {
    node.append(statusRow('额度余额', formatBalance(balance.value, balance.unit, locale), {
      title: provider.stale ? '上次成功查询的余额' : undefined,
    }));
  }

  if (!provider.ok) {
    const error = el('div', 'bx-status-row bx-status-error', provider.error ?? '查询失败，请刷新重试。');
    error.setAttribute('role', 'alert');
    if (provider.stale && provider.updatedAt) error.title = `以上为 ${formatTime(provider.updatedAt, locale, true)} 的成功结果。`;
    node.append(error);
  } else if (!provider.balance && !provider.windows.length) {
    node.append(el('div', 'bx-status-row bx-status-muted', '已连接，但接口暂未提供余额或额度。'));
  }

  return node;
};

const renderProvider = (provider: Provider): HTMLElement => {
  const node = el('article', 'bx-provider');
  node.setAttribute('aria-label', provider.name);
  const header = el('div', 'bx-provider-head');
  const identity = el('div');
  const name = el('h2', 'bx-name', provider.name); name.title = provider.name;
  identity.append(name);
  if (provider.plan) identity.append(el('div', 'bx-plan', provider.plan));
  const balance = el('div', 'bx-balance');
  const value = provider.balance?.value ?? null;
  const unit = provider.balance?.unit ?? '';
  balance.append(el('strong', 'bx-amount', formatBalance(value, unit, locale)), el('span', 'bx-amount-label', value !== null ? (provider.stale ? '上次余额' : unit === '积分' ? '剩余积分' : '可用余额') : '余额未提供'));
  header.append(identity, balance);
  node.append(header);
  if (provider.detail) node.append(el('p', 'bx-detail', provider.detail));
  if (provider.windows.length) { const windows = el('div', 'bx-windows'); windows.append(...provider.windows.map(renderWindow)); node.append(windows); }
  if (!provider.ok) {
    const warning = noteElement(provider.error ?? '查询失败，请刷新重试。', provider.stale ? 'warning' : 'error');
    if (provider.stale && provider.updatedAt) warning.append(el('p', '', `以上为 ${formatTime(provider.updatedAt, locale, true)} 的成功结果。`));
    node.append(warning);
  } else if (!provider.balance && !provider.windows.length && !provider.detail) node.append(el('p', 'bx-detail', '已连接，但接口暂未提供余额或额度。'));
  return node;
};
const empty = (title: string, body: string, action?: () => void, label = '添加中转站'): HTMLElement => {
  const node = el('div', 'bx-empty'); node.append(el('h2', '', title), el('p', '', body));
  if (action) mountButton(node, { label, size: 'sm', onClick: action });
  return node;
};
function renderRelays(): void {
  relayList.replaceChildren();
  if (relayError) {
    const message = noteElement(relayError, 'error');
    mountButton(message, { label: '重试', size: 'sm', variant: 'ghost', onClick: () => { void loadRelays(); } });
    relayList.append(message);
  }
  if (loadingRelays && !relays.length) { relayList.append(el('p', 'bx-detail', '正在读取中转站…')); return; }
  if (!relays.length && !relayError) relayList.append(empty('还没有中转站', '添加一个连接后，就能在总览里查看它的余额与额度。'));
  for (const relay of relays) {
    const row = el('div', 'bx-relay');
    const line = el('div', 'bx-relay-line');
    const info = el('div', 'bx-relay-info');
    info.append(el('h3', 'bx-relay-name', relay.name), el('p', 'bx-relay-url', relay.baseUrl));
    const actions = el('div', 'bx-relay-actions');
    mountButton(actions, { label: '编辑', size: 'sm', variant: 'ghost', disabled: operation !== null, onClick: () => openEditor(relay) });
    mountButton(actions, { label: '移除', size: 'sm', variant: 'ghost', disabled: operation !== null, onClick: () => { pendingDelete = relay.id; renderRelays(); } });
    line.append(info, actions); row.append(line);
    if (pendingDelete === relay.id) {
      const confirmation = noteElement(`移除“${relay.name}”的连接？已保存的密钥会从本地配置中删除。`);
      const buttons = el('div', 'bx-actions');
      mountButton(buttons, { label: '取消', size: 'sm', variant: 'ghost', disabled: operation !== null, onClick: () => { pendingDelete = null; renderRelays(); } });
      mountButton(buttons, { label: '确认移除', size: 'sm', variant: 'destructive', loading: operation === 'delete', onClick: () => { void deleteRelay(relay); } });
      confirmation.append(buttons); row.append(confirmation);
    }
    relayList.append(row);
  }
}
const syncStatusControls = (): void => {
  if (!IS_SECTION || !statusControlsSupported) return;
  const controls: GuestStatusControl[] = [
    { kind: 'button', id: 'refresh', label: '刷新', disabled: loading || !initialized },
    { kind: 'button', id: 'manage', label: '管理', disabled: !initialized },
  ];
  const signature = JSON.stringify(controls);
  if (signature === statusControlSignature) return;
  statusControlSignature = signature;
  void host.setStatusControls(controls).catch(() => {
    statusControlsSupported = false;
    statusControlSignature = '';
    if (!top.isConnected) app.prepend(top);
  });
};

function render(): void {
  const errors = providers.filter((provider) => !provider.ok).length;
  count.textContent = IS_SECTION ? '' : `${providers.length} 个服务${errors ? ` · ${errors} 项待重试` : ''}`;
  time.textContent = loading ? '正在更新…' : fetchedAt ? `更新于 ${formatTime(fetchedAt, locale, new Date(fetchedAt).toDateString() !== new Date().toDateString())}` : '';
  time.title = fetchedAt ? new Date(fetchedAt).toLocaleString(locale) : '';
  refresh.update({ loading, disabled: !initialized, label: loading ? '刷新中' : '刷新' });
  overview.hidden = !IS_SECTION && activeView !== 'overview';
  management.hidden = IS_SECTION || activeView !== 'relays';
  footer.hidden = IS_SECTION || providers.length === 0;
  list.setAttribute('aria-busy', String(loading));
  alerts.replaceChildren();
  if (navigationMessage) alerts.append(noteElement(navigationMessage));
  if (notice) alerts.append(noteElement(notice.text, notice.tone));
  if (loadError) alerts.append(noteElement(`${loadError}${providers.length ? ' 已保留上次显示的数据。' : ''}`, 'error'));
  list.replaceChildren();
  if (!initialized || (loading && !providers.length)) {
    const pending = el('div', 'bx-loading'); mountSpinner(pending, { label: initialized ? '正在查询余额…' : '正在连接 OpenChamber…' }); list.append(pending);
  } else if (!providers.length) {
    list.append(empty(loadError ? '暂时无法读取余额' : '还没有可显示的余额', loadError ? '点击刷新重试，或检查扩展的本地服务权限。' : '在 OpenCode 配置 Command Code、StepFun，或添加中转站。', IS_SECTION ? undefined : () => openEditor('new')));
  } else list.append(...providers.map(IS_SECTION ? renderStatusProvider : renderProvider));
  syncStatusControls();
  if (!IS_SECTION) {
    const signature = `${activeView}:${relays.length}`;
    if (signature !== tabSignature) {
      const hadFocus = tabRoot.contains(document.activeElement);
      tabs?.update({ activeId: activeView, items: [{ id: 'overview', label: '总览' }, { id: 'relays', label: '中转站', count: relays.length || undefined }] });
      tabSignature = signature;
      tabRoot.querySelector('[role="tablist"]')?.setAttribute('aria-label', '余额视图');
      for (const tab of tabRoot.querySelectorAll<HTMLElement>('[role="tab"]')) {
        tab.id = `balance-tab-${tab.dataset.id}`;
        tab.setAttribute('aria-controls', `balance-${tab.dataset.id}`);
        if (hadFocus && tab.dataset.id === activeView) tab.focus();
      }
      overview.setAttribute('role', 'tabpanel');
      overview.setAttribute('aria-labelledby', 'balance-tab-overview');
      management.setAttribute('role', 'tabpanel');
      management.setAttribute('aria-labelledby', 'balance-tab-relays');
    }
    managementContent.hidden = editor !== null;
    editorRoot.hidden = editor === null;
    editorTitle.textContent = editor === 'new' ? '添加中转站' : '编辑中转站';
    if (!editor) renderRelays();
    syncBusy();
  }
}
async function loadBalances(force = false): Promise<void> {
  if (loading && !force) return;
  const generation = ++loadGeneration;
  loading = true; loadError = null; render();
  try {
    const payload = await request('GET', '/balances', force ? { query: { refresh: '1' } } : {});
    if (generation !== loadGeneration) return;
    if (!Array.isArray(payload.providers)) throw new Error('服务未返回有效的余额列表。');
    providers = payload.providers.map(parseProvider).filter((provider): provider is Provider => provider !== null);
    fetchedAt = asNumber(payload.fetchedAt);
  } catch (error) { if (generation === loadGeneration) loadError = describeError(error); }
  finally { if (generation === loadGeneration) { loading = false; render(); } }
}
async function loadRelays(): Promise<void> {
  if (IS_SECTION || loadingRelays) return;
  const generation = ++relayGeneration;
  loadingRelays = true; relayError = null; render();
  try { const payload = await request('GET', '/relays'); if (generation === relayGeneration) setRelays(payload); }
  catch (error) { if (generation === relayGeneration) relayError = describeError(error); }
  finally { if (generation === relayGeneration) { loadingRelays = false; render(); } }
}
host.onReady((context) => {
  applyHostReady(context, document.documentElement);
  // The interface copy is Chinese; date formatting follows the host's Chinese locale.
  locale = context.locale.startsWith('zh') ? context.locale : 'zh-CN';
  document.documentElement.lang = locale;
  statusControlsSupported = IS_SECTION && context.features?.statusControls === true;
  if (IS_SECTION && !statusControlsSupported && !top.isConnected) app.prepend(top);
  if (initialized) { render(); return; }
  initialized = true;
  void loadBalances();
  if (!IS_SECTION) void loadRelays();
});
if (IS_SECTION) {
  let lastHeight = -1;
  new ResizeObserver(() => {
    const height = Math.ceil(app.getBoundingClientRect().height);
    if (height > 0 && height !== lastHeight) { lastHeight = height; void host.setHeight(height).catch(() => undefined); }
  }).observe(app);
}
render();
