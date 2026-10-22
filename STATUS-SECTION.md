# 工作状态分区 UI 规范

核对日期：**2026-10-22**。适用对象：`openchamber-balance` 的工作状态分区（`contributes.statusSection`）。视觉基准为本机 OpenChamber **2.5.0** 的内置「用量」分区；宿主升级后应重新核对，不把本文当作永久 API 契约。

## 目标

工作状态分区只显示摘要，不挂载中转站表单、长说明或重复的分区标题。布局、字体、图标和间距优先跟随宿主内置「用量」，完整操作留在右侧「余额」面板。

## 宿主结构基准

| 宿主部分 | 行为 | 扩展应对 |
| --- | --- | --- |
| 分区外壳 | 宿主渲染标题、图标、折叠箭头和分区间距 | 不再在正文重复标题 |
| 标题操作 | `statusControls` 最多 4 个按钮/选择器，文字按钮由宿主渲染 | 只放「刷新」「管理」等短标签 |
| 正文行 | 内置用量使用固定 28px 行高、13px 文本、muted 数值 | 用相同的行式结构，不用卡片 |
| Provider 图标 | 宿主按 provider id/logo 映射；`command-code` 使用内置 logo | 使用随包内嵌的同一来源图标 |
| 分区高度 | 宿主按内容 `setHeight` 调整，清单高度只是初始提示 | 不依赖固定高度，不预留空白 |

参考源码位置（仅用于核对，不是稳定导入路径）：

- 宿主内置「用量」分区：`dist-bundle` / `web-dist` 中的 `b1` 分区、`ur` 行和用量 section 组件。
- 扩展状态控件：`@openchamber/sdk` 的 `setStatusControls` / `onStatusControl`，宿主组件 `nyt`。
- Command Code 图标：宿主资源中的 `command-code.svg`（`provider-logos/command-code.svg` 的内嵌 data URL）。
- StepFun 图标：`https://models.dev/logos/stepfun.svg`，宿主对无本地 logo 的 provider 使用同一来源。

## 标题行

1. 分区标题、图标和折叠箭头由宿主提供，扩展正文不要再放「余额」标题。
2. 支持 `features.statusControls` 时，在 `host.onReady` 后用 `setStatusControls` 注册：
   - `刷新`：`kind: "button"`，加载中禁用。
   - `管理`：`kind: "button"`，未初始化时禁用。
3. `onStatusControl` 中按 `id` 分发；刷新复用面板的强制刷新，管理复用 `openManager` 打开同一个余额侧栏。
4. 控件状态变化先去重再发送，避免宿主频率限制；注册失败或宿主不支持时，才在正文顶部显示旧的工具栏。
5. 不在标题行放「更新于」时间。时间留在完整面板；状态分区保持与内置用量一致的简洁标题。

> 限制：扩展状态控件是宿主提供的文字按钮，不能复刻内置用量的「已用」摘要 + 刷新图标组合。不要为此自绘第二套标题行。

## 正文行

统一使用扁平行，不使用卡片背景、边框、大号金额或进度条。

| 项目 | 规格 |
| --- | --- |
| 行高 | `28px`，`min-height: 28px` |
| 行内边距 | 左右 `4px` |
| 行圆角 | `6px` |
| 行间距 | `0`；provider 之间不再加额外 margin |
| 正文字号 | `13px` |
| 行高 line-height | `1.45` |
| 标签颜色 | `var(--oc-muted)` |
| 数值颜色 | `var(--oc-muted)`，`tabular-nums` |
| 数值字重 | `400`，不额外加粗 |
| Provider 名称 | `13px`、`600`、`var(--oc-fg)` |
| 重置时间 | `11px`、muted，跟在窗口标签后 |
| Provider 图标 | `14px`，muted，与名称间距 `8px` |
| 分区之间 | 交给宿主 `mt-5`（20px），正文不自加外边距 |

行内结构：

```text
[provider 图标] Provider 名称                  [可选：悬停显示 plan]
窗口标签  重置时间                                百分比
窗口标签  重置时间                                百分比
额度余额                                        金额
```

## 数据顺序与取舍

1. 先渲染使用窗口，再渲染「额度余额」；与内置用量的顺序一致。
2. Command Code 已显示 5 小时/每周/每月窗口时，不再显示「额度余额」；总额与月度额度重复。
3. StepFun 没有窗口时保留「额度余额」。
4. Provider 名称后的 plan（如 `GOAT`、`预付费`）不占状态分区文本，放在 provider 行的 `title` 提示中；完整面板仍显示 plan。
5. 查询失败时用 muted 错误行，不用整块彩色告警卡；错误原因可截断，完整信息留在完整面板。
6. Provider 没有余额、窗口或错误时，显示一行 muted「已连接，但接口暂未提供余额或额度」。

## 图标

- Command Code：使用宿主自带的 `command-code.svg`，内嵌到 `src/panel/provider-icons.ts`，不依赖网络。
- StepFun：使用 models.dev 的 `stepfun.svg`，与宿主对无本地 logo 的 provider 的处理一致。
- 图标继承 `currentColor`，统一 muted、14px；未知 provider 不强行放通用图标。
- 新增供应商时先确认宿主是否有同名 logo；没有就留空，不要用与品牌无关的通用图标冒充。

## 高度与窄栏

- 清单中的 `statusSection.height` 是初始提示，不保证最终高度；正文变化后继续用 `setHeight` 让宿主调整。
- 280–320px 窄栏下保持单行省略：provider 名称、窗口标签可截断，数值不换行。
- 行内不要嵌套滚动区；长错误信息由外层分区滚动或截断。

## 宿主 iframe 限制

余额状态分区运行在沙箱 iframe 中，内置「用量」运行在宿主主文档。两者的差异要记录，不要用硬编码掩盖：

1. 宿主传入字体 token，但不提供读取父文档最终计算字体的接口；主题字体在 iframe 中可能落到不同 fallback，字形/字重可能有细微差异。扩展只使用宿主主题变量，不硬编码另一套字体。
2. 状态控件由宿主渲染，按钮字号、字重和布局由宿主决定；扩展不能改成内置用量的摘要 + 图标组合。
3. 扩展不能修改宿主标题行结构，也不能把管理表单放进状态分区。
4. 以上限制不代表可以跳过行高、字号、图标、顺序和间距的对齐；这些仍应按本文执行。

## 实现位置

| 文件 | 职责 |
| --- | --- |
| `src/panel/main.ts` | `IS_SECTION` 分支、`setStatusControls`、`renderStatusProvider`、窗口/余额行顺序 |
| `src/panel/style.css` | `html[data-oc-surface="status"]` 下的行式布局和窄栏覆盖 |
| `src/panel/provider-icons.ts` | Command Code / StepFun 的内嵌 SVG |
| `package.json` | `contributes.statusSection` 的标题、初始高度和入口 |
| `panel/section.html` / `panel/section.js` | 构建后的状态分区入口与脚本；不手改产物 |

## 验收清单

- [ ] 宿主支持状态控件时，标题行出现刷新/管理，正文没有第二套标题或工具栏。
- [ ] 宿主不支持时，退回正文工具栏，仍能刷新和管理。
- [ ] 行高 28px、正文 13px、provider 名称 600、数值 muted/tabular，无卡片/进度条/大号金额。
- [ ] Command Code 有窗口时不显示「额度余额」；StepFun 仍显示余额。
- [ ] Command Code 与 StepFun 使用对应官方图标；未知 provider 不显示伪造图标。
- [ ] 窗口行在余额行之前；重置时间 11px 且不换行。
- [ ] provider 之间没有额外 margin，分区间距由宿主控制。
- [ ] 浅色/深色主题、280px 窄栏、加载中、查询失败和长名称下均可读。
- [ ] `npm run typecheck`、`npm test` 通过；重载后核对真实宿主，不只依赖预览。
