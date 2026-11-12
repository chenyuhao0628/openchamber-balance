# openchamber-balance

English | [简体中文](#简体中文)

## English

**Balance** brings AI service balances, quotas and reset times into one side panel and a compact Work Status section. It supports Command Code, StepFun, custom relay endpoints and user-defined balance APIs, keeps the last successful result when a refresh fails, and uses manual refresh instead of background polling.

### Highlights

- Command Code, StepFun and custom relay balances in one overview.
- Used quota, remaining quota and reset time; amounts are right-aligned and currencies stay separate.
- Relay management with a connection test before saving, plus enable/disable toggles, one-click cloning, and per-card retry.
- Direct reuse of custom providers and keys configured on the OpenChamber **Providers** page (`~/.config/opencode/opencode.json(c)` + read-only OpenCode credential store), with an optional standalone billing-key fallback when chat keys and system billing tokens differ.
- Custom balance APIs: fill in the request URL, auth header and JSON field paths (or click paths directly from the test response JSON) to add a provider without changing code.
- OpenChamber 2.7 quota provider: balances also appear in the Usage page, the header, Work Status and the desktop tray.
- Cached results, merged concurrent refreshes and immediate cache invalidation after a relay change.
- Work Status Refresh / Manage republish after a project or session directory change instead of disappearing until the section is folded and reopened.
- Light, dark and narrow layouts that follow the host theme.

### Screenshot

<img src="docs/screenshots/panel.jpg" alt="Balance panel" width="420">

*Synthetic preview with sample providers. No real account, credential or key is used.*

<img src="docs/screenshots/status.jpg" alt="Balance Work Status section" width="420">

*The compact Work Status section.*

### Install

In OpenChamber, open **Settings → Extensions → Add extension** and paste:

```text
https://github.com/chenyuhao0628/openchamber-balance
```

Requires OpenChamber **2.7.0 or newer**; tested on 2.7.0. The extension runs a local service on `127.0.0.1` and checks the host Bearer token. Saved relay keys are never returned by the list or balance APIs.

> The panel and Work Status copy follow the host language (Simplified Chinese or English). The full Chinese documentation is below.

---

## 简体中文

OpenChamber 余额扩展，在**工作状态分区**与右侧「**余额**」面板中汇总 AI 服务的余额、额度和重置时间。

当前版本 **0.4.1**，本说明于 **2026-11-12** 对照源码和本机宿主核对。面板与工作状态文案跟随宿主语言在简体中文和英文间切换。清单要求 OpenChamber `>=2.7.0`，SDK 依赖为 **2.7.0**；这些声明不等于已测试所有宿主版本。

## 使用体验

0.4.1 修复工作状态分区标题行控件在目录变化后偶尔消失、需要折叠重开才能恢复的问题：宿主清空标题行后，扩展会在新的 `ready` 或 `directory` 事件中重新发布「刷新 / 管理」。

0.4.0 支持**直接发现并只读复用「供应商」页面已配置的自定义 Provider 与密钥**：服务只读扫描 `~/.config/opencode/opencode.json(c)` 中的自定义 `provider` 与 OpenCode 凭据库，面板「接口」页默认优先推荐一键关联绑定，无需重复粘贴 API Key（针对对话 `sk-` Key 与账单管理令牌分离的场景仍保留可选独立查询密钥折叠模式）；同时新增接口启停开关、克隆配置、单卡片独立重试，以及自定义接口测试响应的交互式 JSON 路径点选填入。

0.3.0 接入 OpenChamber 2.7.0 的 **quota 角色**：宿主在「用量」、标题栏、工作状态、手机和桌面托盘里绘制一张「余额」卡。内置 Command Code、StepFun 的凭据由宿主按清单授权后传入，`/quota` 不再直接读取 OpenCode 凭据库；完整面板仍保留 SQLite/旧 `auth.json` 回退。多个供应商会合并为单卡窗口。

0.2.12 增加“自定义余额接口”：填写完整请求地址、GET/POST、认证请求头和 JSON 字段路径，即可接入内置列表之外的供应商。内置 Command Code、StepFun 改为服务内供应商注册表，仍只在 OpenCode 凭据存在时显示。

0.2.10 以宿主 **2.5.2** 的源码为基准，继续对齐工作状态分区正文：去掉 status iframe 自绘的浅色底块；抵消宿主 frame 的 4px 外边距后保持与内置「用量」相同的净 4px 缩进；provider 图标改用 foreground；今天重置只显示时间；无数据或失败状态移到 provider 行右侧。完整侧栏面板保持原有总览与中转站管理。

0.2.10 同时核对了 2.5.2 新增的 `contributes.statusSection.source`。该接口由宿主直接绘制正文，但行模型只接受 Remixicon 图标和普通 muted 标签，不能保留品牌 logo、provider 名加粗或标题摘要；改用 source 会让正文离内置用量更远，因此继续保留 `entry` frame。源码对照结论和不可对齐项见[工作状态分区 UI 规范](STATUS-SECTION.md)。

0.2.9 将工作状态分区改为紧凑行式布局，使用 13px 标签/数值和 28px 行高，去掉大号金额、卡片边框与进度条，并让刷新/管理进入分区标题行。

0.2.2 进一步接入项目共享的 `ui/native.css`，统一基础主题、焦点、字号与减少动画规则；图标使用宿主已支持的 `bank-card`，避免未识别图标回退为默认扩展图标。业务接口和服务逻辑保持上一版行为。

- 默认打开「总览」：服务名称、余额、已用额度与重置时间按固定层次展示，金额右对齐；不同币种分别显示。
- 「接口」独立管理连接，点击添加或编辑才出现表单，保存后返回总览。
- 跟随 OpenChamber 的字体、色彩和控件风格，适配浅色、深色和窄侧栏。方向键可切换页签，Enter 可提交表单。
- 工作状态分区正文与内置「用量」使用相同的行式布局、字号、行高和图标尺寸；标题行只能使用宿主提供的文字控件，无法复刻内置用量的“摘要 + 图标刷新”。刷新/管理位于标题行；管理入口复用完整余额侧栏。无项目会话可直接点击右侧「余额」图标；原版宿主 2.4.0 的工作状态「管理」入口仍无响应，该限制暂时保留，原因见[已知限制](#已知限制)。
- 宿主「用量」中的「余额」卡：每个供应商的额度窗口与余额映射为卡片窗口；部分查询失败会显示状态窗口。该卡由宿主在页面打开时每 3 分钟刷新一次，与完整面板的手动刷新缓存相互独立。
- 刷新失败时保留上次成功数据，并明确显示“上次余额”、错误原因和成功时间；未知余额显示 `—`。

工作状态分区的结构、字体、图标、数据顺序和宿主 iframe 限制见[工作状态分区 UI 规范](STATUS-SECTION.md)。

### 与内置「用量」的已知差异

- 标题行：内置用量显示最小窗口摘要和图标刷新；扩展状态控件只有文字按钮/选择器，没有摘要和图标按钮。这是接口限制。
- 失败与无数据：查询失败且已有历史数据时，余额分区保留一条 muted 错误行并标明上次成功时间；内置用量主要依赖 provider 行 tooltip。保留显式提示是为了满足余额扩展的 stale 规则。
- Provider 图标：仅对已支持的 Command Code、StepFun 使用品牌图标；自定义接口没有可映射的宿主 logo，不伪造通用品牌图标。

## 支持的数据

| 供应商 | 当前实现的数据来源 | 展示内容 |
| --- | --- | --- |
| Command Code | `whoami`、`billing/credits`；补充查询 `billing/subscriptions` 与 `usage/summary` | 剩余积分、5 小时/每周额度；数据完整时展示推算的月度使用比例及套餐 |
| StepFun（含 step-plan） | `GET https://api.stepfun.com/v1/accounts` | 总余额、现金和代金券余额 |
| 自动识别中转站 | 依次识别 `/v1/usage`、dashboard billing、`/api/usage/token/` | 接口可提供的余额、订阅或用量信息 |
| 自定义余额接口 | 用户填写的完整 URL、请求方式、认证头和 JSON 字段路径 | 余额、一个额度窗口、套餐和说明 |

当前源码**没有内置 OpenCode Go 查询**。Command Code 的月度总额由本期已用与剩余积分相加得到，不应解读成供应商明确返回的固定套餐额度。接口兼容性取决于实际返回字段或自定义字段路径，详见本页“支持的数据”与“凭据如何使用”。

没有可用凭据的内置供应商不展示；已配置但查询失败的供应商单独显示错误，不阻止其他供应商显示。

## 安装与重载

### 从 GitHub 安装（可自动更新）

在 OpenChamber **设置 → 扩展 → 添加扩展** 中粘贴：

```text
https://github.com/chenyuhao0628/openchamber-balance
```

设置页会按仓库根 `package.json` 的 `version` 检查更新。有新版本时，卡片会显示「更新」。只有 Git URL 安装会自动更新；文件夹和 zip 安装需要手动替换。

### 从文件夹安装（开发）

首次检出源码后，先在本扩展目录执行 `npm ci`、`npm run typecheck` 和 `npm test` 生成面板与服务脚本，再安装：

1. 在 OpenChamber 的 **设置 → 扩展** 中选择从文件夹添加。
2. 选择此 `openchamber-balance` 目录。
3. 按宿主提示授权本地服务；服务以当前用户权限运行。
4. 打开「余额」侧栏，或查看工作状态中的「余额」分区。

本机已验证的界面重载入口为 **OpenChamber 菜单 → 重新加载界面**。它只重载界面，可能保留旧本地服务。服务代码更新后，在 **设置 → 扩展 → 余额** 中先禁用、再启用，然后重新加载界面；本次按此方式加载了 v0.2.0 的界面和服务。`npm run watch` 只负责构建，不自动重启宿主服务。

卸载从宿主扩展设置中移除，配置数据的清理应另行确认。

## 刷新方式

- **没有定时自动刷新。** 服务进程第一次收到余额请求时查询上游，随后缓存结果；切换会话或再次打开面板复用缓存。
- 点击「刷新」会强制查询；同一配置版本下的并发查询会合并，刷新过程中保留已有结果。
- 保存或移除接口时，服务立即使缓存失效，旧的进行中请求也不能重新带回旧配置；该面板随后重新查询余额。
- 服务重启会丢失内存缓存。各面板没有实时广播同步，其他已打开面板需要再次加载或点击刷新。
- 直接编辑磁盘配置后，应重新加载扩展服务；文件没有自动监听，重启还会清除旧账户的历史余额。

## 管理余额接口

在右侧「余额」面板切换到「接口」。工作状态分区只显示摘要，不提供管理表单。

- **自动识别中转站**：填写名称、服务地址和 API Key。服务依次尝试 `/v1/usage`、dashboard billing、`/api/usage/token/`，适合常见中转站。
- **自定义余额接口**：填写完整请求地址、请求方式、认证请求头和 JSON 字段路径。适合 OpenChamber 内置列表之外、返回格式各不相同的供应商。字段路径支持 `data.balance`、`data.items[0].remaining` 这类点号和数组下标写法，不执行用户代码。
- **测试连接**：测试会请求上游并显示解析结果；自定义接口还会显示原始 JSON 响应，便于调整字段路径。测试不会保存配置。
- **编辑**：Key 留空表示继续使用已保存的 Key。如果更换域名，需填写新接口的 Key，避免把原 Key 发往其他站点。
- **移除**：点击「移除」后就地确认，可取消。确认后删除本地配置项并更新余额列表。
- **草稿**：切换页签或主题保留正在输入的内容；保存成功或取消会清空表单中的 Key。关闭或重载界面不保留草稿。

也可手动维护 `~/.config/openchamber/balance/config.json`。自动识别中转站的结构如下；这里的 Key 只是占位符：

```json
{
  "relays": [
    {
      "id": "relay-example",
      "name": "示例中转站",
      "baseUrl": "https://relay.example.com",
      "apiKey": "REPLACE_WITH_YOUR_API_KEY"
    }
  ]
}
```

自定义接口在原结构上增加 `kind` 和 `custom`；`baseUrl` 此时是完整请求地址：

```json
{
  "relays": [
    {
      "id": "custom-example",
      "name": "示例供应商",
      "baseUrl": "https://api.example.com/v1/balance",
      "apiKey": "REPLACE_WITH_YOUR_API_KEY",
      "kind": "custom",
      "custom": {
        "method": "GET",
        "authHeader": "Authorization",
        "authScheme": "bearer",
        "headers": "x-api-version: 2026-01-01",
        "body": "",
        "mapping": {
          "balancePath": "data.balance",
          "unit": "USD",
          "usedPath": "data.used",
          "limitPath": "data.limit",
          "usedPercentPath": "",
          "resetAtPath": "data.reset_at",
          "planPath": "data.plan",
          "detailPath": "data.note",
          "windowLabel": "额度"
        }
      }
    }
  ]
}
```

`authScheme` 为 `bearer` 时发送 `Authorization: Bearer <Key>`，为 `raw` 时直接把 Key 作为请求头值。`usedPercentPath` 优先于 `usedPath` + `limitPath`；两者都不填时只显示余额。额外请求头和请求体不能包含 API Key，服务会拒绝保存并在返回面板前再次脱敏。

服务写入配置时通过临时文件原子替换，文件权限为 `0600`。配置损坏或无法读取时会报错，不会静默覆盖为一个空列表。手工创建文件时需自行确保相同权限。

## 凭据如何使用

Command Code 和 StepFun 优先从 OpenCode SQLite 凭据表只读加载；数据库不可用时尝试旧版 `auth.json`。自定义接口使用上面的本地配置文件。

服务不会通过列表和余额接口回传已保存的 Key，只返回 `hasKey` 等元数据。用户新输入的 Key 会暂时存在于面板表单中，再经宿主代理提交给本地服务；供应商请求由服务执行。不要将这个设计描述为“面板永远接触不到密钥”。

## 已知限制

- 无项目会话中，工作状态「管理」入口可能无响应；请直接点击右侧「余额」图标。
- 项目路径含中文等字符时，宿主文件请求可能失败；可改用无项目会话。

## 开发

在本扩展目录执行：

```sh
npm ci
npm run typecheck
npm test
```

| 源文件 | 职责/产物 |
| --- | --- |
| `src/panel/main.ts` / `style.css` | 双入口的交互与宿主主题样式 |
| `src/panel/data.ts` / `format.ts` | 防御性响应解析、金额与日期格式化 |
| `src/service/main.ts` / `cache.ts` | 本地服务、供应商适配、配置及缓存失效 |
| `src/shared/` | 共享数据类型、地址规范化 |
| `panel/index.html` / `panel/section.html` | 两种面板入口 |
| `scripts/build.mjs` | esbuild 构建与 watch 模式 |
| `package.json` 的 `openchamber` 字段 | panel、statusSection、service 清单 |
| `tests/` | Node 单元测试和隔离 HTTP 集成测试 |

`npm test` 自动先构建，再运行 22 项回归测试；单独构建使用 `npm run build`，持续构建使用 `npm run watch`。`npm run preview` 只在 `127.0.0.1` 服务构建产物，使用合成供应商数据，不读取真实凭据或余额。CSS 编译进两份面板脚本，不依赖外部样式网络请求。

构建以退出码为准：失败时旧产物可能仍存在。完整的修改、验证、版本与重载步骤见本页“开发”与“安装与重载”。

## License

MIT. See [LICENSE](LICENSE).

返回[本仓库首页](README.md)。
