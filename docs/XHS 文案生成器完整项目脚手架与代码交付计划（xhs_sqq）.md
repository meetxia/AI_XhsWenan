## 目标
- 在根目录 `D:\AI_momosheji\Ai_XhsSQ\xhs_sqq` 生成一个可运行的前后端分离项目：
  - 前端：Vue 3 (Composition API) + Vite + Tailwind CSS + Axios
  - 后端：Node.js (Express，ES Module)
  - 数据：本地 `products.json` 与 `templates.json`
- 满足 5 种核心文案风格与输出质量标准；支持双版本输出与一键复制；响应时间 < 50ms（本地 JSON，内存缓存）。

## 项目结构
- `xhs_sqq/`
  - `frontend/`
    - `package.json`（vite + vue + tailwind + axios）
    - `vite.config.js`
    - `index.html`
    - `postcss.config.js`
    - `tailwind.config.js`
    - `src/`
      - `main.js`
      - `App.vue`
      - `api/index.js`（Axios 封装）
      - `components/ThemeToggle.vue`
      - `components/ProductSelector.vue`
      - `components/AngleSelector.vue`（含朋友圈推荐）
      - `components/ResultDisplay.vue`（双版本卡片 + 复制）
      - `styles/tailwind.css`
  - `backend/`
    - `package.json`（type: module）
    - `src/server.js`（Express + CORS + 内存缓存）
    - `src/generate.js`（文案组合算法）
    - `data/products.json`
    - `data/templates.json`
    - `scripts/parse-products.js`（从 `.txt` 可选解析生成 JSON）
  - `.gitignore`（node_modules、dist）

## 数据设计
- `products.json`：`{ id, name, summary, audience, sellingPoints[], resources[], stats{updateDate,setCount,levelCount}, tagsDefault[] }`
- `templates.json`：按风格分组：`story|review|dry_goods|education|friends`；每组含 `{ titleTpl, introTpl, pointTpl, summaryTpl, emojis[], tagPool[], rules{titleLen, minEmoji, hashtagRange} }`
- 覆盖 8 个产品的初始数据，映射自 `正在销售的8大产品.txt`。

## 生成算法（后端）
- 加载 `products.json` 与 `templates.json` 入内存并缓存。
- 根据 `style` 随机/加权选择模板，进行占位符替换。
- 标题：长度 12–20 字，超长截断保留关键词。
- 标签：从 `tagsDefault` 与 `tagPool` 选 3–5 个，去重。
- 正文：强制“引入-主体-总结”；均匀植入卖点；≥2个 emoji；测评类附统计点（套数/级别/更新日期）。
- 输出：`{ title, tags[], bodyPlain, bodyXHS }`。

## 后端 API
- `GET /api/health`
- `GET /api/products`（id,name,tagsDefault）
- `GET /api/templates`（可用风格列表）
- `POST /api/generate`：`{ productId, style, keywords[] }` → `CopyOutput`
- CORS 开启；响应 < 50ms（内存命中）。

## 前端实现
- 左栏：主题切换（localStorage），产品下拉，风格 Tag Pills（含“朋友圈推荐”），关键词输入，可生成/重置。
- 右栏：标题与正文展示，双版本卡片（纯文本/XHS），各自一键复制按钮；禁用与加载脉冲动画；即时反馈。
- Axios 指向 `http://localhost:3002`；错误提示友好。

## 初始化与构建
- 前端：`npm install`；`npm run dev`（Vite）；`npm run build`、`npm run preview`。
- 后端：`npm install`；`npm run dev`（Node）；默认端口 3002。
- 并行开发：可在根使用 `npm-run-all` 或分别启动。

## 测试与校验
- 生成 40 篇样本（8产品×5风格）；在前端“示例面板”呈现。
- 校验：标题长度、emoji计数、标签数量、禁夸张用语；响应时间与CORS。

## 交付与部署
- 前端：Vite 构建产物 `frontend/dist` 静态托管。
- 后端：Node 服务部署，挂载 `backend/data/*.json`。
- 运维仅维护 JSON，不改代码即可更新文案与产品数据。

## 开发顺序
1. 初始化目录与前后端 package.json 与配置。
2. 添入 `products.json` 与 `templates.json`（含 5 风格模板）。
3. 实现后端 API 与算法；本地数据缓存。
4. 实现前端界面与 API 接入；双版本输出与复制。
5. 生成样本并校验；交付运行指南与启动脚本。

## 说明
- 代码不写注释；遵循安全与合规用语；不提交任何密钥。
- 优先模板生成；AI 润色可作为后续增强开关。