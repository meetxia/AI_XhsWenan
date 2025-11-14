# XHS Content Matrix - 小红书内容矩阵生成器

> 高效生成符合小红书平台调性的营销文案工具

## 🚀 **项目特性**

- ✅ **双主题支持** - 暗黑模式和浅色模式无缝切换
- ✅ **智能文案生成** - 基于产品信息和预设模板快速生成文案
- ✅ **AI润色功能** - 集成大语言模型进行文案优化
- ✅ **现代化UI** - 符合PRD规范的视觉设计
- ✅ **响应式设计** - 适配各种设备尺寸
- ✅ **一键复制** - 支持标题和正文的一键复制

## 🛠 **技术栈**

### 前端 (Vue 3)
- **框架**: Vue.js 3 + Composition API
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **HTTP客户端**: Axios

### 后端 (Node.js)
- **框架**: Express.js
- **模块规范**: ES Module
- **数据存储**: 本地JSON文件
- **AI集成**: 通义千问/OpenAI兼容API

## 🚀 **快速开始**

### 1. 安装依赖

```bash
# 安装前端依赖
cd frontend
npm install

# 安装后端依赖  
cd ../backend
npm install
```

### 2. 启动开发服务器

```bash
# 启动后端服务 (端口: 3002)
cd backend
npm run dev

# 启动前端服务 (端口: 5173) 
cd frontend  
npm run dev
```

### 3. 访问应用

- **前端地址**: http://localhost:5173
- **后端API**: http://localhost:3002

## 🎯 **使用指南**

### 基础功能
1. **选择产品** - 从下拉列表选择要推广的产品
2. **选择角度** - 选择文案风格（故事向、测评向、干货向等）
3. **添加关键词** - 可选择性添加关键词增强文案效果
4. **生成文案** - 点击生成按钮获得文案
5. **复制使用** - 一键复制生成的标题和正文

### AI润色功能
1. **配置API Key** - 在后端设置环境变量 `AI_API_KEY`
2. **启用AI选项** - 勾选"启用AI润色"选择框
3. **生成增强文案** - AI将基于模板生成更优质的文案

## ⚙️ **配置说明**

### AI功能配置 (DeepSeek-v3.1)

项目已预配置阿里云百炼DeepSeek-v3.1模型：

```env
# AI API 配置 - 阿里云百炼 DeepSeek-v3.1
AI_API_KEY=sk-bb800a93f0fa4ebbb306a4c87f2de724
AI_OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
AI_MODEL=deepseek-v3.1

# 服务端口
PORT=3002
```

**配置步骤**:
1. 复制 `backend/.env.example` 为 `backend/.env`
2. 确认API Key配置正确
3. 重启后端服务

### 数据文件说明

- `backend/data/products.json` - 产品数据配置
- `backend/data/templates.json` - 文案模板配置

## 🎨 **主题切换**

应用支持暗黑模式和浅色模式：

- **浅色模式** (默认): 白灰配色 + 沉稳深绿
- **暗黑模式**: 黑灰配色 + 活力绿
- **切换方式**: 点击右上角的太阳/月亮图标

## 📱 **响应式支持**

- **移动端**: 垂直堆叠布局，优化触摸交互
- **桌面端**: 双栏固定布局，提升操作效率

## 🐛 **故障排除**

### 常见问题

1. **生成按钮无响应**
   - 检查后端服务是否启动 (localhost:3002)
   - 确认产品和角度都已选择

2. **AI功能不可用**
   - 检查环境变量 `AI_API_KEY` 是否配置
   - 确认网络连接正常

3. **样式显示异常**
   - 清除浏览器缓存
   - 确保Tailwind CSS正确加载

### 日志查看

- 前端日志: 打开浏览器开发者工具查看Console
- 后端日志: 查看终端输出

## 🔄 **开发命令**

```bash
# 前端开发
cd frontend ; npm run dev
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run preview      # 预览构建结果

# 后端开发
cd backend ; npm run dev
npm run dev          # 启动开发服务器
npm start           # 生产环境启动
```

## 📝 **更新日志**

### v1.1 (当前版本)
- ✅ 修复了Vue前端UI与Demo不匹配的问题
- ✅ 修复了生成按钮无响应的问题
- ✅ 完善了AI功能集成
- ✅ 优化了主题切换系统
- ✅ 改进了响应式设计
- ✅ 增强了错误处理机制

---

**技术支持**: 如遇问题请查看控制台日志或联系开发者
