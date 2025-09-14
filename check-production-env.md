# 生产环境调试指南

## 1. 检查环境变量

在 Vercel 部署后，你需要确保以下环境变量已正确设置：

### 必需的环境变量：
- `JWT_SECRET`: JWT 签名密钥（建议使用强随机字符串）
- `DATABASE_URL`: 数据库连接字符串
- `PRISMA_DATABASE_URL`: Prisma 数据库连接字符串
- `NODE_ENV`: 应该自动设置为 'production'

### 在 Vercel 中设置环境变量：
1. 进入 Vercel 项目设置
2. 点击 "Environment Variables"
3. 添加以下变量：
   ```
   JWT_SECRET=your-super-secret-jwt-key-for-production-use-a-long-random-string
   ```

## 2. 调试步骤

### 步骤 1: 检查环境变量（开发环境）
访问：`http://localhost:3000/api/debug/env`

### 步骤 2: 查看服务器日志
在 Vercel 控制台中查看 Function Logs，寻找以下调试信息：
- `[DEBUG] 验证Token:`
- `[DEBUG] 获取认证用户信息:`
- `[DEBUG] Cookie Token:`
- `[DEBUG] /api/auth/me 请求开始:`

### 步骤 3: 测试登录流程
1. 尝试登录
2. 检查浏览器开发者工具的 Network 标签
3. 查看 `/api/auth/login` 响应是否包含 Set-Cookie 头
4. 检查 Cookie 是否正确设置

### 步骤 4: 测试认证状态
1. 登录后访问 `/api/auth/me`
2. 检查响应状态码（应该是 200 而不是 401）
3. 查看服务器日志中的调试信息

## 3. 常见问题

### 问题 1: JWT_SECRET 未设置
**症状**: Token 验证失败，日志显示使用默认密钥
**解决**: 在 Vercel 中设置 JWT_SECRET 环境变量

### 问题 2: Cookie 设置问题
**症状**: 登录成功但后续请求认证失败
**解决**: 检查 cookie 的 domain、sameSite、secure 设置

### 问题 3: 中间件认证失败
**症状**: 访问受保护页面时重定向到登录页
**解决**: 检查中间件日志，确认 cookie 是否正确传递

## 4. 生产环境测试命令

```bash
# 测试登录 API
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"your-username","password":"your-password"}' \
  -v

# 测试认证状态（使用返回的 cookie）
curl https://your-app.vercel.app/api/auth/me \
  -H "Cookie: auth-token=your-token-here" \
  -v
```

## 5. 移除调试代码

生产环境稳定后，记得移除调试日志以避免敏感信息泄露：
- `src/lib/auth/middleware.ts` 中的 console.log
- `src/app/api/auth/login/route.ts` 中的 console.log
- `src/app/api/auth/me/route.ts` 中的 console.log
- 删除 `src/app/api/debug/env/route.ts`