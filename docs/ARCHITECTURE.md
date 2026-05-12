# 编程学习在线评测平台 - 系统架构设计文档

## 1. 项目概述

本项目是一个综合性的编程学习在线评测平台，支持多种编程竞赛模式（LeetCode模式、多文件模式、ACM模式），具备AI辅助测试点生成、组卷、题库导入等核心功能。

## 2. 功能需求分析

### 2.1 核心功能模块

| 功能模块 | 描述 | 优先级 |
|---------|------|-------|
| 题目管理 | 创建、编辑、删除题目，支持多种题型 | 高 |
| 代码提交 | 支持多语言代码提交和在线编辑 | 高 |
| 判题引擎 | ACM/OI两种判题模式 | 高 |
| AI测试点生成 | 根据题目描述自动生成测试用例 | 高 |
| 组卷系统 | 支持自定义组卷和试卷管理 | 高 |
| 题库导入 | 支持从主流OJ平台导入题目 | 高 |
| 文件上传 | 支持PDF等文档批量导入题目 | 高 |

### 2.2 判题模式说明

- **ACM模式**：答案完全正确得满分，错误得0分
- **OI模式**：按测试点得分累加，部分正确部分得分

### 2.3 题目类型支持

| 类型 | 描述 |
|-----|------|
| LeetCode模式 | 单文件输入输出，函数式编程 |
| 多文件模式 | 支持多个源文件提交 |
| ACM模式 | 标准输入输出模式 |

## 3. 技术选型

### 3.1 前端技术栈

| 技术 | 版本 | 用途 |
|-----|------|-----|
| React | 18.x | 前端框架 |
| TypeScript | 5.x | 类型安全 |
| TailwindCSS | 3.x | 样式框架 |
| Monaco Editor | 0.45.x | 代码编辑器 |
| React Router | 6.x | 路由管理 |
| Axios | 1.x | HTTP客户端 |
| Lucide React | 0.x | 图标库 |

### 3.2 后端技术栈

| 技术 | 版本 | 用途 |
|-----|------|-----|
| Node.js | 20.x | 运行环境 |
| Express | 4.x | Web框架 |
| TypeScript | 5.x | 类型安全 |
| MongoDB | 7.x | 数据库 |
| Mongoose | 7.x | ORM |
| OpenAI API | - | AI测试点生成 |
| pdf-parse | 1.x | PDF解析 |
| Docker | - | 代码沙箱运行 |

### 3.3 部署方案

| 环境 | 方案 |
|-----|------|
| 开发环境 | 本地Docker + MongoDB |
| 测试环境 | Docker Compose |
| 生产环境 | Kubernetes/Docker Swarm |

## 4. 系统架构设计

### 4.1 架构图

```
┌─────────────────────────────────────────────────────────────┐
│                      前端应用层                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ 首页     │  │ 题库管理 │  │ 代码编辑 │  │ 组卷系统 │    │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘    │
│       │             │             │             │           │
└───────┼─────────────┼─────────────┼─────────────┼───────────┘
        │             │             │             │
        ▼             ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────┐
│                      API网关层                              │
│              Express + TypeScript                           │
└───────────────────────────┬─────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   用户服务   │    │   题目服务   │    │   判题服务   │
└──────────────┘    └──────────────┘    └──────────────┘
        │                   │                   │
        ▼                   ▼                   ▼
┌─────────────────────────────────────────────────────────────┐
│                      数据存储层                              │
│              MongoDB (用户、题目、判题结果)                  │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 模块划分

| 模块 | 职责 | 文件路径 |
|-----|------|---------|
| user-service | 用户认证与管理 | backend/src/services/user |
| problem-service | 题库管理 | backend/src/services/problem |
| judge-service | 判题引擎 | backend/src/services/judge |
| ai-service | AI测试点生成 | backend/src/services/ai |
| exam-service | 组卷系统 | backend/src/services/exam |
| import-service | OJ链接导入 | backend/src/services/import |

### 4.3 核心业务流程图

#### 4.3.1 代码提交判题流程

```
用户提交代码 → 保存提交记录 → 创建判题任务 → 执行代码沙箱 → 
对比测试点 → 计算得分(ACM/OI) → 返回判题结果
```

#### 4.3.2 AI测试点生成流程

```
题目描述 → AI分析 → 生成输入输出 → 验证测试点 → 保存到题目
```

#### 4.3.3 OJ链接导入流程

```
输入OJ链接 → 解析HTML → 提取题目信息 → 格式化存储 → 返回导入结果
```

## 5. 数据库设计

### 5.1 用户表 (users)

| 字段名 | 类型 | 描述 |
|-------|------|------|
| _id | ObjectId | 用户ID |
| username | string | 用户名 |
| email | string | 邮箱 |
| password | string | 加密密码 |
| role | string | 角色(admin/user) |
| createdAt | Date | 创建时间 |
| updatedAt | Date | 更新时间 |

### 5.2 题目表 (problems)

| 字段名 | 类型 | 描述 |
|-------|------|------|
| _id | ObjectId | 题目ID |
| title | string | 题目标题 |
| description | string | 题目描述 |
| difficulty | string | 难度(easy/medium/hard) |
| type | string | 类型(leetcode/multifile/acm) |
| tags | string[] | 标签 |
| inputFormat | string | 输入格式 |
| outputFormat | string | 输出格式 |
| testCases | object[] | 测试用例 |
| templateCode | object | 模板代码(各语言) |
| createdAt | Date | 创建时间 |
| updatedAt | Date | 更新时间 |

### 5.3 提交表 (submissions)

| 字段名 | 类型 | 描述 |
|-------|------|------|
| _id | ObjectId | 提交ID |
| problemId | ObjectId | 题目ID |
| userId | ObjectId | 用户ID |
| code | string | 提交代码 |
| language | string | 编程语言 |
| status | string | 状态(pending/accepted/wrong/timeout/error) |
| score | number | 得分 |
| judgeMode | string | 判题模式(acm/oi) |
| testResults | object[] | 测试点结果 |
| createdAt | Date | 创建时间 |

### 5.4 试卷表 (exams)

| 字段名 | 类型 | 描述 |
|-------|------|------|
| _id | ObjectId | 试卷ID |
| title | string | 试卷标题 |
| description | string | 试卷描述 |
| problems | object[] | 题目列表(含分值) |
| startTime | Date | 开始时间 |
| endTime | Date | 结束时间 |
| judgeMode | string | 判题模式 |
| createdAt | Date | 创建时间 |

## 6. API接口设计

### 6.1 用户认证接口

| 方法 | 路径 | 描述 |
|-----|------|------|
| POST | /api/auth/register | 用户注册 |
| POST | /api/auth/login | 用户登录 |
| GET | /api/auth/me | 获取当前用户 |
| POST | /api/auth/logout | 用户登出 |

### 6.2 题目管理接口

| 方法 | 路径 | 描述 |
|-----|------|------|
| GET | /api/problems | 获取题目列表 |
| GET | /api/problems/:id | 获取单个题目 |
| POST | /api/problems | 创建题目 |
| PUT | /api/problems/:id | 更新题目 |
| DELETE | /api/problems/:id | 删除题目 |
| POST | /api/problems/import | 批量导入题目 |

### 6.3 判题接口

| 方法 | 路径 | 描述 |
|-----|------|------|
| POST | /api/judge/submit | 提交代码 |
| GET | /api/judge/:id | 获取判题结果 |
| GET | /api/judge/submissions | 获取提交记录 |

### 6.4 AI测试点生成接口

| 方法 | 路径 | 描述 |
|-----|------|------|
| POST | /api/ai/generate-testcases | 生成测试点 |

### 6.5 组卷接口

| 方法 | 路径 | 描述 |
|-----|------|------|
| GET | /api/exams | 获取试卷列表 |
| GET | /api/exams/:id | 获取试卷详情 |
| POST | /api/exams | 创建试卷 |
| PUT | /api/exams/:id | 更新试卷 |
| DELETE | /api/exams/:id | 删除试卷 |

### 6.6 OJ导入接口

| 方法 | 路径 | 描述 |
|-----|------|------|
| POST | /api/import/oj | 从OJ链接导入 |

## 7. 安全性设计

### 7.1 注意事项

1. **代码沙箱隔离**：用户提交的代码必须在隔离环境中执行，防止恶意代码攻击
2. **输入验证**：所有用户输入必须进行严格验证和过滤
3. **SQL注入防护**：使用ORM框架避免直接SQL操作
4. **XSS防护**：对输出内容进行HTML转义
5. **文件上传限制**：限制上传文件类型和大小
6. **API限流**：防止API被恶意调用

### 7.2 代码沙箱方案

使用Docker容器作为代码执行沙箱：
- 每个提交在独立容器中运行
- 设置资源限制(CPU、内存)
- 设置执行时间限制
- 容器执行完毕后立即销毁

## 8. 部署方案

### 8.1 开发环境

```bash
# 启动MongoDB
docker run -d -p 27017:27017 --name mongo mongo:7

# 启动后端
cd backend
npm install
npm run dev

# 启动前端
cd frontend
npm install
npm run dev
```

### 8.2 Docker Compose

```yaml
version: '3.8'
services:
  mongo:
    image: mongo:7
    volumes:
      - mongo-data:/data/db
    ports:
      - "27017:27017"
  
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - MONGO_URI=mongodb://mongo:27017/oj-platform
    depends_on:
      - mongo
  
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  mongo-data:
```

## 9. 性能优化建议

1. **缓存策略**：使用Redis缓存热门题目和判题结果
2. **异步处理**：判题任务放入消息队列异步处理
3. **数据库索引**：在常用查询字段上创建索引
4. **代码优化**：使用高效算法和数据结构

## 10. 扩展计划

1. 支持更多编程语言
2. 添加实时排行榜
3. 实现代码分享功能
4. 添加讨论区功能
5. 支持移动端访问