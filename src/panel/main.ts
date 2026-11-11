// Two host surfaces share rendering; the status bundle never mounts relay management.
declare const IS_SECTION: boolean;
import { connectHost, HostRequestError, type GuestRequestMethod, type GuestStatusControl } from '@openchamber/sdk';
import {
  applyHostReady,
  mountBadge,
  mountButton,
  mountSelect,
  mountSpinner,
  mountSwitch,
  mountTabs,
  mountTextField,
} from '@openchamber/sdk/ui';
import {
  EMPTY_CUSTOM_MAPPING,
  EMPTY_CUSTOM_REQUEST,
  type CustomMapping,
  type CustomRequest,
  type OpencodeProviderCandidate,
  type Provider,
  type PublicRelay,
  type RelayKind,
  type UsageWindow,
} from '../shared/types.ts';
import { extractJsonPaths } from '../shared/json-paths.ts';
import { changesEndpointOrigin, changesRelayOrigin, normalizeEndpointUrl, normalizeRelayUrl } from '../shared/relay-url.ts';
import { asNumber, parseOpencodeProvider, parseProvider, parseRelay } from './data.ts';
import { formatBalance, formatReset, formatStatusReset, formatTime } from './format.ts';
import css from './style.css';
import { COMMAND_CODE_ICON, RELAY_AUTO_ICON, RELAY_CUSTOM_ICON, STEPFUN_ICON } from './provider-icons.ts';
import native from '../../ui/native.css';
import { openManager } from '../../ui/navigation.ts';
import { installScrollbarActivity } from '../../ui/scrollbar.ts';
import { applyDocumentLanguage, i18n, serverText } from './i18n.ts';

const { t } = i18n;
const host = connectHost({ requestTimeoutMs: 30_000 });
const root = document.querySelector<HTMLElement>('#root');
if (!root) throw new Error('Missing #root');
const style = document.createElement('style');
style.textContent = native + css;
document.head.append(style);
installScrollbarActivity(document);

const el = <K extends keyof HTMLElementTagNameMap>(tag: K, className = '', text?: string): HTMLElementTagNameMap[K] => {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

let providers: Provider[] = [];
let relays: PublicRelay[] = [];
let opencodeProviders: OpencodeProviderCandidate[] = [];
let fetchedAt: number | null = null;
let locale = i18n.locale;
let initialized = false;
let loading = false;
let loadingRelays = false;
let loadError: unknown | null = null;
let relayError: unknown | null = null;
let loadGeneration = 0;
let relayGeneration = 0;
let activeView: 'overview' | 'relays' = 'overview';
let tabSignature = '';
let editor: 'new' | PublicRelay | null = null;
let pendingDelete: string | null = null;
let operation: 'test' | 'save' | 'delete' | 'toggle' | 'quick-add' | null = null;
let formName = '';
let formUrl = '';
let formKeySource: 'provider' | 'manual' = 'manual';
let formProviderId = '';
let formKey = '';
let formKind: RelayKind = 'auto';
let formMethod: CustomRequest['method'] = 'GET';
let formAuthHeader = 'Authorization';
let formAuthScheme: CustomRequest['authScheme'] = 'bearer';
let formHeaders = '';
let formBody = '';
let formMapping: CustomMapping = { ...EMPTY_CUSTOM_MAPPING };
let showKey = false;
let notice: { text: string; tone: 'success' | 'error' } | null = null;
let navigationMessage: string | null = null;
let statusControlsSupported = false;
let statusControlSignature = '';
let lastRailBadge: number | null | undefined;

const refreshBalances = (): void => { notice = null; void loadBalances(true); };
const openBalanceManager = (): void => {
  void openManager(host, { id: 'balance', name: t('余额') }).catch((error) => { navigationMessage = error.message; render(); });
};
if (IS_SECTION) {
  host.onStatusControl((event) => {
    if (event.id === 'refresh') refreshBalances();
    else if (event.id === 'manage') openBalanceManager();
  });
}

const describeError = (error: unknown): string => {
  if (error instanceof HostRequestError) {
    if (error.code === 'NO_SERVICE') return t('请在设置 → 扩展中允许“余额”运行本地服务。');
    if (error.code === 'SERVICE_FAILED') return t('本地服务尚未就绪，请重新加载扩展后重试。');
    if (error.code === 'HOST_TIMEOUT') return t('查询耗时较长，请稍后重试。');
    if (error.code === 'DISABLED') return t('余额扩展已停用，请在扩展设置中启用。');
    return t('暂时无法连接本地服务，请稍后重试。');
  }
  return serverText(error instanceof Error ? error.message : null) ?? t('操作失败，请重试。');
};

const request = async (
  method: GuestRequestMethod,
  path: string,
  options: { query?: Record<string, string>; body?: unknown } = {},
): Promise<Record<string, unknown>> => {
  const response = await host.serviceRequest({
    method,
    path,
    ...(options.query ? { query: options.query } : {}),
    ...(options.body === undefined ? {} : { body: JSON.stringify(options.body) }),
  });
  let data: Record<string, unknown>;
  try { data = JSON.parse(response.body) as Record<string, unknown>; }
  catch { throw new Error(t('服务返回了无法识别的数据，请重试。')); }
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error(t('服务返回的数据格式不正确。'));
  if (response.status >= 400) throw new Error(typeof data.error === 'string' ? serverText(data.error) ?? data.error : t('请求失败（{status}）', { status: response.status }));
  return data;
};

const noteElement = (text: string, tone: 'success' | 'error' | 'warning' = 'warning'): HTMLElement => {
  const node = el('div', 'bx-notice', text);
  node.dataset.tone = tone;
  node.setAttribute('role', tone === 'error' ? 'alert' : 'status');
  return node;
};

const app = el('main', 'ext ext-container bx');
app.setAttribute('aria-label', t('余额与额度'));
const top = el('header', 'bx-top');
const tabRoot = el('div', 'bx-tabs');
const toolbar = el('div', 'bx-toolbar');
const meta = el('div', 'bx-meta');
const count = el('span', 'bx-count');
const time = el('span', 'bx-time');
time.setAttribute('role', 'status');
meta.append(count, time);
const toolbarActions = el('div', 'bx-actions');
const refresh = mountButton(toolbarActions, { label: t('刷新'), variant: 'ghost', size: 'sm', onClick: refreshBalances });
const manage = IS_SECTION ? mountButton(toolbarActions, { label: t('管理'), variant: 'ghost', size: 'sm', onClick: openBalanceManager }) : null;
toolbar.append(meta, toolbarActions);
top.append(toolbar);

const overview = el('section', 'bx-view');
overview.id = 'balance-overview';
overview.setAttribute('aria-label', t('余额总览'));
const alerts = el('div');
const list = el('div');
const footer = el('p', 'bx-footer', t('余额按服务分别显示。点击刷新，获取最新数据。'));
overview.append(alerts, list, footer);

const management = el('section', 'bx-view');
management.id = 'balance-relays';
management.setAttribute('aria-label', t('接口管理'));
const managementContent = el('div');
const managementHead = el('div', 'bx-management-head');
const managementIntro = el('p', '', t('管理用于查询余额的接口'));
managementHead.append(managementIntro);
const add = mountButton(managementHead, { label: t('添加接口'), size: 'sm', onClick: () => openEditor('new') });
const discoverSlot = el('div');
const relayList = el('div');
managementContent.append(managementHead, discoverSlot, relayList);

const editorRoot = el('div', 'bx-editor');
const editorHead = el('div', 'bx-editor-head');
const editorTitle = el('h2', 'bx-editor-title');
const cancel = mountButton(editorHead, { label: t('取消'), variant: 'ghost', size: 'sm', onClick: () => closeEditor() });
editorHead.prepend(editorTitle);
const editorIntro = el('p', 'bx-editor-intro', t('填写连接信息，可先测试再保存。'));
const form = el('form', 'bx-form');
form.noValidate = true;
form.addEventListener('submit', (event) => { event.preventDefault(); void saveRelay(); });
form.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && (event.isComposing || event.keyCode === 229)) {
    event.preventDefault();
  }
});

const nameRoot = el('div', 'bx-field');
const kindRoot = el('div', 'bx-field');
const urlRoot = el('div', 'bx-field');
const keySourceRoot = el('div', 'bx-field');
const providerSelectRoot = el('div', 'bx-field');
const providerSourceNote = el('p', 'bx-key-note', t('实时只读复用 OpenChamber 供应商页面的密钥，不在本扩展重复落盘。'));
providerSelectRoot.append(providerSourceNote);
const providerSelectError = el('p', 'bx-field-error');
providerSelectError.hidden = true;
providerSelectRoot.append(providerSelectError);
const keyRoot = el('div', 'bx-field');

const nameField = mountTextField(nameRoot, {
  label: t('名称'),
  placeholder: t('例如：日常使用'),
  value: '',
  onChange: (value) => { formName = value; nameField.update({ value, error: undefined }); clearTest(); },
});
const kindField = mountSelect(kindRoot, {
  label: t('接口类型'),
  value: 'auto',
  options: [{ id: 'auto', label: t('自动识别中转站') }, { id: 'custom', label: t('自定义余额接口') }],
  onChange: (value) => { formKind = value === 'custom' ? 'custom' : 'auto'; syncKind(); clearTest(); },
});
const urlField = mountTextField(urlRoot, {
  label: t('服务地址'),
  placeholder: 'https://relay.example.com',
  value: '',
  helper: t('可粘贴网站地址或以 /v1 结尾的 API 地址。'),
  onChange: (value) => { formUrl = value; urlField.update({ value, error: undefined }); clearTest(); },
});
const keySourceField = mountSelect(keySourceRoot, {
  label: t('凭证来源'),
  value: 'manual',
  options: [
    { id: 'provider', label: t('复用供应商页面密钥（推荐）') },
    { id: 'manual', label: t('单独填写查询密钥') },
  ],
  onChange: (value) => {
    formKeySource = value === 'provider' ? 'provider' : 'manual';
    syncKeySource();
    clearTest();
  },
});
const providerSelectField = mountSelect(providerSelectRoot, {
  label: t('关联供应商'),
  value: null,
  searchable: true,
  searchPlaceholder: t('搜索供应商…'),
  placeholder: t('选择在供应商页面已配置的供应商…'),
  options: [],
  onChange: (value) => {
    formProviderId = value;
    providerSelectError.hidden = true;
    const candidate = opencodeProviders.find((item) => item.id === value);
    if (candidate) {
      if (!formName.trim()) {
        formName = candidate.name;
        nameField.update({ value: formName, error: undefined });
      }
      if (!formUrl.trim() && candidate.baseUrl) {
        formUrl = candidate.baseUrl;
        urlField.update({ value: formUrl, error: undefined });
      }
    }
    clearTest();
  },
});
// Keep helper note & error below the SDK select control.
providerSelectRoot.append(providerSourceNote, providerSelectError);

const keyField = mountTextField(keyRoot, {
  label: 'API Key',
  placeholder: t('填写该站点的 API Key'),
  password: true,
  mono: true,
  value: '',
  onChange: (value) => { formKey = value; keyField.update({ value, error: undefined }); clearTest(); },
});
const keyActions = el('div', 'bx-key-actions');
const reveal = mountButton(keyActions, {
  label: t('显示密钥'),
  variant: 'ghost',
  size: 'xs',
  onClick: () => {
    showKey = !showKey;
    keyField.update({ password: !showKey });
    reveal.update({ label: showKey ? t('隐藏密钥') : t('显示密钥') });
  },
});
keyRoot.append(keyActions);

const customRoot = el('div', 'bx-custom');
const customHead = el('p', 'bx-custom-head', t('自定义接口设置'));
const customHint = el('p', 'bx-custom-hint', t('按供应商文档填写请求地址和 JSON 字段路径；Key 只通过认证请求头发送。'));
const customGrid = el('div', 'bx-custom-grid');
const methodRoot = el('div', 'bx-field');
const authHeaderRoot = el('div', 'bx-field');
const authSchemeRoot = el('div', 'bx-field');
const headersRoot = el('div', 'bx-field bx-field-wide');
const bodyRoot = el('div', 'bx-field bx-field-wide');
const methodField = mountSelect(methodRoot, {
  label: t('请求方式'),
  value: 'GET',
  options: [{ id: 'GET', label: 'GET' }, { id: 'POST', label: 'POST' }],
  onChange: (value) => { formMethod = value === 'POST' ? 'POST' : 'GET'; syncMethod(); clearTest(); },
});
const authHeaderField = mountTextField(authHeaderRoot, {
  label: t('认证请求头'),
  placeholder: 'Authorization',
  value: 'Authorization',
  helper: t('例如 Authorization 或 x-api-key；留空表示不添加认证。'),
  onChange: (value) => { formAuthHeader = value; clearTest(); },
});
const authSchemeField = mountSelect(authSchemeRoot, {
  label: t('认证方式'),
  value: 'bearer',
  options: [{ id: 'bearer', label: 'Bearer Token' }, { id: 'raw', label: t('原始值') }],
  onChange: (value) => { formAuthScheme = value === 'raw' ? 'raw' : 'bearer'; clearTest(); },
});
const headersField = mountTextField(headersRoot, {
  label: t('额外请求头'),
  placeholder: 'x-api-version: 2026-01-01',
  value: '',
  mono: true,
  multiline: true,
  rows: 2,
  helper: t('每行一个 Name: value，不要在这里填写 API Key。'),
  onChange: (value) => { formHeaders = value; clearTest(); },
});
const bodyField = mountTextField(bodyRoot, {
  label: t('请求体'),
  placeholder: '{"model":"balance"}',
  value: '',
  mono: true,
  multiline: true,
  rows: 2,
  helper: t('仅 POST 使用；不要在这里填写 API Key。'),
  onChange: (value) => { formBody = value; clearTest(); },
});
customGrid.append(methodRoot, authHeaderRoot, authSchemeRoot, headersRoot, bodyRoot);

const mapping = el('details', 'bx-mapping');
mapping.open = true;
const mappingSummary = el('summary', '', t('响应字段映射'));
const mappingHint = el('p', 'bx-custom-hint', t('填写 JSON 路径，例如 data.balance 或 data.items[0].remaining。'));
mapping.append(mappingSummary, mappingHint);
const mappingGrid = el('div', 'bx-custom-grid');
const balancePathRoot = el('div', 'bx-field');
const unitRoot = el('div', 'bx-field');
const usedPathRoot = el('div', 'bx-field');
const limitPathRoot = el('div', 'bx-field');
const usedPercentPathRoot = el('div', 'bx-field');
const resetAtPathRoot = el('div', 'bx-field');
const windowLabelRoot = el('div', 'bx-field');
const balancePathField = mountTextField(balancePathRoot, { label: t('余额字段'), placeholder: 'data.balance', value: '', onChange: (value) => { formMapping = { ...formMapping, balancePath: value }; clearTest(); } });
const unitField = mountTextField(unitRoot, { label: t('单位'), placeholder: 'USD / CNY / 积分', value: 'USD', onChange: (value) => { formMapping = { ...formMapping, unit: value }; clearTest(); } });
const usedPathField = mountTextField(usedPathRoot, { label: t('已用字段'), placeholder: 'data.used', value: '', onChange: (value) => { formMapping = { ...formMapping, usedPath: value }; clearTest(); } });
const limitPathField = mountTextField(limitPathRoot, { label: t('总额字段'), placeholder: 'data.limit', value: '', onChange: (value) => { formMapping = { ...formMapping, limitPath: value }; clearTest(); } });
const usedPercentPathField = mountTextField(usedPercentPathRoot, { label: t('已用百分比字段'), placeholder: 'data.used_percent', value: '', helper: t('百分比字段优先于已用/总额字段。'), onChange: (value) => { formMapping = { ...formMapping, usedPercentPath: value }; clearTest(); } });
const resetAtPathField = mountTextField(resetAtPathRoot, { label: t('重置时间字段'), placeholder: 'data.reset_at', value: '', onChange: (value) => { formMapping = { ...formMapping, resetAtPath: value }; clearTest(); } });
const windowLabelField = mountTextField(windowLabelRoot, { label: t('额度窗口名称'), placeholder: t('额度'), value: t('额度'), onChange: (value) => { formMapping = { ...formMapping, windowLabel: value }; clearTest(); } });
mappingGrid.append(balancePathRoot, unitRoot, usedPathRoot, limitPathRoot, usedPercentPathRoot, resetAtPathRoot, windowLabelRoot);
mapping.append(mappingGrid);

const advanced = el('details', 'bx-mapping');
const advancedSummary = el('summary', '', t('高级字段'));
advanced.append(advancedSummary);
const advancedGrid = el('div', 'bx-custom-grid');
const planPathRoot = el('div', 'bx-field');
const detailPathRoot = el('div', 'bx-field');
const planPathField = mountTextField(planPathRoot, { label: t('套餐名称字段'), placeholder: 'data.plan', value: '', onChange: (value) => { formMapping = { ...formMapping, planPath: value }; clearTest(); } });
const detailPathField = mountTextField(detailPathRoot, { label: t('说明字段'), placeholder: 'data.note', value: '', onChange: (value) => { formMapping = { ...formMapping, detailPath: value }; clearTest(); } });
advancedGrid.append(planPathRoot, detailPathRoot);
advanced.append(advancedGrid);

const customError = el('p', 'bx-field-error');
customError.hidden = true;
customRoot.append(customHead, customHint, customError, customGrid, mapping, advanced);

const testNote = el('div');
const formActions = el('div', 'bx-form-actions');
const test = mountButton(formActions, { label: t('测试连接'), variant: 'outline', size: 'sm', onClick: () => { void testRelay(); } });
const saveRoot = el('span');
const save = mountButton(saveRoot, { label: t('保存'), size: 'sm', onClick: () => {} });
saveRoot.querySelector('button')!.type = 'submit';
formActions.append(saveRoot);
form.append(nameRoot, kindRoot, urlRoot, keySourceRoot, providerSelectRoot, keyRoot, customRoot, testNote, formActions);
editorRoot.append(editorHead, editorIntro, form);
management.append(managementContent, editorRoot);

const tabs = !IS_SECTION ? mountTabs(tabRoot, {
  items: [{ id: 'overview', label: t('总览') }, { id: 'relays', label: t('接口') }],
  activeId: 'overview',
  trackBackground: true,
  onChange: (id) => {
    activeView = id === 'relays' ? 'relays' : 'overview';
    render();
    if (activeView === 'relays') void loadRelays();
  },
}) : null;

if (!IS_SECTION) top.prepend(tabRoot);
if (!IS_SECTION) app.append(top);
app.append(overview);
if (!IS_SECTION) app.append(management);
root.append(app);

const inputs = [nameRoot, urlRoot, keyRoot].map((fieldNode, index) => {
  const input = fieldNode.querySelector('input')!;
  const note = fieldNode.querySelector('.oc-sdk-field-note')!;
  input.id = ['relay-name', 'relay-url', 'relay-key'][index];
  input.name = input.id;
  input.setAttribute('aria-label', [t('名称'), t('服务地址'), 'API Key'][index]);
  input.autocomplete = index === 2 ? 'new-password' : 'off';
  input.spellcheck = false;
  input.maxLength = [60, 4096, 4096][index];
  note.id = `${input.id}-hint`;
  input.setAttribute('aria-describedby', note.id);
  return input;
});
inputs[1].inputMode = 'url';
const customFields = [methodField, authHeaderField, authSchemeField, headersField, bodyField, balancePathField, unitField, usedPathField, limitPathField, usedPercentPathField, resetAtPathField, windowLabelField, planPathField, detailPathField];

const clearTest = (): void => { testNote.replaceChildren(); customError.hidden = true; };

const syncProviderSelectOptions = (): void => {
  const options = opencodeProviders.map((item) => ({
    id: item.id,
    label: item.name === item.id ? item.id : `${item.name} (${item.id})`,
    hint: item.hasCredential ? t('已配密钥') : t('待配密钥'),
  }));
  if (formProviderId && !options.some((item) => item.id === formProviderId)) {
    options.unshift({ id: formProviderId, label: formProviderId, hint: t('复用: {id}', { id: formProviderId }) });
  }
  providerSelectField.update({ value: formProviderId || null, options });
};

const syncKeySource = (): void => {
  const isProvider = formKeySource === 'provider';
  keySourceField.update({ value: formKeySource });
  providerSelectRoot.hidden = !isProvider;
  keyRoot.hidden = isProvider;
  providerSelectError.hidden = true;
  const isEditingStandalone = editor && editor !== 'new' && editor.hasKey && !editor.providerId;
  keyField.update({
    placeholder: isEditingStandalone ? t('留空保留现有密钥') : t('填写该站点的 API Key'),
    helper: isEditingStandalone
      ? t('留空保留现有密钥；更换站点时需重新填写。')
      : t('仅当站点账单查询令牌与推理密钥分离，或未加入供应商页面时单独填写。'),
  });
  syncProviderSelectOptions();
};

const syncMethod = (): void => {
  bodyRoot.hidden = formMethod !== 'POST';
  methodField.update({ value: formMethod });
};
syncMethod();

const syncKind = (): void => {
  const custom = formKind === 'custom';
  customRoot.hidden = !custom;
  kindField.update({ value: formKind });
  urlField.update({
    label: custom ? t('请求地址') : t('服务地址'),
    placeholder: custom ? 'https://api.example.com/v1/balance' : 'https://relay.example.com',
    helper: custom ? t('填写完整接口地址，包含路径；例如 https://api.example.com/v1/balance。') : t('可粘贴网站地址或以 /v1 结尾的 API 地址。'),
  });
  inputs[1].setAttribute('aria-label', custom ? t('请求地址') : t('服务地址'));
};

const applyCustomForm = (custom?: CustomRequest): void => {
  const value = custom ?? EMPTY_CUSTOM_REQUEST;
  formMethod = value.method;
  formAuthHeader = value.authHeader;
  formAuthScheme = value.authScheme;
  formHeaders = value.headers;
  formBody = value.body;
  formMapping = custom ? { ...value.mapping } : { ...EMPTY_CUSTOM_MAPPING, windowLabel: t('额度') };
  methodField.update({ value: formMethod });
  syncMethod();
  authHeaderField.update({ value: formAuthHeader });
  authSchemeField.update({ value: formAuthScheme });
  headersField.update({ value: formHeaders });
  bodyField.update({ value: formBody });
  balancePathField.update({ value: formMapping.balancePath });
  unitField.update({ value: formMapping.unit });
  usedPathField.update({ value: formMapping.usedPath });
  limitPathField.update({ value: formMapping.limitPath });
  usedPercentPathField.update({ value: formMapping.usedPercentPath });
  resetAtPathField.update({ value: formMapping.resetAtPath });
  windowLabelField.update({ value: formMapping.windowLabel });
  planPathField.update({ value: formMapping.planPath });
  detailPathField.update({ value: formMapping.detailPath });
};

const syncBusy = (): void => {
  const busy = operation !== null;
  nameField.update({ disabled: busy });
  kindField.update({ disabled: busy });
  urlField.update({ disabled: busy });
  keySourceField.update({ disabled: busy });
  providerSelectField.update({ disabled: busy });
  keyField.update({ disabled: busy });
  for (const field of customFields) field.update({ disabled: busy });
  cancel.update({ disabled: busy });
  reveal.update({ disabled: busy });
  add.update({ disabled: busy || Boolean(relayError) || loadingRelays });
  test.update({ disabled: busy, loading: operation === 'test', label: operation === 'test' ? t('测试中…') : t('测试连接') });
  save.update({ disabled: busy, loading: operation === 'save', label: operation === 'save' ? t('保存中…') : editor === 'new' ? t('添加接口') : t('保存更改') });
};

function openEditor(
  value: 'new' | PublicRelay,
  prefill?: { name?: string; baseUrl?: string; providerId?: string; kind?: RelayKind; custom?: CustomRequest },
): void {
  if (operation) return;
  editor = value;
  pendingDelete = null;
  formName = prefill?.name ?? (value === 'new' ? '' : value.name);
  formUrl = prefill?.baseUrl ?? (value === 'new' ? '' : value.baseUrl);
  formKey = '';
  formKind = prefill?.kind ?? (value === 'new' ? 'auto' : value.kind);

  const initialProviderId = prefill?.providerId ?? (value !== 'new' ? (value.providerId ?? '') : '');
  const hasAnyProvider = opencodeProviders.some((item) => item.hasCredential);
  formProviderId = initialProviderId;
  if (initialProviderId) {
    formKeySource = 'provider';
  } else if (value === 'new' && hasAnyProvider && !prefill) {
    formKeySource = 'provider';
  } else {
    formKeySource = 'manual';
  }

  showKey = false;
  applyCustomForm(prefill?.custom ?? (value === 'new' ? undefined : value.custom));
  nameField.update({ value: formName, error: undefined });
  urlField.update({ value: formUrl, error: undefined });
  keyField.update({ value: '', error: undefined, password: true });
  reveal.update({ label: t('显示密钥') });
  syncKind();
  syncKeySource();
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

type RelayDraft = {
  name: string;
  baseUrl: string;
  apiKey: string;
  providerId?: string;
  kind: RelayKind;
  custom?: CustomRequest;
  id?: string;
};

const validate = (requireName: boolean, allowEmptyMapping = false): RelayDraft | null => {
  nameField.update({ error: undefined });
  urlField.update({ error: undefined });
  keyField.update({ error: undefined });
  providerSelectError.hidden = true;
  customError.hidden = true;

  let first: HTMLElement | null = null;
  if (requireName && !formName.trim()) {
    nameField.update({ error: t('为这个连接取一个便于识别的名称。') });
    first = inputs[0];
  }
  let baseUrl = '';
  try {
    baseUrl = formKind === 'custom' ? normalizeEndpointUrl(formUrl) : normalizeRelayUrl(formUrl);
  } catch (error) {
    urlField.update({ error: describeError(error) });
    first ??= inputs[1];
  }

  if (formKeySource === 'provider') {
    if (!formProviderId.trim()) {
      providerSelectError.textContent = t('请选择要复用密钥的供应商。');
      providerSelectError.hidden = false;
      first ??= providerSelectRoot.querySelector<HTMLElement>('.oc-sdk-trigger') ?? inputs[0];
    }
  } else {
    const hadStandaloneKey = editor && editor !== 'new' && editor.hasKey && !editor.providerId;
    let needsKey = !hadStandaloneKey;
    if (baseUrl && editor && editor !== 'new' && hadStandaloneKey) {
      needsKey = formKind === 'custom' || editor.kind === 'custom'
        ? changesEndpointOrigin(editor.baseUrl, baseUrl)
        : changesRelayOrigin(editor.baseUrl, baseUrl);
    }
    if (needsKey && !formKey.trim()) {
      keyField.update({ error: editor === 'new' || !hadStandaloneKey ? t('请填写 API Key。') : t('更换接口时，请填写接口的 API Key。') });
      first ??= inputs[2];
    }
  }

  let custom: CustomRequest | undefined;
  if (formKind === 'custom') {
    const problem = (() => {
      const mappingData = {
        ...formMapping,
        balancePath: formMapping.balancePath.trim(),
        unit: formMapping.unit.trim() || 'USD',
        usedPath: formMapping.usedPath.trim(),
        limitPath: formMapping.limitPath.trim(),
        usedPercentPath: formMapping.usedPercentPath.trim(),
        resetAtPath: formMapping.resetAtPath.trim(),
        planPath: formMapping.planPath.trim(),
        detailPath: formMapping.detailPath.trim(),
        windowLabel: formMapping.windowLabel.trim() || t('额度'),
      };
      if (formMethod === 'GET' && formBody.trim()) return t('GET 请求不能包含请求体。');
      const anyMapping = Boolean(mappingData.balancePath || mappingData.usedPath || mappingData.limitPath || mappingData.usedPercentPath);
      if (!allowEmptyMapping && !anyMapping) return t('请至少填写余额字段或额度字段。');
      if (anyMapping && !mappingData.usedPercentPath && (Boolean(mappingData.usedPath) !== Boolean(mappingData.limitPath))) {
        return t('请同时填写已用字段和总额字段，或填写已用百分比字段。');
      }
      custom = {
        method: formMethod,
        authHeader: formAuthHeader.trim(),
        authScheme: formAuthScheme,
        headers: formHeaders,
        body: formBody,
        mapping: mappingData,
      };
      return null;
    })();
    if (problem) {
      customError.textContent = problem;
      customError.hidden = false;
      first ??= balancePathRoot.querySelector('input');
    }
  }
  if (first) { first.focus(); return null; }
  return {
    name: formName.trim(),
    baseUrl,
    apiKey: formKeySource === 'provider' ? '' : formKey.trim(),
    ...(formKeySource === 'provider' ? { providerId: formProviderId.trim() } : {}),
    kind: formKind,
    ...(custom ? { custom } : {}),
    ...(editor && editor !== 'new' ? { id: editor.id } : {}),
  };
};

const applyMappedPath = (target: keyof CustomMapping, targetLabel: string, pathValue: string): void => {
  formMapping = { ...formMapping, [target]: pathValue };
  mapping.open = true;
  if (target === 'planPath' || target === 'detailPath') advanced.open = true;
  balancePathField.update({ value: formMapping.balancePath });
  usedPathField.update({ value: formMapping.usedPath });
  limitPathField.update({ value: formMapping.limitPath });
  usedPercentPathField.update({ value: formMapping.usedPercentPath });
  resetAtPathField.update({ value: formMapping.resetAtPath });
  planPathField.update({ value: formMapping.planPath });
  customError.hidden = true;
  const feedback = testNote.querySelector<HTMLElement>('.bx-picker-feedback');
  if (feedback) feedback.textContent = t('已将 {path} 填入“{target}”。', { path: pathValue, target: targetLabel });
};

const appendRawAndPicker = (container: HTMLElement, rawData: unknown): void => {
  if (rawData === undefined) return;
  if (formKind === 'custom' && rawData && typeof rawData === 'object') {
    const candidates = extractJsonPaths(rawData, 24);
    if (candidates.length > 0) {
      const picker = el('div', 'bx-picker');
      const pickerTitle = el('p', 'bx-picker-title', t('点选响应字段填入映射'));
      const pickerFeedback = el('p', 'bx-key-note bx-picker-feedback');
      const pickerList = el('div', 'bx-picker-list');
      for (const item of candidates) {
        const row = el('div', 'bx-picker-row');
        const metaWrap = el('div', 'bx-picker-meta');
        metaWrap.append(el('code', 'bx-picker-path', item.path), el('span', 'bx-picker-val', `= ${item.preview}`));
        const btns = el('div', 'bx-picker-btns');
        if (item.kind === 'number') {
          mountButton(btns, { label: t('填入余额'), size: 'xs', variant: 'outline', onClick: () => applyMappedPath('balancePath', t('余额字段'), item.path) });
          mountButton(btns, { label: t('填入已用'), size: 'xs', variant: 'ghost', onClick: () => applyMappedPath('usedPath', t('已用字段'), item.path) });
          mountButton(btns, { label: t('填入总额'), size: 'xs', variant: 'ghost', onClick: () => applyMappedPath('limitPath', t('总额字段'), item.path) });
          mountButton(btns, { label: t('填入百分比'), size: 'xs', variant: 'ghost', onClick: () => applyMappedPath('usedPercentPath', t('已用百分比字段'), item.path) });
        } else {
          mountButton(btns, { label: t('填入重置'), size: 'xs', variant: 'ghost', onClick: () => applyMappedPath('resetAtPath', t('重置时间字段'), item.path) });
          mountButton(btns, { label: t('填入套餐'), size: 'xs', variant: 'ghost', onClick: () => applyMappedPath('planPath', t('套餐名称字段'), item.path) });
        }
        row.append(metaWrap, btns);
        pickerList.append(row);
      }
      picker.append(pickerTitle, pickerFeedback, pickerList);
      container.append(picker);
    }
  }
  const raw = el('details', 'bx-raw');
  raw.append(el('summary', '', t('查看原始响应')));
  const text = JSON.stringify(rawData, null, 2) ?? '';
  raw.append(el('pre', 'bx-raw-json', text.length > 12_000 ? `${text.slice(0, 12_000)}\n…` : text));
  container.append(raw);
};

async function testRelay(): Promise<void> {
  if (operation || !editor) return;
  const data = validate(false, formKind === 'custom');
  if (!data) return;
  operation = 'test'; clearTest(); syncBusy();
  try {
    const result = await request('POST', '/relays/test', { body: data });
    if (result.ok !== true) {
      const errText = typeof result.error === 'string'
        ? serverText(result.error) ?? result.error
        : t('连接未成功，请检查地址和密钥。');
      const tone = result.raw !== undefined ? 'warning' : 'error';
      const note = noteElement(errText, tone);
      appendRawAndPicker(note, result.raw);
      testNote.replaceChildren(note);
      return;
    }
    const balance = result.balance as { value?: unknown; unit?: unknown } | null;
    const windows = Array.isArray(result.windows) ? result.windows.length : 0;
    const amount = balance && asNumber(balance.value) !== null
      ? t(' · 可用 {amount}', { amount: formatBalance(asNumber(balance.value), unitLabel(typeof balance.unit === 'string' ? balance.unit : 'USD'), locale) })
      : windows > 0 ? t(' · {count} 个额度窗口', { count: windows }) : '';
    const note = noteElement(t('连接成功{amount}。尚未保存。', { amount }), 'success');
    appendRawAndPicker(note, result.raw);
    testNote.replaceChildren(note);
  } catch (error) {
    testNote.replaceChildren(noteElement(describeError(error), 'error'));
  } finally {
    operation = null;
    syncBusy();
  }
}

async function saveRelay(): Promise<void> {
  if (operation || !editor) return;
  const data = validate(true, false);
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
    notice = { text: t('已保存“{name}”。', { name: data.name }), tone: 'success' };
    render();
    await loadBalances(true);
  } catch (error) {
    testNote.replaceChildren(noteElement(describeError(error), 'error'));
  } finally {
    operation = null;
    render();
  }
}

async function quickConnectProvider(candidate: OpencodeProviderCandidate): Promise<void> {
  if (operation || !candidate.baseUrl) return;
  if (!candidate.hasCredential) {
    openEditor('new', { name: candidate.name, baseUrl: candidate.baseUrl, providerId: candidate.id, kind: 'auto' });
    return;
  }
  operation = 'quick-add'; render();
  try {
    const result = await request('POST', '/relays', {
      body: {
        name: candidate.name,
        baseUrl: candidate.baseUrl,
        apiKey: '',
        providerId: candidate.id,
        kind: 'auto',
      },
    });
    relayGeneration += 1;
    loadingRelays = false;
    setRelays(result);
    activeView = 'overview';
    notice = { text: t('已保存“{name}”。', { name: candidate.name }), tone: 'success' };
    render();
    await loadBalances(true);
  } catch (error) {
    relayError = error;
  } finally {
    operation = null;
    render();
  }
}

async function toggleRelayEnabled(relay: PublicRelay, enabled: boolean): Promise<void> {
  if (operation) return;
  operation = 'toggle'; render();
  try {
    const result = await request('POST', '/relays/toggle', { body: { id: relay.id, enabled } });
    relayGeneration += 1;
    loadingRelays = false;
    setRelays(result);
    if (!enabled) providers = providers.filter((provider) => provider.id !== `relay:${relay.id}`);
    await loadBalances(true);
  } catch (error) {
    relayError = error;
  } finally {
    operation = null;
    render();
  }
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
  } catch (error) {
    relayError = error;
  } finally {
    operation = null;
    render();
  }
}

const setRelays = (payload: Record<string, unknown>): void => {
  if (!Array.isArray(payload.relays)) throw new Error(t('服务未返回接口列表，请重试。'));
  relays = payload.relays.map(parseRelay).filter((relay): relay is PublicRelay => relay !== null);
  relayError = null;
};

const unitLabel = (unit: string): string => unit === '积分' ? t('积分') : unit;
const windowLabel = (window: UsageWindow): string => serverText(window.label) ?? window.label;
const providerError = (provider: Provider): string => serverText(provider.error) ?? t('查询失败，请刷新重试。');

const renderWindow = (window: UsageWindow): HTMLElement => {
  const node = el('div', 'bx-window');
  const label = windowLabel(window);
  node.dataset.tone = window.usedPercent >= 90 ? 'error' : window.usedPercent >= 70 ? 'warning' : 'normal';
  const row = el('div', 'bx-window-head');
  row.append(el('span', 'bx-window-label', label), el('span', 'bx-percent', t('已用 {percent}%', { percent: Math.round(window.usedPercent) })));
  const track = el('div', 'bx-track');
  track.setAttribute('role', 'progressbar');
  track.setAttribute('aria-label', t('{label}已用额度', { label }));
  track.setAttribute('aria-valuemin', '0');
  track.setAttribute('aria-valuemax', '100');
  track.setAttribute('aria-valuenow', String(Math.round(window.usedPercent)));
  const fill = el('div', 'bx-fill');
  fill.style.width = `${Math.max(0, Math.min(100, window.usedPercent))}%`;
  track.append(fill);
  const foot = el('div', 'bx-window-foot');
  const detail = serverText(window.detail);
  if (detail) foot.append(el('span', '', detail));
  const reset = formatReset(window.resetAt, locale, Date.now(), t);
  if (reset) {
    const text = el('span', 'bx-reset', reset);
    text.title = new Date(window.resetAt!).toLocaleString(locale);
    foot.append(text);
  }
  node.append(row, track);
  if (foot.childNodes.length) node.append(foot);
  return node;
};

const providerIcon = (providerId: string, className = 'bx-status-provider-icon'): SVGSVGElement | null => {
  let svg: string | null = null;
  if (providerId === 'command-code') svg = COMMAND_CODE_ICON;
  else if (providerId.startsWith('stepfun')) svg = STEPFUN_ICON;
  else if (providerId.startsWith('relay:')) {
    const relayId = providerId.slice('relay:'.length);
    const matched = relays.find((item) => item.id === relayId);
    svg = matched?.kind === 'custom' ? RELAY_CUSTOM_ICON : RELAY_AUTO_ICON;
  }
  if (!svg) return null;
  const template = document.createElement('template');
  template.innerHTML = svg;
  const node = template.content.firstElementChild;
  if (!(node instanceof SVGSVGElement)) return null;
  node.setAttribute('class', className);
  node.setAttribute('aria-hidden', 'true');
  node.setAttribute('focusable', 'false');
  return node;
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
  const icon = providerIcon(provider.id, 'bx-status-provider-icon');
  if (icon) nameWrap.append(icon);
  nameWrap.append(el('span', 'bx-status-name', provider.name));
  head.append(nameWrap);

  const hasData = Boolean(provider.balance || provider.windows.length);
  const statusText = !provider.ok
    ? providerError(provider)
    : !hasData ? t('已连接，但接口暂未提供余额或额度。') : null;
  if (statusText) {
    const status = el('span', 'bx-status-status', statusText);
    status.title = statusText;
    if (!provider.ok) {
      status.setAttribute('role', 'alert');
      if (provider.stale && provider.updatedAt) status.title = t('{status} · 以上为 {time} 的成功结果。', { status: statusText, time: formatTime(provider.updatedAt, locale, true) });
    }
    head.append(status);
  }
  const plan = serverText(provider.plan);
  const headTitle = [plan, statusText].filter(Boolean).join(' · ');
  if (headTitle) head.title = headTitle;
  node.append(head);

  for (const window of provider.windows) {
    const reset = formatReset(window.resetAt, locale, Date.now(), t);
    const compactReset = formatStatusReset(window.resetAt, locale);
    const tone = window.usedPercent >= 80 ? 'error' : window.usedPercent >= 50 ? 'warning' : undefined;
    node.append(statusRow(windowLabel(window), `${Math.round(window.usedPercent)}%`, {
      reset: compactReset ?? undefined,
      tone,
      title: [serverText(window.detail), reset].filter(Boolean).join(' · ') || undefined,
    }));
  }

  const balance = provider.balance;
  const showBalance = Boolean(balance && balance.value !== null
    && !(provider.id === 'command-code' && provider.windows.length > 0));
  if (showBalance && balance) {
    node.append(statusRow(t('额度余额'), formatBalance(balance.value, unitLabel(balance.unit), locale), {
      title: provider.stale ? t('上次成功查询的余额') : undefined,
    }));
  }

  if (!provider.ok && hasData) {
    const error = el('div', 'bx-status-row bx-status-error', providerError(provider));
    error.setAttribute('role', 'alert');
    if (provider.stale && provider.updatedAt) error.title = t('以上为 {time} 的成功结果。', { time: formatTime(provider.updatedAt, locale, true) });
    node.append(error);
  }

  return node;
};

const renderProvider = (provider: Provider): HTMLElement => {
  const node = el('article', 'bx-provider');
  node.setAttribute('aria-label', provider.name);
  const header = el('div', 'bx-provider-head');
  const identity = el('div', 'bx-identity');
  const nameRow = el('div', 'bx-name-row');
  const icon = providerIcon(provider.id, 'bx-card-icon');
  if (icon) nameRow.append(icon);
  const name = el('h2', 'bx-name', provider.name);
  name.title = provider.name;
  nameRow.append(name);
  identity.append(nameRow);
  const plan = serverText(provider.plan);
  if (plan) identity.append(el('div', 'bx-plan', plan));

  const balance = el('div', 'bx-balance');
  const value = provider.balance?.value ?? null;
  const unit = provider.balance?.unit ?? '';
  balance.append(
    el('strong', 'bx-amount', formatBalance(value, unitLabel(unit), locale)),
    el('span', 'bx-amount-label', value !== null ? (provider.stale ? t('上次余额') : unit === '积分' ? t('剩余积分') : t('可用余额')) : t('余额未提供')),
  );
  header.append(identity, balance);
  node.append(header);

  const detail = serverText(provider.detail);
  if (detail) node.append(el('p', 'bx-detail', detail));
  if (provider.windows.length) {
    const windows = el('div', 'bx-windows');
    windows.append(...provider.windows.map(renderWindow));
    node.append(windows);
  }
  if (!provider.ok) {
    const warning = noteElement(providerError(provider), provider.stale ? 'warning' : 'error');
    if (provider.stale && provider.updatedAt) {
      warning.append(el('p', '', t('以上为 {time} 的成功结果。', { time: formatTime(provider.updatedAt, locale, true) })));
    }
    const retryRow = el('div', 'bx-actions');
    mountButton(retryRow, { label: t('重试'), size: 'xs', variant: 'outline', disabled: loading, onClick: refreshBalances });
    warning.append(retryRow);
    node.append(warning);
  } else if (!provider.balance && !provider.windows.length && !provider.detail) {
    node.append(el('p', 'bx-detail', t('已连接，但接口暂未提供余额或额度。')));
  }
  return node;
};

const empty = (title: string, body: string, action?: () => void, label = t('添加接口')): HTMLElement => {
  const node = el('div', 'bx-empty');
  node.append(el('h2', '', title), el('p', '', body));
  if (action) mountButton(node, { label, size: 'sm', onClick: action });
  return node;
};

const unlinkedCustomProviders = (): OpencodeProviderCandidate[] => {
  const linkedProviderIds = new Set(relays.map((item) => item.providerId).filter(Boolean));
  const linkedUrls = new Set(relays.filter((item) => item.kind === 'auto').map((item) => item.baseUrl));
  return opencodeProviders.filter(
    (item) => item.isCustomConfig && item.baseUrl && !linkedProviderIds.has(item.id) && !linkedUrls.has(item.baseUrl),
  );
};

function renderDiscoverCard(): void {
  discoverSlot.replaceChildren();
  const candidates = unlinkedCustomProviders();
  if (candidates.length === 0) return;
  const box = el('div', 'bx-discover');
  const head = el('div');
  head.append(
    el('p', 'bx-discover-title', t('从供应商页面发现（直接复用密钥）')),
    el('p', 'bx-discover-desc', t('以下自定义供应商已在 OpenCode 配置，无需重复填写密钥即可接入余额查询。')),
  );
  const itemList = el('div', 'bx-discover-list');
  for (const item of candidates) {
    const row = el('div', 'bx-discover-item');
    const info = el('div', 'bx-discover-info');
    const nameRow = el('div', 'bx-discover-name-row');
    nameRow.append(el('span', 'bx-discover-name', item.name));
    const badgeSlot = el('span');
    mountBadge(badgeSlot, {
      label: item.hasCredential ? t('已配密钥') : t('待配密钥'),
      tone: item.hasCredential ? 'success' : 'warning',
    });
    nameRow.append(badgeSlot);
    info.append(nameRow);
    if (item.baseUrl) info.append(el('p', 'bx-discover-url', item.baseUrl));
    const actions = el('div', 'bx-discover-actions');
    mountButton(actions, {
      label: t('直接接入'),
      size: 'xs',
      variant: 'default',
      disabled: operation !== null,
      loading: operation === 'quick-add',
      onClick: () => { void quickConnectProvider(item); },
    });
    mountButton(actions, {
      label: t('自定义接入'),
      size: 'xs',
      variant: 'ghost',
      disabled: operation !== null,
      onClick: () => openEditor('new', { name: item.name, baseUrl: item.baseUrl ?? '', providerId: item.id, kind: 'custom' }),
    });
    row.append(info, actions);
    itemList.append(row);
  }
  box.append(head, itemList);
  discoverSlot.append(box);
}

function renderRelays(): void {
  renderDiscoverCard();
  relayList.replaceChildren();
  const relayErrorText = relayError ? describeError(relayError) : '';
  if (relayError) {
    const message = noteElement(relayErrorText, 'error');
    mountButton(message, { label: t('重试'), size: 'sm', variant: 'ghost', onClick: () => { void loadRelays(); } });
    relayList.append(message);
  }
  if (loadingRelays && !relays.length) { relayList.append(el('p', 'bx-detail', t('正在读取接口…'))); return; }
  if (!relays.length && !relayError) relayList.append(empty(t('还没有接口'), t('添加一个接口后，就能在总览里查看它的余额与额度。')));

  for (const relay of relays) {
    const row = el('div', 'bx-relay');
    if (!relay.enabled) row.dataset.disabled = 'true';
    const line = el('div', 'bx-relay-line');
    const info = el('div', 'bx-relay-info');
    const nameLine = el('div', 'bx-relay-name-line');

    const dot = el('span', 'bx-health-dot');
    const liveProvider = providers.find((item) => item.id === `relay:${relay.id}`);
    if (relay.enabled && liveProvider) {
      dot.dataset.tone = liveProvider.ok ? 'ok' : (liveProvider.stale ? 'warning' : 'error');
    }

    nameLine.append(dot, el('h3', 'bx-relay-name', relay.name));
    nameLine.append(el('span', 'bx-relay-kind', relay.kind === 'custom' ? t('自定义') : t('自动')));
    if (relay.providerId) {
      const reusedBadge = el('span', 'bx-relay-kind', t('复用: {id}', { id: relay.providerId }));
      reusedBadge.dataset.reused = 'true';
      nameLine.append(reusedBadge);
    }
    if (!relay.enabled) {
      nameLine.append(el('span', 'bx-relay-kind', t('已暂停')));
    }
    info.append(nameLine, el('p', 'bx-relay-url', relay.baseUrl));

    const actions = el('div', 'bx-relay-actions');
    const switchSlot = el('span', 'bx-relay-switch');
    mountSwitch(switchSlot, {
      label: t('启用查询'),
      checked: relay.enabled,
      disabled: operation !== null,
      onChange: (checked) => { void toggleRelayEnabled(relay, checked); },
    });
    actions.append(switchSlot);
    mountButton(actions, {
      label: t('克隆'),
      size: 'sm',
      variant: 'ghost',
      disabled: operation !== null,
      onClick: () => openEditor('new', {
        name: `${relay.name.slice(0, 52)}${t(' 副本')}`,
        baseUrl: relay.baseUrl,
        providerId: relay.providerId,
        kind: relay.kind,
        custom: relay.custom,
      }),
    });
    mountButton(actions, { label: t('编辑'), size: 'sm', variant: 'ghost', disabled: operation !== null, onClick: () => openEditor(relay) });
    mountButton(actions, { label: t('移除'), size: 'sm', variant: 'ghost', disabled: operation !== null, onClick: () => { pendingDelete = relay.id; renderRelays(); } });
    line.append(info, actions);
    row.append(line);

    if (pendingDelete === relay.id) {
      const confirmMsg = relay.providerId
        ? t('移除“{name}”的接口？供应商页面的原密钥不会被删除。', { name: relay.name })
        : t('移除“{name}”的接口？已保存的密钥会从本地配置中删除。', { name: relay.name });
      const confirmation = noteElement(confirmMsg);
      const buttons = el('div', 'bx-actions');
      mountButton(buttons, { label: t('取消'), size: 'sm', variant: 'ghost', disabled: operation !== null, onClick: () => { pendingDelete = null; renderRelays(); } });
      mountButton(buttons, { label: t('确认移除'), size: 'sm', variant: 'destructive', loading: operation === 'delete', onClick: () => { void deleteRelay(relay); } });
      confirmation.append(buttons);
      row.append(confirmation);
    }
    relayList.append(row);
  }
}

const syncStatusControls = (): void => {
  if (!IS_SECTION || !statusControlsSupported) return;
  const controls: GuestStatusControl[] = [
    { kind: 'button', id: 'refresh', label: t('刷新'), disabled: loading || !initialized },
    { kind: 'button', id: 'manage', label: t('管理'), disabled: !initialized },
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

const syncRailBadge = (): void => {
  if (IS_SECTION) return;
  const alertsCount = providers.filter(
    (provider) => !provider.ok || provider.windows.some((window) => window.usedPercent >= 90),
  ).length;
  const next = alertsCount > 0 ? alertsCount : null;
  if (next === lastRailBadge) return;
  lastRailBadge = next;
  void host.setBadge(next).catch(() => undefined);
};

function render(): void {
  syncRailBadge();
  const errors = providers.filter((provider) => !provider.ok).length;
  count.textContent = IS_SECTION ? '' : `${t('{count} 个服务', { count: providers.length })}${errors ? t(' · {count} 项待重试', { count: errors }) : ''}`;
  time.textContent = loading ? t('正在更新…') : fetchedAt ? t('更新于 {time}', { time: formatTime(fetchedAt, locale, new Date(fetchedAt).toDateString() !== new Date().toDateString()) }) : '';
  time.title = fetchedAt ? new Date(fetchedAt).toLocaleString(locale) : '';
  refresh.update({ loading, disabled: !initialized, label: loading ? t('刷新中') : t('刷新') });
  overview.hidden = !IS_SECTION && activeView !== 'overview';
  management.hidden = IS_SECTION || activeView !== 'relays';
  footer.hidden = IS_SECTION || providers.length === 0;
  list.setAttribute('aria-busy', String(loading));
  alerts.replaceChildren();
  if (navigationMessage) alerts.append(noteElement(navigationMessage));
  if (notice) alerts.append(noteElement(notice.text, notice.tone));
  const loadErrorText = loadError ? describeError(loadError) : '';
  if (loadError) alerts.append(noteElement(`${loadErrorText}${providers.length ? ` ${t('已保留上次显示的数据。')}` : ''}`, 'error'));
  list.replaceChildren();
  if (!initialized || (loading && !providers.length)) {
    const pending = el('div', 'bx-loading');
    mountSpinner(pending, { label: initialized ? t('正在查询余额…') : t('正在连接 OpenChamber…') });
    list.append(pending);
  } else if (!providers.length) {
    const hasUnlinked = unlinkedCustomProviders().length > 0;
    list.append(empty(
      loadError ? t('暂时无法读取余额') : t('还没有可显示的余额'),
      loadError ? t('点击刷新重试，或检查扩展的本地服务权限。') : t('在 OpenCode 配置 Command Code、StepFun，或添加接口。'),
      IS_SECTION ? undefined : () => {
        if (hasUnlinked) {
          activeView = 'relays';
          render();
          void loadRelays();
        } else {
          openEditor('new');
        }
      },
      hasUnlinked ? t('从供应商页面发现（直接复用密钥）') : t('添加接口'),
    ));
  } else {
    list.append(...providers.map(IS_SECTION ? renderStatusProvider : renderProvider));
  }
  syncStatusControls();
  if (!IS_SECTION) {
    const discoverCount = unlinkedCustomProviders().length;
    const badgeCount = relays.length + discoverCount;
    const signature = `${activeView}:${badgeCount}`;
    if (signature !== tabSignature) {
      const hadFocus = tabRoot.contains(document.activeElement);
      tabs?.update({
        activeId: activeView,
        items: [
          { id: 'overview', label: t('总览') },
          { id: 'relays', label: t('接口'), count: badgeCount || undefined },
        ],
      });
      tabSignature = signature;
      tabRoot.querySelector('[role="tablist"]')?.setAttribute('aria-label', t('余额视图'));
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
    editorTitle.textContent = editor === 'new' ? t('添加接口') : t('编辑接口');
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
    if (!Array.isArray(payload.providers)) throw new Error(t('服务未返回有效的余额列表。'));
    providers = payload.providers.map(parseProvider).filter((provider): provider is Provider => provider !== null);
    fetchedAt = asNumber(payload.fetchedAt);
  } catch (error) {
    if (generation === loadGeneration) loadError = error;
  } finally {
    if (generation === loadGeneration) { loading = false; render(); }
  }
}

async function loadRelays(): Promise<void> {
  if (IS_SECTION || loadingRelays) return;
  const generation = ++relayGeneration;
  loadingRelays = true; relayError = null; render();
  try {
    const [relayPayload, providerPayload] = await Promise.all([
      request('GET', '/relays'),
      request('GET', '/opencode-providers').catch(() => ({ providers: [] })),
    ]);
    if (generation === relayGeneration) {
      setRelays(relayPayload);
      if (Array.isArray(providerPayload.providers)) {
        opencodeProviders = providerPayload.providers
          .map(parseOpencodeProvider)
          .filter((item): item is OpencodeProviderCandidate => item !== null);
      }
      syncProviderSelectOptions();
    }
  } catch (error) {
    if (generation === relayGeneration) relayError = error;
  } finally {
    if (generation === relayGeneration) { loadingRelays = false; render(); }
  }
}

const localize = (): void => {
  app.setAttribute('aria-label', t('余额与额度'));
  overview.setAttribute('aria-label', t('余额总览'));
  footer.textContent = t('余额按服务分别显示。点击刷新，获取最新数据。');
  management.setAttribute('aria-label', t('接口管理'));
  managementIntro.textContent = t('管理用于查询余额的接口');
  add.update({ label: t('添加接口') });
  manage?.update({ label: t('管理') });
  cancel.update({ label: t('取消') });
  clearTest();
  editorIntro.textContent = t('填写连接信息，可先测试再保存。');
  nameField.update({ label: t('名称'), placeholder: t('例如：日常使用') });
  kindField.update({
    label: t('接口类型'),
    options: [{ id: 'auto', label: t('自动识别中转站') }, { id: 'custom', label: t('自定义余额接口') }],
  });
  keySourceField.update({
    label: t('凭证来源'),
    options: [
      { id: 'provider', label: t('复用供应商页面密钥（推荐）') },
      { id: 'manual', label: t('单独填写查询密钥') },
    ],
  });
  providerSelectField.update({
    label: t('关联供应商'),
    searchPlaceholder: t('搜索供应商…'),
    placeholder: t('选择在供应商页面已配置的供应商…'),
  });
  providerSourceNote.textContent = t('实时只读复用 OpenChamber 供应商页面的密钥，不在本扩展重复落盘。');
  syncKeySource();
  reveal.update({ label: showKey ? t('隐藏密钥') : t('显示密钥') });
  customHead.textContent = t('自定义接口设置');
  customHint.textContent = t('按供应商文档填写请求地址和 JSON 字段路径；Key 只通过认证请求头发送。');
  methodField.update({ label: t('请求方式'), options: [{ id: 'GET', label: 'GET' }, { id: 'POST', label: 'POST' }] });
  syncMethod();
  authHeaderField.update({ label: t('认证请求头'), helper: t('例如 Authorization 或 x-api-key；留空表示不添加认证。') });
  authSchemeField.update({ label: t('认证方式'), options: [{ id: 'bearer', label: 'Bearer Token' }, { id: 'raw', label: t('原始值') }] });
  headersField.update({ label: t('额外请求头'), helper: t('每行一个 Name: value，不要在这里填写 API Key。') });
  bodyField.update({ label: t('请求体'), helper: t('仅 POST 使用；不要在这里填写 API Key。') });
  mappingSummary.textContent = t('响应字段映射');
  mappingHint.textContent = t('填写 JSON 路径，例如 data.balance 或 data.items[0].remaining。');
  advancedSummary.textContent = t('高级字段');
  balancePathField.update({ label: t('余额字段') });
  unitField.update({ label: t('单位') });
  usedPathField.update({ label: t('已用字段') });
  limitPathField.update({ label: t('总额字段') });
  usedPercentPathField.update({ label: t('已用百分比字段'), helper: t('百分比字段优先于已用/总额字段。') });
  resetAtPathField.update({ label: t('重置时间字段') });
  windowLabelField.update({ label: t('额度窗口名称'), placeholder: t('额度') });
  planPathField.update({ label: t('套餐名称字段') });
  detailPathField.update({ label: t('说明字段') });
  inputs[0].setAttribute('aria-label', t('名称'));
  inputs[2].setAttribute('aria-label', 'API Key');
  syncKind();
  tabSignature = '';
  render();
};

if (!IS_SECTION) {
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || operation !== null) return;
    if (pendingDelete) {
      event.preventDefault();
      pendingDelete = null;
      renderRelays();
    } else if (editor !== null) {
      event.preventDefault();
      closeEditor();
    }
  });
}

host.onReady((context) => {
  applyHostReady(context, document.documentElement);
  const changed = i18n.setLocale(context.locale);
  locale = i18n.locale;
  applyDocumentLanguage(i18n);
  document.title = t('余额');
  statusControlsSupported = IS_SECTION && context.features?.statusControls === true;
  if (IS_SECTION && !statusControlsSupported && !top.isConnected) app.prepend(top);
  if (initialized) {
    if (changed) { notice = null; localize(); }
    else render();
    return;
  }
  initialized = true;
  if (changed) localize();
  void loadBalances();
  if (!IS_SECTION) void loadRelays();
});

document.title = t('余额');
if (IS_SECTION) {
  let lastHeight = -1;
  new ResizeObserver(() => {
    const height = Math.ceil(app.getBoundingClientRect().height);
    if (height > 0 && height !== lastHeight) { lastHeight = height; void host.setHeight(height).catch(() => undefined); }
  }).observe(app);
}
render();
