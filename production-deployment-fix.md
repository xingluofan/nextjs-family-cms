# 生产环境部署修复指南

## 问题诊断

当前生产环境出现 `500: INTERNAL_SERVER_ERROR` 和 `MIDDLEWARE_INVOCATION_FAILED` 错误，主要原因是缺少必要的环境变量配置。

## 解决方案

### 1. 在 Vercel 中配置环境变量 1

在 Vercel 项目设置中添加以下环境变量：

```bash
# 必需的环境变量
JWT_SECRET=your-production-secret-key-should-be-very-long-and-secure-at-least-32-characters
NODE_ENV=production
POSTGRES_URL=your-production-database-url
PRISMA_DATABASE_URL=your-production-prisma-url
DATABASE_URL=your-production-database-url
```

### 2. JWT_SECRET 生成建议

使用以下方法生成安全的 JWT_SECRET：

```bash
# 方法1: 使用 Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# 方法2: 使用 OpenSSL
openssl rand -hex 64

# 方法3: 在线生成器
# 访问 https://generate-secret.vercel.app/64
```

### 3. Vercel 环境变量配置步骤

1. 登录 Vercel Dashboard
2. 选择你的项目
3. 进入 Settings → Environment Variables
4. 添加上述环境变量
5. 确保选择正确的环境（Production, Preview, Development）
6. 重新部署项目

### 4. 验证配置

部署完成后，检查以下内容：

- [ ] JWT_SECRET 已正确设置
- [ ] 数据库连接正常
- [ ] 中间件不再报错
- [ ] 登录功能正常
- [ ] API 路由可以正常访问

### 5. 常见问题排查

#### 问题 1: 中间件仍然失败

- 检查 JWT_SECRET 是否至少 32 个字符
- 确认环境变量名称拼写正确
- 重新部署项目

#### 问题 2: 数据库连接失败

- 验证数据库 URL 格式
- 检查数据库服务是否可用
- 确认网络连接权限

#### 问题 3: 认证功能异常

- 清除浏览器缓存和 Cookie
- 检查 JWT token 格式
- 验证用户表结构

## 部署命令

```bash
# 重新部署到生产环境
vercel --prod

# 或者通过 Git 推送触发自动部署
git add .
git commit -m "fix: 修复生产环境配置"
git push origin main
```

## 监控和日志

部署后可以通过以下方式监控应用状态：

1. Vercel Dashboard → Functions → View Function Logs
2. 浏览器开发者工具 → Network 标签
3. 应用内的错误提示信息

---

**注意**: 请确保所有敏感信息（如数据库密码、JWT 密钥）都通过环境变量配置，不要直接写在代码中。
