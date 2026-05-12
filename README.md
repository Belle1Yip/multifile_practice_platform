# 编程学习在线评测平台

一个功能完整的编程学习在线评测平台，支持多种编程竞赛模式，内置 AI 测试点生成，支持组卷和题库导入。

## ✨ 功能特性

### 🎯 核心功能
- **多模式判题**：支持 LeetCode 模式、多文件模式、ACM 模式
- **AI 测试点生成**：内置 AI 大模型，自动根据题目描述生成测试用例
- **灵活判题**：支持 ACM 模式（全对满分）和 OI 模式（按测试点得分）
- **题库管理**：支持创建、编辑、删除题目，支持标签分类
- **组卷系统**：自定义试卷，设置考试时间和判题模式
- **题库导入**：支持从 LeetCode、Codeforces 导入，支持 PDF 文档解析

### 🖥️ 代码编辑
- 基于 Monaco Editor 的在线代码编辑器
- 支持 6 种编程语言：Python、JavaScript、TypeScript、C++、Java、C
- 语法高亮和代码补全

### 🎨 界面设计
- 美观简约的现代化界面
- 响应式设计，支持多种设备
- 清晰的状态指示和反馈

## 🛠️ 技术栈

### 前端
- **React 18** - 前端框架
- **TypeScript** - 类型安全
- **TailwindCSS 3** - 样式框架
- **Monaco Editor** - 代码编辑器
- **React Router 6** - 路由管理
- **Axios** - HTTP 客户端
- **Lucide React** - 图标库

### 后端
- **Node.js 20** - 运行环境
- **Express 4** - Web 框架
- **TypeScript** - 类型安全
- **MongoDB 7** - 数据库
- **Mongoose 7** - ORM
- **OpenAI API** - AI 测试点生成
- **pdf-parse** - PDF 解析

## 🚀 快速开始

### 环境要求
- Node.js 20.x 或更高版本
- MongoDB 7.x 或更高版本（或使用 Docker）
- 现代浏览器（Chrome、Firefox、Safari、Edge）

### 启动方式

#### 方式一：使用 Docker（推荐）

```bash
# 启动 MongoDB
docker run -d -p 27017:27017 --name mongo mongo:7

# 启动后端服务
cd backend
npm install
npm run dev

# 启动前端服务（新终端）
cd frontend
npm install
npm run dev
```

#### 方式二：手动安装

1. **安装 MongoDB**
   - 下载地址：https://www.mongodb.com/try/download/community
   - 运行：`mongod --dbpath "C:\data\db" --port 27017`

2. **启动后端**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **启动前端**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### 访问平台

启动后访问：http://localhost:5173

### 环境变量配置

在 `backend/.env` 文件中配置：

```env
PORT=3001
MONGO_URI=mongodb://localhost:27017/oj-platform
JWT_SECRET=your-secret-key
OPENAI_API_KEY=your-openai-api-key
NODE_ENV=development
```

## 📖 使用说明

### 用户注册与登录
1. 点击右上角「注册」按钮
2. 填写用户名、邮箱、密码
3. 登录后即可使用平台

### 题目提交
1. 进入题库页面，选择题目
2. 在代码编辑器中编写代码
3. 选择判题模式（ACM/OI）
4. 点击提交按钮，查看判题结果

### 创建题目（管理员）
1. 登录管理员账户
2. 在题库页面点击「创建题目」
3. 填写题目信息、测试用例、模板代码
4. 可使用 AI 自动生成测试用例

### 组卷功能
1. 点击「组卷」菜单
2. 创建试卷，设置时间和判题模式
3. 添加题目并设置分值

### 题库导入
1. 支持从 LeetCode/Codeforces 链接导入
2. 支持 PDF 文档批量导入

## 📁 项目结构

```
multifile_practice_platform/
├── backend/                    # 后端服务
│   ├── src/
│   │   ├── config/             # 配置文件
│   │   ├── middleware/         # 中间件
│   │   ├── models/             # 数据模型
│   │   ├── routes/             # API 路由
│   │   ├── services/           # 业务服务
│   │   └── server.ts           # 服务入口
│   ├── .env                    # 环境变量
│   ├── package.json
│   └── tsconfig.json
├── frontend/                   # 前端应用
│   ├── src/
│   │   ├── components/         # UI 组件
│   │   ├── context/            # 状态管理
│   │   ├── pages/              # 页面组件
│   │   ├── services/           # API 服务
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── docs/                       # 文档
│   ├── ARCHITECTURE.md         # 架构设计文档
│   └── USER_MANUAL.md          # 使用说明文档
└── README.md
```

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/your-feature`
3. 提交更改：`git commit -m "Add your feature"`
4. 推送到分支：`git push origin feature/your-feature`
5. 提交 Pull Request

### 代码规范
- 使用 TypeScript
- 遵循 ESLint 规则
- 添加必要的注释
- 保持代码简洁

## 📄 许可证

本项目采用自定义许可证，禁止商业用途。

**许可证说明**：
- ✅ 允许个人学习、研究和非商业使用
- ✅ 允许修改和分发代码（仅限非商业用途）
- ❌ 禁止用于商业目的
- ❌ 禁止在商业产品中使用

使用前请确保符合上述条款。

## 📞 联系方式

如有问题或建议，请通过 GitHub Issues 提交问题到本仓库。

---

**版本**：1.0.0  
**更新日期**：2026年5月  
**状态**：开发中