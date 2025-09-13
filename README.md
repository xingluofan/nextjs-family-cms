# 家庭厨房管理系统

一个基于 Next.js 15 的现代化家庭管理系统，集成菜单管理和记账功能。

## 功能特性

### 🍳 菜单管理

- 添加和管理家庭菜谱
- 上传菜品图片
- 记录食材和烹饪步骤
- 设置准备时间和难度等级
- 菜谱列表浏览和查看

### 💰 记账管理

- 收支记录管理
- 按日期范围查询账单
- 可视化图表展示（月度趋势、分类占比）
- 预定义收支类别
- 交易记录表格展示和排序
- 财务统计概览

## 技术栈

- **框架**: Next.js 15.5.3 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **图表**: Recharts
- **日期处理**: date-fns
- **代码规范**: ESLint

## 项目结构

```
src/
├── app/                          # Next.js App Router 路由
│   ├── api/                      # API 路由
│   │   ├── accounting/           # 记账模块 API
│   │   │   ├── route.ts         # 交易记录 CRUD
│   │   │   └── summary/         # 统计数据 API
│   │   │       └── route.ts
│   │   └── menu/                # 菜单模块 API
│   │       └── route.ts         # 菜单 CRUD
│   ├── accounting/              # 记账模块路由页面
│   │   └── page.tsx
│   ├── menu/                    # 菜单模块路由页面
│   │   ├── list/
│   │   │   └── page.tsx
│   │   └── upload/
│   │       └── page.tsx
│   ├── globals.css              # 全局样式
│   ├── layout.tsx               # 根布局组件
│   └── page.tsx                 # 首页
├── components/                   # 可复用组件
│   ├── accounting/              # 记账模块组件
│   │   ├── charts/              # 图表组件
│   │   │   ├── CategoryChart.tsx    # 分类饼图
│   │   │   └── MonthlyChart.tsx     # 月度趋势图
│   │   ├── forms/               # 表单组件
│   │   │   └── TransactionForm.tsx  # 交易表单
│   │   ├── pages/               # 页面组件
│   │   │   └── AccountingPage.tsx   # 记账主页面
│   │   └── tables/              # 表格组件
│   │       └── TransactionTable.tsx # 交易记录表格
│   └── menu/                    # 菜单模块组件
│       └── pages/               # 页面组件
│           ├── MenuListPage.tsx     # 菜单列表页面
│           └── MenuUploadPage.tsx   # 菜单上传页面
└── lib/                         # 工具库和类型定义
    └── types/                   # TypeScript 类型定义
        ├── accounting.ts        # 记账模块类型
        └── menu.ts             # 菜单模块类型
```

## 模块说明

### 菜单管理模块

- **路由**: `/menu/list`, `/menu/upload`
- **API**: `/api/menu`
- **功能**: 菜谱的增删改查，支持图片上传
- **数据存储**: 内存存储（开发环境）

### 记账管理模块

- **路由**: `/accounting`
- **API**: `/api/accounting`, `/api/accounting/summary`
- **功能**:
  - 交易记录管理（收入/支出）
  - 按日期和类型筛选
  - 月度收支趋势图表
  - 支出分类饼图
  - 财务统计汇总
- **数据存储**: 内存存储（开发环境）

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
npm start
```

## 开发说明

### 添加新模块

1. 在 `src/components/` 下创建模块目录
2. 在 `src/app/` 下创建对应的路由页面
3. 在 `src/lib/types/` 下定义类型
4. 在 `src/app/api/` 下创建 API 路由
5. 更新导航栏和首页链接

### 数据存储

当前使用内存存储作为演示，生产环境建议：

- 集成数据库（如 PostgreSQL、MongoDB）
- 使用 ORM（如 Prisma、Mongoose）
- 添加数据持久化

### 图片处理

当前图片以 Base64 格式存储在内存中，生产环境建议：

- 使用云存储服务（如 AWS S3、阿里云 OSS）
- 集成图片压缩和优化
- 添加图片格式验证

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情
