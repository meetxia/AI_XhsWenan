# **1.0 文档信息**

| 项目名称 | XHS Content Matrix (小红书内容矩阵生成器) |
| :---- | :---- |
| 文档版本 | V 1.1 (新增浅色模式) |
| 创建日期 | 2025年11月13日 |
| 文档作者 | (您的名字) & Gemini |
| 项目干系人 | (您的名字) \- 产品负责人 & 开发者 |

# **2.0 项目概述**

## **2.1 项目目标**

开发一个内部高效工具，旨在将标准化的产品信息（JSON数据）与预设的文案模板（JSON数据）相结合，快速、批量地生成符合小红书平台调性（朋友分享、种草）的营销文案，极大提升内容生产效率。

## **2.2 目标用户**

* **核心用户：** 产品运营者（即您自己）或团队内容助理。  
* **用户特征：** 熟悉产品卖点，了解小红书基本调性，但希望从重复性的“套话”写作中解放出来。

## **2.3 核心价值**

* **效率 (Efficiency):** 一键从“产品ID”生成“完整文案”，耗时从30分钟缩短到10秒。  
* **一致性 (Consistency):** 确保所有文案都紧扣核心卖点，保持品牌调性统一。  
* **创造力 (Creativity):** 通过随机组合不同的模板和角度，为运营者提供“灵感火花”。

# **3.0 视觉与交互设计 (UI/UX)**

本项目的UI/UX设计是核心，旨在传递“科技、高效、专业”的感受。

## **3.1 视觉风格 (双主题)**

* **关键词：** 视觉冲击力、现代感、科技、活力、专业可靠。  
* **主题 1 (默认): 暗黑模式 (Dark Mode)**  
  * **整体感知：** 采用“黑绿”对比，营造沉浸、专注的工具氛围。使用高饱和度的**活力绿**作为行动色，引导用户视线。  
* **主题 2: 浅色模式 (Light Mode)**  
  * **整体感知：** 采用“白/灰 \+ 深绿”搭配，营造一个干净、专业、清爽的操作界面。使用**沉稳的深绿色**作为行动色，体现可靠性。  
* **主题切换：** 应用需提供一个明显的主题切换按钮（如：太阳/月亮图标），允许用户自由切换，并能记忆用户的偏好。

## **3.2 色彩规范 (Color Palette)**

### **3.2.1 暗黑模式 (Dark Mode / 黑绿)**

| 角色 | 颜色 (Tailwind 推荐) | 十六进制 (Hex) | 用途 |
| :---- | :---- | :---- | :---- |
| **主背景 (Base)** | bg-gray-900 / bg-black | \#121212 | 页面整体背景 (暗夜黑) |
| **容器背景 (Container)** | bg-gray-800 | \#1F2937 | 卡片、输入框背景 (深空灰) |
| **主行动色 (Primary)** | bg-green-500 | \#10B981 | 按钮、高亮边框、选中项 (活力绿) |
| **行动色 (Hover)** | bg-green-400 | \#34D399 | 按钮悬停状态 |
| **主文字 (Text Primary)** | text-gray-100 | \#F3F4F6 | 主要文字、标题 (亮灰) |
| **辅助文字 (Text Secondary)** | text-gray-400 | \#9CA3AF | 提示性文字、标签 (中灰) |
| **边框/分割线 (Border)** | border-gray-700 | \#374151 | 容器边框、分割线 |

### **3.2.2 浅色模式 (Light Mode / 白绿)**

| 角色 | 颜色 (Tailwind 推荐) | 十六进制 (Hex) | 用途 |
| :---- | :---- | :---- | :---- |
| **主背景 (Base)** | bg-gray-50 / bg-gray-100 | \#F9FAFB | 页面整体背景 (浅灰) |
| **容器背景 (Container)** | bg-white | \#FFFFFF | 卡片、输入框背景 (纯白) |
| **主行动色 (Primary)** | bg-green-700 | \#047857 | **沉稳深绿**：按钮、选中项 |
| **行动色 (Hover)** | bg-green-600 | \#059669 | 按钮悬停状态 |
| **主文字 (Text Primary)** | text-gray-900 | \#111827 | 主要文字、标题 (深黑) |
| **辅助文字 (Text Secondary)** | text-gray-500 | \#6B7280 | 提示性文字、标签 (中灰) |
| **边框/分割线 (Border)** | border-gray-300 | \#D1D5DB | 容器边框、分割线 |

## **3.3 字体规范 (Typography)**

* **字体族：** font-sans (使用系统默认的无衬线字体，如 "Inter", "PingFang SC", "Helvetica Neue")，保持现代感。  
* **标题 (H1, H2)：** font-bold (粗体), dark:text-gray-100 (暗) / text-gray-900 (亮)。  
* **正文/标签：** font-medium (中等), dark:text-gray-100 / text-gray-900。  
* **生成结果 (代码区)：** font-mono (等宽字体)，dark:text-green-400 (暗) / text-green-700 (亮)，模拟代码高亮。

## **3.4 交互原则 (Interaction Principles)**

* **即时反馈 (Instant Feedback):** 任何点击、悬停都必须有即时的视觉反馈。  
* **状态清晰 (Clear States):** 加载中、禁用、选中状态在两种主题下都必须清晰可辨。  
* **辉光效应 (Glow Effect):** 关键按钮和输入框在 focus (聚焦) 状态时，应有 ring-green-500 (暗) / ring-green-700 (亮) 的外发光/辉光效果。  
* **脉冲动画 (Pulse Animation):** “加载中”状态应使用**绿色脉冲 (Pulse)** 动画。

# **4.0 功能需求 (Functional Requirements)**

## **4.1 F-001: 整体页面布局**

* **描述：** 采用双栏固定布局。  
* **左栏 (35% 宽度):** “控制台” (Control Panel)，用于参数选择。  
* **右栏 (65% 宽度):** “生成区” (Generation Zone)，用于展示结果。  
* **UI:** 左右栏使用 dark:border-gray-700 / border-gray-300 的细分割线隔开。

## **4.2 F-002: 控制台 (Control Panel)**

* **User Story 0:** 作为一个运营者，我希望能在浅色和暗黑模式间自由切换。  
* **需求 (Component: ThemeToggle):**  
  * **位置：** 控制台顶部的右上角。  
  * **类型：** 图标按钮 (Icon Button)。  
  * **交互：** 点击时，在 ☀️ (太阳) 和 🌙 (月亮) 图标间切换，并立即应用新主题。主题偏好应被本地存储 (localStorage)。  
* **User Story 1:** 作为一个运营者，我希望清晰地看到所有可用的产品，以便我快速选择。  
* **需求 (Component: ProductSelector):**  
  * **类型：** 下拉选择框 (\<select\>)。  
  * **数据：** 通过 API (GET /api/products) 异步加载 products.json 中的 id 和 name 列表。  
  * **UI:** 控件背景 dark:bg-gray-800 / bg-white，focus 时有辉光。  
* **User Story 2:** 作为一个运营者，我希望选择一个特定的“文案角度”，以便生成对应风格的文案。  
* **需求 (Component: AngleSelector):**  
  * **类型：** **标签式单选按钮 (Tag Pills)**。  
  * **选项 (硬编码):**$$故事向$$  
    ,$$测评向$$  
    ,$$干货向$$  
    ,$$痛点向$$  
    ,$$展示向$$  
    ...  
  * **UI:** 默认状态 dark:bg-gray-700 / bg-gray-200。  
  * **选中状态 (Active):** dark:bg-green-500 / bg-green-700 (深绿)，文字 text-white。  
* **User Story 3:** 作为一个运营者，我希望在选择好产品和角度后，点击一个醒目的按钮来执行生成。  
* **需求 (Component: GenerateButton):**  
  * **类型：** 主行动按钮 (\<button\>)。  
  * **UI:** **活力绿 (dark:bg-green-500)** / **沉稳深绿 (bg-green-700)**。  
  * **Disabled 状态:** dark:bg-gray-700 / bg-gray-300。  
  * **Loading 状态：** 按钮文字变为 "生成中..." 并显示一个**绿色脉冲动画 (Pulse)**。

## **4.3 F-003: 文案生成逻辑 (Backend: Node.js)**

* **User Story 4:** 作为一个开发者，我需要一个API来处理前端的生成请求。  
* **需求 (API Endpoint: POST /api/generate):**  
  * **Request Body:** { "productId": "p4", "angle": "story" }  
  * **Success Response (200):** { "title": "...", "body": "..." }  
  * **Error Response (400/404):** { "error": "未找到模板" }  
* **核心逻辑：**  
  1. 服务器根据 productId 在 products.json 中找到对应的产品对象。  
  2. 根据 angle 在 templates.json 中找到对应的模板数组。  
  3. **随机 (Random)** 从数组中选取一个模板。  
  4. 执行“占位符替换”逻辑（如 {name}, {point1}, {point2} 等）。  
  5. 返回替换后的 title 和 body。

## **4.4 F-004: 结果展示区 (Generation Zone)**

* **User Story 5:** 作为一个运营者，我希望清晰地看到生成的“标题”和“正文”，并能方便地进行二次编辑。  
* **需求 (Component: ResultDisplay):**  
  * **类型：** 两个多行文本域 (\<textarea\>)。  
  * **UI:**  
    * 背景：dark:bg-gray-800 (深空灰) / bg-white (纯白)。  
    * 文字：font-mono，dark:text-green-400 (亮绿) / text-green-700 (深绿)。  
    * focus 状态：辉光。  
  * **占位符：** 默认显示 // 在左侧选择参数后点击生成... (模拟代码注释)。  
* **User Story 6:** 作为一个运营者，我希望一键复制所有生成的文案（标题+正文）。  
* **需求 (Component: CopyButton):**  
  * **类型：** 次级按钮 (\<button\>)。  
  * **UI:** 放置在结果区右上角。使用“幽灵按钮”样式（dark:border-green-500 \+ dark:text-green-500 / border-green-700 \+ text-green-700）。  
  * **交互：** 点击后，按钮文字变为 "复制成功\!"，持续2秒后复原。

# **5.0 非功能需求**
cd backend ; npm run dev
cd frontend ; npm run dev
| 类别 | 需求 |
| :---- | :---- |
| **技术栈 (Frontend)** | Vue.js 3 (Composition API), Vite, Tailwind CSS, Axios |
| **技术栈 (Backend)** | Node.js (Express.js), ES Module 规范 (import) |
| **数据源 (Database)** | 本地 JSON 文件 (products.json, templates.json) |
| **性能 (Performance)** | 页面加载 (Vite) 必须极快。API 响应时间 (本地JSON) 必须 \< 50ms。 |
| **可维护性 (Data)** | 运营者（您）必须能**不改代码**，仅通过修改 products.json 和 templates.json 文件来更新产品和模板。 |
| **部署 (Deployment)** | 前后端分离部署。前端（Vite构建）使用静态托管，后端 (Node) 运行在服务器上。 |

# **6.0 MVP (V1.0) 范围**

* 完成 F-001 (双栏布局) 和 F-002 (控制台，**包含主题切换**)。  
* 完成 F-003 (后端API) 和 F-004 (结果展示)。  
* 实现 products.json 和 templates.json 的完整数据结构定义。  
* **完整实现 3.0 (视觉与交互设计)**，确保“黑绿” & “白绿” 双主题可正常工作。

# **7.0 未来迭代 (Roadmap)**

* **V1.1 (模板增强):**  
  * 在前端增加“模板编辑器”，允许运营者在网页上直接新增/修改 templates.json。  
* **V1.2 (AI 接入):**  
  * 增加一个“AI 润色”按钮。将生成的“模板文案”作为 Prompt 的一部分，发送给大语言模型 (如 Gemini API 或 OpenAI API)，进行二次创作和润色。  
* **V2.0 (数据持久化):**  
  * 将 products.json 和 templates.json 迁移至数据库 (如 MongoDB 或 Firebase Firestore)，实现真正的动态管理。