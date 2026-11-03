# PolyFlow 开发交接

本文基于 2026-11-02 工作目录中的代码整理，供接手的开发 agent 快速建立上下文。开始修改前请先阅读根目录 `README.md`、`CONTRIBUTING.md`、`SECURITY.md` 和 `docs/ARCHITECTURE.md`；其中目标架构不等同于现有实现。

## 产品与现状

PolyFlow 是中文优先的学习工作台原型，聚合 Canvas 作业与资料、邮件和日程，并支持 PWA。前端为原生 HTML/CSS/JavaScript，后端为 Node 内置 HTTP 服务，没有前端构建步骤和 npm 运行时依赖。

- Canvas：支持本机 Playwright 浏览器会话桥接，或用户提供 Personal Access Token；服务端返回课程、作业、提交状态和模块资料。无连接时显示演示数据。
- Outlook：两种本机只读连接——`bridge/outlook_bridge.py` 浏览器登录 Outlook 网页版（调用未公开的 `/owa/service.svc`，属实验性），或 macOS 上 `bridge/mac_mail.js` 读取“邮件”App / 旧版 Outlook 与 EventKit 日历。未连接时显示演示数据。尚无 Microsoft Graph/OAuth 多用户方案。
- 前端：`web/` 下的 Vue 3 原生 ES 模块界面（无构建步骤，Vue 运行时在 `web/vendor/`）；`POLYFLOW_UI=legacy` 可切回根目录旧版单文件界面。
- DeepSeek：服务端代理翻译、摘要和连通性测试；支持 mock 模式。密钥不应发往浏览器。
- 本地完成标记、资料收藏、偏好和个人资料保存在浏览器 localStorage；本地完成标记不等于 Canvas 提交状态，也不会替用户提交作业。
- 此版本适合可信环境下自托管，尚无正式用户认证、数据库或完整租户隔离，不应直接公开部署。代码以 MIT 许可证开源，PolyU 校徽不在授权范围内（见 `LICENSE`）。

## 文件和数据流

| 位置 | 职责 |
| --- | --- |
| `index.html`、`styles.css` | 页面外壳、响应式布局 |
| `app.js` | 演示数据、状态、hash 路由、页面渲染、交互和接口调用；重点查看 `state`、`renderPage`、`syncCanvas` |
| `server.mjs` | 静态文件、HTTP API、DeepSeek 代理、Canvas 连接及归一化、内存缓存和限流 |
| `bridge/canvas_bridge.py` | 本机 Playwright 登录与 Canvas 同源数据读取；依赖 `bridge/requirements.txt` |
| `sw.js`、`manifest.webmanifest` | PWA 离线外壳；修改静态资源时检查缓存版本和引用是否同步更新 |
| `.env.example`、`Dockerfile`、`compose.yaml` | 配置模板及容器运行 |
| `docs/ARCHITECTURE.md` | 当前边界及未来多用户方案 |

浏览器调用同源 Node API；Token 模式由 Node 请求 Canvas，桥接模式由 Python 启动的浏览器在 Canvas 同源上下文读取数据。连接后前端把同步结果替换进内存数组；服务端缓存 5 分钟，前端启动后及每 5 分钟尝试同步，手动刷新可绕过缓存。邮件的 AI 请求通过 Node 到 DeepSeek。

## 启动与验证

需要 Node.js 20+：`npm start`，访问 `http://127.0.0.1:4173`；`npm run dev` 启用 Node watch，`npm run check` 仅检查两个 JS 文件的语法，不是功能测试。`DEEPSEEK_MOCK=1 npm start` 可避免调用真实 AI。服务自动读取 `.env.local`，已有进程环境变量优先。Docker 使用 `cp .env.example .env` 和 `docker compose up --build`，端口默认只映射本机。

本机桥接另需创建 Python 虚拟环境并安装 `bridge/requirements.txt`，参考 README；需可用的 Chrome 或 Playwright Chromium，以及用户亲自完成官方登录和 MFA。不要用真实账号作为自动化测试夹具。

本次交接检查：Python 桥接文件通过 `ast.parse` 语法检查；当前执行环境没有找到 `npm` 或常见位置的 Node，未能运行 `npm run check`、启动服务或验证真实集成。仓库中未见自动化测试脚本；上述实际集成与浏览器体验仍需接手者验证。

## API 速查

| 方法与路径 | 用途 |
| --- | --- |
| `GET /healthz` | 健康检查 |
| `GET /api/integrations/status` | 应用及 Canvas、DeepSeek、Outlook 状态 |
| `POST /api/integrations/canvas/connect` | 使用 `baseUrl`、`token` 连接 Canvas |
| `POST /api/integrations/canvas/bridge/login` | 启动本机浏览器登录 |
| `DELETE /api/integrations/canvas` | 删除当前会话令牌及本机桥接连接 |
| `GET /api/canvas/sync?refresh=1` | 获取 Canvas 数据；`refresh=1` 强制刷新 |
| `POST /api/integrations/outlook/bridge/login` | 打开浏览器登录 Outlook 网页版 |
| `POST /api/integrations/outlook/local/connect` | 读取本机邮件 App，`{"app":"mail"|"outlook"}`，仅 macOS |
| `DELETE /api/integrations/outlook` | 断开 Outlook 并删除本机浏览器会话 |
| `GET /api/outlook/sync?refresh=1` | 获取邮件与日程（统一格式），缓存 5 分钟 |
| `POST /api/ai/translate`、`/summarize`、`/test` | AI 翻译、摘要、连通性测试 |

具体请求和响应字段以 `server.mjs` 的对应处理函数及 `app.js` 调用为准。

## 接手优先事项

1. 先与产品负责人明确下一阶段目标：继续本机个人工具，还是做可公开访问的多用户服务；不要默认两者已有相同安全能力。
2. 配置 Node 后执行语法检查、启动与浏览器冒烟测试，覆盖桌面和约 390px 手机宽度、演示模式、mock AI、Canvas 连接/断开和同步失败。真实服务测试应由授权用户操作。
3. 完善 Canvas 正确性：两个连接路径都要检查分页和数据上限；当前 Token 路径请求 `per_page=100`，未处理分页，返回的作业最多 160 条、资料最多 80 条。单课程作业/模块请求失败会被吞掉并返回空集合，可能误以为数据完整；应显式呈现部分失败，提交状态未知不能当作未提交。
4. 如需真实 Outlook，设计 Microsoft Entra/Graph 只读 OAuth、撤销、数据最小化及测试，而不是直接把演示数据标为已连接。
5. 如需公开部署，先按 `docs/ARCHITECTURE.md` 和 `SECURITY.md` 实现认证、身份隔离、CSRF 防护、持久化限流、会话撤销、凭据生命周期和运维监控，并进行安全审查。当前本机桥接使用共享浏览器 profile，不是多用户连接方案。
6. 加入有意义的自动化测试，优先覆盖 Canvas 归一化、分页与部分失败、凭据隔离、AI mock、API 错误和关键前端流程；避免使用真实私人数据。

## 交接与数据安全

当前目录不是 Git 仓库，无法从此处判断提交历史、分支或未提交变更；接手前应确定正式源码位置及版本管理方式。`.env.local`、`.env`、`.data/` 和 `.venv/` 已列入 `.gitignore`；其中 `.data` 可能包含加密凭据、加密主密钥和 Canvas 浏览器会话，均按敏感信息处理，不要打包给其他 agent、提交或贴入聊天。若迁移运行环境，先确认是否真的需要迁移这些数据，并以安全方式单独处理；丢失加密密钥可能导致已保存凭据无法解密。

保留项目的安全约束：不收集学校密码、不绕过 MFA/CAPTCHA；外部邮件和课程内容视为不可信输入。正式接入和数据发送第三方模型前，确认学校政策及用户授权。
