# Next.js 家庭管理系统 - 项目结构文档

## 项目概述

这是一个基于 Next.js 14 的全栈家庭管理系统，采用现代化的技术栈，包含用户管理、菜单管理、财务管理等核心功能。项目使用 TypeScript、Tailwind CSS、Prisma ORM 等技术构建。

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **数据库**: Prisma ORM
- **认证**: 自定义认证系统
- **部署**: Vercel

## 项目目录结构

```
nextjs-family-cms/
├── .env.local                    # 环境变量配置
├── .gitignore                    # Git 忽略文件
├── README.md                     # 项目说明文档
├── eslint.config.mjs            # ESLint 配置
├── middleware.ts                 # Next.js 中间件（认证拦截）
├── next-env.d.ts                # Next.js TypeScript 声明
├── next.config.ts               # Next.js 配置文件
├── package.json                 # 项目依赖和脚本
├── package-lock.json            # 依赖锁定文件
├── postcss.config.mjs           # PostCSS 配置（Tailwind CSS）
├── tsconfig.json                # TypeScript 配置
├── vercel.json                  # Vercel 部署配置
│
├── prisma/
│   └── schema.prisma            # 数据库模型定义
│
├── public/                      # 静态资源目录
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
└── src/
    ├── app/                     # Next.js App Router 页面
    │   ├── api/                 # API 路由
    │   │   ├── auth/           # 认证相关 API
    │   │   ├── finance/        # 财务管理 API
    │   │   ├── recipes/        # 菜谱管理 API
    │   │   └── users/          # 用户管理 API
    │   │
    │   ├── finance/            # 财务管理页面
    │   │   └── page.tsx
    │   │
    │   ├── login/              # 登录页面
    │   │   └── page.tsx
    │   │
    │   ├── menu/               # 菜单管理页面（占位符）
    │   │   └── page.tsx
    │   │
    │   ├── recipes/            # 菜谱管理页面（实际功能）
    │   │   └── page.tsx
    │   │
    │   ├── users/              # 用户管理页面
    │   │   └── page.tsx
    │   │
    │   ├── globals.css         # 全局样式
    │   ├── layout.tsx          # 根布局组件
    │   └── page.tsx            # 首页
    │
    ├── components/             # React 组件
    │   ├── common/             # 通用组件
    │   │   └── AppLayout.tsx   # 应用布局组件
    │   │
    │   ├── finance/            # 财务管理组件
    │   ├── layout/             # 布局相关组件
    │   ├── menu/               # 菜单组件（空）
    │   ├── recipe/             # 菜谱管理组件
    │   └── users/              # 用户管理组件
    │
    ├── contexts/               # React Context
    │   └── AuthContext.tsx     # 认证上下文
    │
    └── lib/                    # 工具库和服务
        ├── auth/               # 认证相关工具
        ├── database/           # 数据库连接
        ├── finance/            # 财务管理工具
        ├── menu/               # 菜单管理工具（空）
        ├── services/           # 业务服务层
        └── users/              # 用户管理工具
```

## 核心文件说明

### 配置文件

- **next.config.ts**: Next.js 配置，包含构建优化、环境变量等
- **tailwind.config.ts**: Tailwind CSS 配置，定义主题、颜色等
- **tsconfig.json**: TypeScript 编译配置
- **middleware.ts**: 路由中间件，处理认证拦截

### 数据层

- **prisma/schema.prisma**: 数据库模型定义，包含用户、菜谱、财务等表结构
- **src/lib/database/**: 数据库连接和配置

### 认证系统

- **src/contexts/AuthContext.tsx**: 全局认证状态管理
- **src/lib/auth/**: 认证工具函数
- **src/app/api/auth/**: 认证 API 端点
- **middleware.ts**: 路由保护中间件

### 页面结构

- **src/app/layout.tsx**: 根布局，包含全局样式和 Provider
- **src/app/page.tsx**: 首页仪表板
- **src/app/login/page.tsx**: 登录页面
- **src/app/users/page.tsx**: 用户管理页面
- **src/app/recipes/page.tsx**: 菜谱管理页面（实际功能）
- **src/app/finance/page.tsx**: 财务管理页面

### 组件系统

- **src/components/common/AppLayout.tsx**: 主应用布局，包含侧边栏导航
- **src/components/recipe/**: 菜谱管理相关组件
- **src/components/users/**: 用户管理相关组件
- **src/components/finance/**: 财务管理相关组件

## 当前功能状态

### ✅ 已完成功能

1. **用户认证系统**
   - 登录/登出功能
   - 路由保护中间件
   - 认证状态管理

2. **用户管理**
   - 用户列表展示
   - 用户信息管理

3. **菜谱管理**（位于 `/recipes` 路由）
   - 菜谱 CRUD 操作
   - 食材管理
   - 分类筛选
   - 搜索功能

4. **基础架构**
   - 响应式布局
   - 导航系统
   - 错误处理

### 🚧 待完善功能

1. **财务管理**
   - 收支记录
   - 统计报表
   - 预算管理

2. **数据库集成**
   - Prisma 模型完善
   - 数据持久化

## 后续开发建议

### 前端开发重点

#### 1. 组件库完善
```typescript
// 建议创建通用组件
src/components/ui/
├── Button.tsx          # 统一按钮组件
├── Input.tsx           # 表单输入组件
├── Modal.tsx           # 弹窗组件
├── Table.tsx           # 表格组件
├── Loading.tsx         # 加载状态组件
└── Toast.tsx           # 消息提示组件
```

#### 2. 状态管理优化
```typescript
// 建议使用 Zustand 或 Redux Toolkit
src/store/
├── authStore.ts        # 认证状态
├── userStore.ts        # 用户数据
├── recipeStore.ts      # 菜谱数据
└── financeStore.ts     # 财务数据
```

#### 3. 类型定义完善
```typescript
// 统一类型定义
src/types/
├── auth.ts             # 认证相关类型
├── user.ts             # 用户类型
├── recipe.ts           # 菜谱类型
├── finance.ts          # 财务类型
└── common.ts           # 通用类型
```

### 后端开发重点

#### 1. API 架构完善
```typescript
// RESTful API 设计
src/app/api/
├── auth/
│   ├── login/route.ts
│   ├── logout/route.ts
│   └── refresh/route.ts
├── users/
│   ├── route.ts        # GET /api/users, POST /api/users
│   └── [id]/route.ts   # GET/PUT/DELETE /api/users/[id]
├── recipes/
│   ├── route.ts
│   ├── [id]/route.ts
│   └── categories/route.ts
└── finance/
    ├── transactions/route.ts
    ├── categories/route.ts
    └── reports/route.ts
```

#### 2. 数据库模型扩展
```prisma
// prisma/schema.prisma 建议扩展
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  avatar    String?
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  recipes     Recipe[]
  transactions Transaction[]
}

model Recipe {
  id          String   @id @default(cuid())
  title       String
  description String?
  ingredients Json
  steps       Json
  difficulty  Difficulty
  cookTime    Int
  servings    Int
  category    Category
  authorId    String
  author      User     @relation(fields: [authorId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Transaction {
  id          String      @id @default(cuid())
  amount      Decimal
  type        TransactionType
  category    String
  description String?
  date        DateTime
  userId      String
  user        User        @relation(fields: [userId], references: [id])
  createdAt   DateTime    @default(now())
}
```

#### 3. 服务层架构
```typescript
// 业务逻辑分层
src/lib/services/
├── authService.ts      # 认证业务逻辑
├── userService.ts      # 用户管理
├── recipeService.ts    # 菜谱管理
├── financeService.ts   # 财务管理
└── uploadService.ts    # 文件上传
```

### 技术优化建议

#### 1. 性能优化
- 实现图片懒加载和压缩
- 使用 React.memo 优化组件渲染
- 实现虚拟滚动（长列表）
- 添加缓存策略（SWR 或 React Query）

#### 2. 用户体验
- 添加骨架屏加载状态
- 实现离线功能（PWA）
- 添加快捷键支持
- 实现拖拽排序功能

#### 3. 安全性
- 实现 JWT 令牌刷新机制
- 添加 CSRF 保护
- 实现 API 限流
- 数据验证和清理

## 面试准备要点

### 技术亮点

1. **现代化技术栈**: Next.js 14 App Router + TypeScript + Tailwind CSS
2. **全栈开发**: 前后端一体化，API 路由设计
3. **认证系统**: 自定义认证中间件和状态管理
4. **响应式设计**: 移动端适配和现代 UI
5. **代码组织**: 清晰的目录结构和组件分层

### 可展示功能

1. **用户认证流程**: 登录保护、路由拦截
2. **CRUD 操作**: 菜谱管理的完整增删改查
3. **状态管理**: Context API 使用
4. **组件设计**: 可复用组件架构
5. **API 设计**: RESTful 接口规范

### 扩展讨论点

1. **架构设计**: 为什么选择这些技术栈
2. **性能优化**: 如何处理大数据量和用户体验
3. **安全考虑**: 认证授权和数据保护
4. **部署运维**: Vercel 部署和环境管理
5. **团队协作**: 代码规范和版本控制

## 启动和开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 总结

这个项目展示了现代 Web 开发的最佳实践，包含完整的前后端功能，适合作为面试项目展示。重点突出了 Next.js 全栈开发能力、TypeScript 类型安全、现代化 UI 设计等技术特点。