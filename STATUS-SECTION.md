# 工作状态分区 UI 规范

核对日期：**2026-10-26**。适用对象：`openchamber-balance` 的工作状态分区（`contributes.statusSection`）。源码基准为本机 OpenChamber **2.5.2** 与 `@openchamber/sdk` **2.5.2**；宿主升级后应重新核对，不把本文当作永久 API 契约。

## 结论

余额分区可以对齐内置「用量」的**正文行**，但无法只靠扩展接口对齐**标题行**：

- 内置用量标题行由宿主渲染，包含“最小窗口标签 + 百分比”摘要和一个图标刷新按钮。
- 扩展的 `setStatusControls` 只支持文字按钮和选择器，没有摘要字段，也没有图标按钮。宿主组件会把扩展控件渲染成带内边距的文字 ghost 按钮。
- 2.5.2 新增的 `contributes.statusSection.source` 由宿主直接绘制正文，但它的行类型没有 provider 品牌 logo、provider 名加粗或标题摘要，正文反而比当前 iframe 更远。因此继续保留 `entry`，不声明 `source`。

正文对齐以宿主内置用量实际使用的行组件为准：28px 固定行高、13px 文本、muted 数值、6px 圆角、8px 行内间距；标题行差异作为已知接口限制记录。

## 宿主结构基准

| 宿主部分 | 2.5.2 行为 | 扩展应对 |
| --- | --- | --- |
| 分区外壳 | 宿主渲染标题、图标、折叠箭头和分区间距 | 不在正文重复标题 |
| 标题操作 | `statusControls` 最多 4 个按钮/选择器，文字按钮由宿主渲染；不支持摘要或图标按钮 | 只放「刷新」「管理」短标签 |
| 正文行 | 内置用量使用 `qs` 行：28px 高、13px 文本、muted 文本、6px 圆角、4px 内边距 | 用相同的行式结构，不用卡片 |
| Provider 图标 | 内置用量用 provider logo；图片为 14px，亮色主题为原色/黑色，深色主题通过 `dark:invert` 变白 | 使用随包内嵌的同一来源图标，颜色用 foreground |
| 分区高度 | 宿主按内容 `setHeight` 调整；frame 上限 320px | 不依赖固定高度，不预留空白 |
| status frame | 宿主给 iframe 外层加 `mx-1`（4px 左右外边距）和 `rounded-md`，iframe 本身 `bg-transparent` | 正文不再加底色；行内边距设为 0，净缩进与 `qs` 的 `px-1` 一致 |

参考源码位置（minified 名称只用于本次 2.5.2 核对，不是稳定导入路径）：

- 内置「用量」分区：`web-dist` 中的 `E9t`；行组件 `qs`；标题外壳 `Xd`。
- 扩展状态控件：`@openchamber/sdk` 的 `setStatusControls` / `onStatusControl`；宿主渲染组件 `e8t`。
- 宿主 frame 外壳：`j8t`；iframe 状态背景由宿主设为 `bg-transparent`。
- `statusSection.source`：SDK 2.5.2 的 `StatusSectionSource`、`GuestStatusView`、`guestStatusViewSchema`；宿主绘制组件 `k8t` / `w8t`。
- Command Code 图标：宿主资源中的 `command-code.svg`（`provider-logos/command-code.svg` 的内嵌 data URL）。
- StepFun 图标：`https://models.dev/logos/stepfun.svg`，宿主对无本地 logo 的 provider 使用同一来源。

## 标题行

1. 分区标题、图标和折叠箭头由宿主提供，扩展正文不要再放「余额」标题。
2. 支持 `features.statusControls` 时，在 `host.onReady` 后用 `setStatusControls` 注册：
   - `刷新`：`kind: "button"`，加载中禁用。
   - `管理`：`kind: "button"`，未初始化时禁用。
3. `onStatusControl` 中按 `id` 分发；刷新复用面板的强制刷新，管理复用 `openManager` 打开同一个余额侧栏。
4. 控件状态变化先去重再发送，避免宿主频率限制；注册失败或宿主不支持时，才在正文顶部显示旧的工具栏。
5. 不在标题行放「更新于」时间。时间留在完整面板；状态分区保持简洁标题。

> 限制：扩展状态控件是宿主提供的文字按钮，不能复刻内置用量的「摘要 + 刷新图标」组合。不要为此自绘第二套标题行，也不要为了标题行改用 `source`。

## 正文行

统一使用扁平行，不使用卡片背景、边框、大号金额或进度条。

| 项目 | 规格（对应宿主 `qs`） |
| --- | --- |
| 行高 | `28px`，`min-height: 28px` |
| 行内边距 | `0`；宿主 status frame 外层 `mx-1` 提供 4px，净缩进与 `qs` 的 `px-1` 一致 |
| 行圆角 | `6px`（`rounded-md`） |
| 行间距 | `0`；provider 之间不再加额外 margin |
| 正文字号 | `13px`（`text-[0.8125rem]`） |
| 行高 line-height | 继承 `.bx` 的 `1.5`；不再单独写 `1.45` |
| 标签颜色 | `var(--oc-muted)` |
| 数值颜色 | `var(--oc-muted)`，`tabular-nums` |
| 数值字重 | `400`，不额外加粗 |
| Provider 名称 | `13px`、`600`、`var(--oc-fg)` |
| 重置时间 | `11px`、muted，跟在窗口标签后；今天只显示时间，其他日期显示短月日、星期和时间 |
| Provider 图标 | `14px`、`var(--oc-fg)`，与名称间距 `8px`；不要用 muted |
| 分区之间 | 交给宿主 `mt-5`（20px），正文不自加外边距 |
| 背景 | 透明；不要用 `surface-muted` 或 `surface-background` 自绘底块 |

行内结构：

```text
[provider 图标] Provider 名称                         [可选：状态]
窗口标签  重置时间                                百分比
窗口标签  重置时间                                百分比
额度余额                                        金额
```

## 数据顺序与取舍

1. 先渲染使用窗口，再渲染「额度余额」；与内置用量的顺序一致。
2. Command Code 已显示 5 小时/每周/每月窗口时，不再显示「额度余额」；总额与月度额度重复。
3. StepFun 没有窗口时保留「额度余额」。
4. Provider 名称后的 plan（如 `GOAT`、`预付费`）不占状态分区文本，放在 provider 行的 `title` 提示中；完整面板仍显示 plan。
5. 查询失败时：
   - 没有余额/窗口：错误文字放在 provider 行右侧，与内置用量把 provider status 放在名称后一致；`role="alert"`，完整原因放 `title`。
   - 已有历史数据：保留一条 muted 错误行，并标明“以上为上次成功结果”；这是余额扩展的显式 stale 提示，内置用量只用 tooltip，属于有意保留的差异。
6. Provider 正常但没有余额、窗口时：把「已连接，但接口暂未提供余额或额度」放在 provider 行右侧，不再单独占一行；这是对内置用量 provider status 的近似。
7. Provider 没有余额、窗口或错误时，不伪造数值，也不显示 0。

## 图标

- Command Code：使用宿主自带的 `command-code.svg`，内嵌到 `src/panel/provider-icons.ts`，不依赖网络。
- StepFun：使用 models.dev 的 `stepfun.svg`，与宿主对无本地 logo 的 provider 的处理一致。
- 图标使用 `currentColor`，颜色为 `var(--oc-fg)`；与宿主 logo 图片在亮色主题为黑色、深色主题反转为白色一致。不要再用 muted。
- 未知 provider 不强行放通用图标；新增供应商时先确认宿主是否有同名 logo。

## 高度与窄栏

- 清单中的 `statusSection.height` 是初始提示，不保证最终高度；正文变化后继续用 `setHeight` 让宿主调整。
- 280–320px 窄栏下保持单行省略：provider 名称、窗口标签、状态文字可截断，数值不换行。
- 行内不要嵌套滚动区；长错误信息由外层分区滚动或截断。

## 2.5.2 `statusSection.source` 核对

2.5.2 新增 `statusSection.source: { path, interval? }`，由宿主定期 `GET` 扩展服务并绘制 `GuestStatusView`，不需要 iframe。它解决了 frame 背景、内边距和字体 fallback，但不适合本扩展：

1. 行内容是 `line` / `note`，`line.icon` 只接受 Remixicon 名称；不能放 Command Code/StepFun 的品牌 SVG。
2. 行标签统一为 muted 13px，不能把 provider 名称渲染成 `font-semibold` + foreground。
3. 标题行仍由宿主 `Xd` + 文字控件绘制，`source` 也不能提供内置用量的摘要或图标刷新。
4. `source` 只能声明一个 section；声明后支持它的宿主会优先使用 source，旧宿主才回退 `entry`，无法在同一宿主上按需选择。
5. source 的轮询是宿主行为；本扩展目前没有定时上游刷新，虽然可以在服务端只返回缓存，但仍会引入一条额外的宿主轮询路径。

因此保留 `entry` + `setStatusControls`。将来若宿主给 `GuestStatusView` 增加品牌图标/富文本/摘要，或给状态控件增加图标与摘要字段，再重新评估。

## 2.7.0 quota 角色

2.7.0 新增的 `provides: ["quota"]` 是独立的宿主用量卡，不改变本文关于 `statusSection.source` 的结论。余额扩展继续保留 `entry` 状态分区，同时声明 quota 角色：

- 「用量」卡由宿主绘制，一个扩展只有一张，多个供应商合并为带供应商名的窗口；
- quota 路径只使用宿主随 `usage.read` 传入的、清单已授权的 provider 凭据；
- 卡片的 3 分钟刷新是宿主行为，与状态分区的 `setStatusControls` 手动刷新、完整面板的显式缓存相互独立。

## 实现位置

| 文件 | 职责 |
| --- | --- |
| `src/panel/main.ts` | `IS_SECTION` 分支、`setStatusControls`、`renderStatusProvider`、窗口/余额行顺序、provider 行内状态 |
| `src/panel/style.css` | `html[data-oc-surface="status"]` 下的透明背景、净 4px 缩进、行式布局和窄栏覆盖 |
| `src/panel/format.ts` | 状态分区的重置时间格式（今天只显示时间） |
| `src/panel/provider-icons.ts` | Command Code / StepFun 的内嵌 SVG |
| `src/service/quota.ts` | quota 请求校验与单卡窗口映射；不参与状态分区绘制 |
| `package.json` | `contributes.statusSection`、`service.provides: ["quota"]` 与 `contributes.quota` |
| `panel/section.html` / `panel/section.js` | 构建后的状态分区入口与脚本；不手改产物 |

## 验收清单

- [ ] 宿主支持状态控件时，标题行出现刷新/管理，正文没有第二套标题或工具栏。
- [ ] 宿主不支持时，退回正文工具栏，仍能刷新和管理。
- [ ] 行高 28px、正文 13px、provider 名称 600/foreground、数值 muted/tabular，无卡片/进度条/大号金额。
- [ ] status iframe 背景透明，没有自绘的浅色底块；行内边距为 0，净缩进与宿主 `qs` 的 4px 一致。
- [ ] Command Code 与 StepFun 使用对应官方图标，颜色为 foreground；未知 provider 不显示伪造图标。
- [ ] 窗口行在余额行之前；重置时间 11px；今天只显示时间，其他日期显示短月日/星期/时间。
- [ ] provider 之间没有额外 margin，分区间距由宿主控制。
- [ ] 浅色/深色主题、280px 窄栏、加载中、查询失败和长名称下均可读。
- [ ] `npm run typecheck`、`npm test` 通过；重载后核对真实宿主，不只依赖预览。
