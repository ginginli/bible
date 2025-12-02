# GitHub Actions 设置完整指南

## 步骤 1: 获取 Pinterest API 凭证（5分钟）

### 1.1 获取 Access Token

1. **访问 Pinterest API Explorer**
   - 打开：https://developers.pinterest.com/tools/api-explorer/
   - 使用你的 Pinterest 账号登录

2. **选择权限**
   - 勾选：`boards:read`（读取 Board）
   - 勾选：`pins:write`（创建 Pin）
   - 点击 "Generate token"

3. **复制 Token**
   - 复制生成的 Access Token
   - ⚠️ **重要：** Token 只显示一次，请立即保存

### 1.2 获取 Board ID

**方法 A：从 URL 获取（简单）**

1. 在 Pinterest 创建或选择一个 Board（如 "Daily Bible Verses"）
2. 打开 Board 页面
3. Board ID 在 URL 中，格式可能是：
   - `pinterest.com/username/board-name/`
   - 或通过浏览器开发者工具查看

**方法 B：通过 API 获取（推荐）**

1. 使用获取的 Access Token
2. 访问：`https://api.pinterest.com/v5/boards`
3. 在请求头添加：`Authorization: Bearer YOUR_ACCESS_TOKEN`
4. 查看返回的 JSON，找到你的 Board ID

**方法 C：使用测试脚本**

```bash
cd automation
npm install
node get-pinterest-token.js
```

---

## 步骤 2: 设置 GitHub Secrets（2分钟）

### 2.1 进入仓库设置

1. 打开你的 GitHub 仓库：`https://github.com/ginginli/bible`
2. 点击 **Settings**（设置）
3. 左侧菜单选择 **Secrets and variables** → **Actions**

### 2.2 添加 Secrets

点击 **New repository secret**，添加以下两个：

#### Secret 1: `PINTEREST_ACCESS_TOKEN`
- **Name:** `PINTEREST_ACCESS_TOKEN`
- **Value:** 粘贴你从步骤 1.1 复制的 Access Token
- 点击 **Add secret**

#### Secret 2: `PINTEREST_BOARD_ID`
- **Name:** `PINTEREST_BOARD_ID`
- **Value:** 粘贴你从步骤 1.2 获取的 Board ID
- 点击 **Add secret**

### 2.3 验证设置

在 Secrets 页面应该看到：
- ✅ `PINTEREST_ACCESS_TOKEN`
- ✅ `PINTEREST_BOARD_ID`

---

## 步骤 3: 验证 GitHub Actions 配置

### 3.1 检查工作流文件

确认文件存在：`.github/workflows/pinterest.yml`

文件内容应该包含：
- 定时任务：`cron: '0 5 * * *'`（美国东部时间 0:00）
- 手动触发：`workflow_dispatch`

### 3.2 查看 Actions 页面

1. 进入仓库的 **Actions** 标签页
2. 应该看到 "Daily Pinterest Post" 工作流
3. 如果还没有运行过，会显示 "This workflow has never run"

---

## 步骤 4: 测试运行（可选但推荐）

### 4.1 手动触发测试

1. 进入 **Actions** 标签页
2. 点击左侧的 **Daily Pinterest Post**
3. 点击右侧的 **Run workflow** 按钮
4. 选择分支（通常是 `main`）
5. 点击 **Run workflow**

### 4.2 查看运行结果

1. 等待 1-2 分钟
2. 点击运行记录查看详情
3. 如果成功，会看到：
   - ✅ "Generate verse image..."
   - ✅ "Posting to Pinterest..."
   - ✅ "Automation completed successfully!"

### 4.3 验证 Pinterest

1. 打开你的 Pinterest Board
2. 应该看到新发布的 Pin
3. 检查图片、描述和链接是否正确

---

## 步骤 5: 完成！

✅ **设置完成！**

GitHub Actions 现在会：
- 每天美国东部时间 0:00 自动运行
- 生成当日圣经经文图片
- 自动发布到 Pinterest

---

## 时间说明

**当前设置：** UTC 5:00 = 美国东部时间 0:00

- **东部标准时间（EST，11月-3月）：** UTC-5 → UTC 5:00 = EST 0:00 ✅
- **东部夏令时（EDT，3月-11月）：** UTC-4 → UTC 5:00 = EDT 1:00

如果需要精确的 0:00（包括夏令时），可以：
- 使用 UTC 4:00（EDT 0:00，但 EST 会是 23:00）
- 或使用 UTC 5:00（EST 0:00，EDT 1:00）← 当前设置

---

## 故障排查

### 问题 1: Actions 运行失败

**检查：**
- Secrets 是否正确设置
- Token 是否有效
- Board ID 是否正确

**解决：**
- 重新生成 Token
- 验证 Board ID
- 查看 Actions 日志

### 问题 2: Pinterest API 错误

**常见错误：**
- `401 Unauthorized` → Token 无效或过期
- `403 Forbidden` → 权限不足
- `404 Not Found` → Board ID 错误

**解决：**
- 重新生成 Token
- 确认权限包含 `boards:read` 和 `pins:write`
- 验证 Board ID

### 问题 3: 图片生成失败

**检查：**
- 网站是否可访问
- 网络连接是否正常

**解决：**
- 确保网站正常运行
- 检查 Actions 日志中的错误信息

---

## 修改运行时间

如果需要修改运行时间，编辑 `.github/workflows/pinterest.yml`：

```yaml
schedule:
  - cron: '0 5 * * *'  # 修改这里的数字
```

**Cron 格式：** `分钟 小时 日 月 星期`

**示例：**
- `'0 5 * * *'` = 每天 UTC 5:00（美国东部时间 0:00）
- `'0 12 * * *'` = 每天 UTC 12:00（美国东部时间 7:00）
- `'0 0 * * *'` = 每天 UTC 0:00（美国东部时间前一天 19:00）

---

## 监控和维护

### 查看运行历史

1. 进入 **Actions** 标签页
2. 点击 **Daily Pinterest Post**
3. 查看所有运行记录

### 接收通知

GitHub 会自动发送邮件通知：
- 工作流失败时
- 可以设置通知偏好

### 定期检查

建议每周检查一次：
- Actions 是否正常运行
- Pinterest 是否正常发布
- 图片质量是否良好

---

## 需要帮助？

如果遇到问题：
1. 查看 Actions 日志
2. 检查 Secrets 设置
3. 验证 Pinterest API 凭证
4. 参考 `automation/README.md` 获取更多信息

