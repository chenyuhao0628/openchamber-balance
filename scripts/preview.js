const params = new URLSearchParams(location.search);
let dark = params.get('theme') === 'dark';
let section = params.get('surface') === 'status';
let width = Number(params.get('width') || 400);

const frame = document.querySelector('iframe');
const shell = document.querySelector('.shell');
const caption = document.querySelector('.caption');
const audit = document.querySelector('#audit');

const tokens = (isDark) => ({
  background: isDark ? '#20201e' : '#faf9f7',
  elevated: isDark ? '#282724' : '#f2f1ee',
  foreground: isDark ? '#dedbd3' : '#484744',
  muted: isDark ? '#a7a39b' : '#77736c',
  subtle: isDark ? '#817d76' : '#a29e98',
  border: isDark ? '#3c3a35' : '#e3e0db',
  hover: isDark ? '#ffffff0a' : '#00000005',
  selection: isDark ? '#4a3327' : '#f2e6dc',
  focus: '#b07750',
  primary: isDark ? '#d59a6f' : '#a4663b',
  mutedSurface: isDark ? '#272622' : '#f1efec',
  elevatedForeground: isDark ? '#dedbd3' : '#484744',
  active: isDark ? '#ffffff12' : '#00000009',
  selectionForeground: isDark ? '#f2d4bc' : '#724324',
  primaryForeground: '#ffffff',
  primaryText: isDark ? '#e3b18c' : '#965421',
  successText: isDark ? '#a0b48c' : '#4f6a3b',
  warningText: isDark ? '#d6b774' : '#8b6322',
  errorText: isDark ? '#e39b8b' : '#b34635',
  infoText: isDark ? '#9eb4c9' : '#496d88',
  success: '#759862',
  warning: '#c3944d',
  error: '#ce6a55',
  info: '#6995bb',
  font: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
  mono: 'ui-monospace,SFMono-Regular,monospace',
  radius: '7px',
});

const now = Date.now();
const balances = {
  fetchedAt: now,
  providers: [
    {
      id: 'command-code',
      name: 'Command Code',
      ok: true,
      plan: 'Pro',
      balance: { value: 42.5, label: 'Balance', unit: 'USD' },
      detail: '本期已用与剩余积分',
      windows: [
        { key: 'five-hour', label: '5 小时额度', usedPercent: 63, remainingPercent: 37, resetAt: now + 2 * 60 * 60 * 1000, resetAtText: null, detail: '剩余 37%' },
        { key: 'weekly', label: '每周额度', usedPercent: 41, remainingPercent: 59, resetAt: now + 3 * 24 * 60 * 60 * 1000, resetAtText: null, detail: '剩余 59%' },
      ],
      updatedAt: now,
      stale: false,
    },
    {
      id: 'stepfun',
      name: 'StepFun',
      ok: true,
      plan: 'step-plan',
      balance: { value: 128.6, label: 'Balance', unit: 'CNY' },
      detail: '现金 ¥88.60 · 代金券 ¥40.00',
      windows: [],
      updatedAt: now,
      stale: false,
    },
    {
      id: 'relay:demo',
      name: '示例中转站',
      ok: true,
      plan: null,
      balance: { value: 18.25, label: 'Balance', unit: 'USD' },
      detail: '订阅用量 42%',
      windows: [
        { key: 'monthly', label: '本月用量', usedPercent: 42, remainingPercent: 58, resetAt: now + 18 * 24 * 60 * 60 * 1000, resetAtText: null, detail: '订阅额度' },
      ],
      updatedAt: now,
      stale: false,
    },
  ],
};

const relays = {
  relays: [
    { id: 'demo', name: '示例中转站', baseUrl: 'https://relay.example.com', hasKey: true },
  ],
};

const ready = () => frame.contentWindow.postMessage({
  channel: 'openchamber.sdk',
  v: 1,
  type: 'ready',
  payload: {
    theme: { mode: dark ? 'dark' : 'light', tokens: tokens(dark) },
    locale: 'zh-CN',
    directory: '/fixture/project',
    session: null,
    surface: section ? 'status' : 'panel',
    connection: { connected: true, account: 'fixture' },
    settings: {},
    item: null,
    features: { statusControls: true },
  },
}, '*');

const result = (source, id, payload) => source.postMessage({
  channel: 'openchamber.sdk', v: 1, type: 'result', id, ok: true, ...(payload === undefined ? {} : { payload }),
}, '*');

const reject = (source, id, code, error) => source.postMessage({
  channel: 'openchamber.sdk', v: 1, type: 'result', id, ok: false, code, error,
}, '*');

const serviceResponse = (path) => {
  if (path === '/balances') return { status: 200, body: JSON.stringify(balances) };
  if (path === '/relays') return { status: 200, body: JSON.stringify(relays) };
  return { status: 404, body: JSON.stringify({ error: 'Synthetic fixture has no such endpoint.' }) };
};

const show = () => {
  frame.src = section ? '/panel/section.html' : '/panel/index.html';
  caption.textContent = section ? '余额 · 工作状态' : '余额';
  document.body.dataset.surface = section ? 'status' : 'panel';
  document.documentElement.style.setProperty('--width', `${width}px`);
  shell.style.height = section ? '260px' : '820px';
  audit.textContent = section
    ? '合成状态分区：余额摘要与刷新/管理按钮。'
    : '合成面板：Command Code、StepFun 与自定义中转站，均为示例数据。';
};

window.addEventListener('message', (event) => {
  const message = event.data;
  if (event.source !== frame.contentWindow || message?.channel !== 'openchamber.sdk') return;
  if (message.type === 'hello') {
    ready();
    return;
  }
  if (message.type === 'service-request') {
    const path = message.payload?.path;
    result(event.source, message.id, serviceResponse(path));
    return;
  }
  if (message.type === 'service-status') {
    result(event.source, message.id, { status: 'ready' });
    return;
  }
  if (message.type === 'open-surface' || message.type === 'resize' || message.type === 'status-controls' || message.type === 'badge' || message.type === 'storage') {
    result(event.source, message.id);
    return;
  }
  if (message.type === 'request') {
    reject(event.source, message.id, 'HOST_REJECTED', 'Synthetic fixture does not proxy host requests.');
    return;
  }
  result(event.source, message.id);
});

document.querySelector('#theme').onclick = () => {
  dark = !dark;
  document.body.classList.toggle('dark', dark);
  ready();
};

document.querySelector('#narrow').onclick = () => {
  width = width === 280 ? 400 : 280;
  show();
  ready();
};

document.querySelector('#status').onclick = () => {
  section = !section;
  show();
  ready();
};

document.body.classList.toggle('dark', dark);
show();
