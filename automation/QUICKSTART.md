# 快速开始指南

## 三种自动化方案对比

### 方案 1: GitHub Actions（推荐，免费）⭐

**优点：**
- ✅ 完全免费
- ✅ 无需服务器
- ✅ 自动运行
- ✅ 易于设置

**步骤：**
1. 在 GitHub 仓库设置 Secrets：
   - `PINTEREST_ACCESS_TOKEN`
   - `PINTEREST_BOARD_ID`
2. 文件已创建：`.github/workflows/pinterest.yml`
3. 每天自动运行（UTC 8:00）

**成本：** 免费

---

### 方案 2: VPS 服务器

**优点：**
- ✅ 完全控制
- ✅ 可自定义时间
- ✅ 稳定可靠

**步骤：**
1. 租用 VPS（$5-10/月）
2. 安装 Node.js
3. 运行 `npm install` 和 `npm run schedule`
4. 使用 PM2 管理进程

**成本：** $5-10/月

---

### 方案 3: Railway / Render（云服务）

**优点：**
- ✅ 简单易用
- ✅ 有免费额度
- ✅ 自动部署

**步骤：**
1. 注册 Railway 或 Render
2. 连接 GitHub 仓库
3. 设置环境变量
4. 自动运行

**成本：** 免费额度通常足够

---

## 立即开始（GitHub Actions）

### 1. 获取 Pinterest API 凭证

访问：https://developers.pinterest.com/tools/api-explorer/

1. 登录 Pinterest
2. 选择权限：`boards:read`, `pins:write`
3. 生成 Access Token
4. 复制 Token

### 2. 获取 Board ID

1. 在 Pinterest 创建 Board（如 "Daily Bible Verses"）
2. Board ID 在 Board URL 中
3. 或通过 API 获取

### 3. 设置 GitHub Secrets

1. 进入 GitHub 仓库
2. Settings → Secrets and variables → Actions
3. 添加两个 Secrets：
   - `PINTEREST_ACCESS_TOKEN` = 你的 Token
   - `PINTEREST_BOARD_ID` = 你的 Board ID

### 4. 完成！

GitHub Actions 会自动：
- 每天 UTC 8:00 运行
- 生成当日经文图片
- 发布到 Pinterest

### 手动触发

在 GitHub Actions 页面点击 "Run workflow" 可立即运行一次。

---

## 测试运行

在本地测试（需要 Node.js）：

```bash
cd automation
npm install
cp env.example .env
# 编辑 .env 文件，填入凭证
npm start
```

---

## 故障排查

**问题：** GitHub Actions 失败
**解决：** 检查 Secrets 是否正确设置

**问题：** Pinterest API 错误
**解决：** 确认 Token 有效，权限正确

**问题：** 图片生成失败
**解决：** 确保网站可访问，检查网络

---

## 下一步

- 调整发布时间（修改 cron 表达式）
- 添加错误通知（Email/Slack）
- 支持多个 Board
- 添加其他社交媒体平台

