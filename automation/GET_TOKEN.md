# 获取 Pinterest Access Token 完整步骤

## 方法 1: 使用 API Explorer（最简单，推荐测试）⭐

### 步骤：

1. **访问 API Explorer**
   - 打开：https://developers.pinterest.com/tools/api-explorer/
   - 使用你的 Pinterest 账号登录

2. **选择权限**
   - 勾选：`boards:read`
   - 勾选：`pins:write`
   - 勾选：`user_accounts:read`（可选，用于获取用户信息）

3. **生成 Token**
   - 点击 "Generate token" 按钮
   - 复制生成的 Access Token
   - ⚠️ **重要：Token 只显示一次，立即保存！**

4. **完成**
   - 将 Token 添加到 `.env` 文件或 GitHub Secrets

**优点：** 快速、简单，适合测试
**缺点：** Token 有效期较短（通常 1 小时），不适合生产环境

---

## 方法 2: OAuth 2.0 授权码流程（生产环境推荐）

### 前置要求：

1. **创建 Pinterest 应用**
   - 访问：https://developers.pinterest.com/apps/
   - 点击 "Create app"
   - 填写应用信息：
     - App name: Bible Verse Generator
     - App description: Daily Bible verse automation
     - Website URL: https://random-bible-verse-generator.info
   - 获取 `App ID` 和 `App Secret`

2. **设置重定向 URI**
   - 在应用设置中添加重定向 URI
   - 例如：`https://random-bible-verse-generator.info/oauth/callback`
   - 或本地测试：`http://localhost:3000/callback`

### 步骤：

#### 步骤 1: 获取授权码

构建授权 URL：

```
https://www.pinterest.com/oauth/?
  client_id=YOUR_APP_ID&
  redirect_uri=YOUR_REDIRECT_URI&
  response_type=code&
  scope=boards:read,pins:write,user_accounts:read&
  state=random_string
```

**参数说明：**
- `client_id`: 你的 App ID
- `redirect_uri`: 你设置的重定向 URI（必须完全匹配）
- `response_type`: 固定为 `code`
- `scope`: 需要的权限，用逗号分隔
- `state`: 随机字符串，用于防止 CSRF 攻击

**操作：**
1. 在浏览器中打开上述 URL
2. 登录 Pinterest 并授权
3. Pinterest 会重定向到你的 `redirect_uri`，URL 中包含 `code` 参数
4. 从 URL 中提取 `code`：`?code=AUTHORIZATION_CODE&state=...`

#### 步骤 2: 交换授权码获取 Token

发送 POST 请求：

```bash
POST https://api.pinterest.com/v5/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&
code=AUTHORIZATION_CODE&
redirect_uri=YOUR_REDIRECT_URI&
client_id=YOUR_APP_ID&
client_secret=YOUR_APP_SECRET
```

**响应示例：**
```json
{
  "access_token": "YOUR_ACCESS_TOKEN",
  "token_type": "bearer",
  "expires_in": 2592000,
  "refresh_token": "YOUR_REFRESH_TOKEN",
  "scope": "boards:read,pins:write,user_accounts:read"
}
```

#### 步骤 3: 保存 Token

- `access_token`: 用于 API 调用（有效期 30 天）
- `refresh_token`: 用于刷新 Access Token

---

## 方法 3: 使用自动化脚本（推荐）

我已经创建了辅助脚本，可以简化流程：

```bash
cd automation
npm install
node get-pinterest-token.js
```

---

## 快速开始（推荐）

### 对于测试/开发：

**直接使用 API Explorer：**
1. https://developers.pinterest.com/tools/api-explorer/
2. 选择权限：`boards:read`, `pins:write`
3. 生成 Token
4. 复制到 `.env` 文件

### 对于生产环境：

**使用 OAuth 2.0 流程：**
1. 创建应用获取 App ID 和 Secret
2. 使用授权码流程获取 Token
3. 保存 Access Token 和 Refresh Token
4. 定期刷新 Token（使用 Refresh Token）

---

## Token 使用

### 在代码中使用：

```javascript
const accessToken = process.env.PINTEREST_ACCESS_TOKEN;
```

### 在 GitHub Actions 中使用：

设置为 Secret：`PINTEREST_ACCESS_TOKEN`

---

## 刷新 Token（如果过期）

如果使用 OAuth 2.0 流程，可以使用 Refresh Token 刷新：

```bash
POST https://api.pinterest.com/v5/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token&
refresh_token=YOUR_REFRESH_TOKEN&
client_id=YOUR_APP_ID&
client_secret=YOUR_APP_SECRET
```

---

## 注意事项

1. **Token 安全**
   - 不要将 Token 提交到 Git
   - 使用环境变量或 Secrets 存储
   - 定期轮换 Token

2. **Token 有效期**
   - API Explorer Token: 通常 1 小时
   - OAuth Token: 30 天（可用 Refresh Token 刷新）

3. **权限范围**
   - 最小权限原则：只申请需要的权限
   - 必需：`pins:write`, `boards:read`

4. **速率限制**
   - 遵守 Pinterest API 速率限制
   - 通常为每分钟 1000 次请求

---

## 故障排查

**问题：** Token 无效
- 检查 Token 是否过期
- 确认权限正确
- 重新生成 Token

**问题：** 授权失败
- 检查 App ID 和 Secret 是否正确
- 确认重定向 URI 完全匹配
- 检查 scope 权限是否正确

**问题：** 403 Forbidden
- 确认 Token 有正确的权限
- 检查 Board ID 是否正确
- 验证应用状态是否正常

