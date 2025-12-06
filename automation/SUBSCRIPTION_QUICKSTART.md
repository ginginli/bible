# 邮件订阅快速开始 🚀

## 3 分钟快速设置

### 1️⃣ 安装依赖
```bash
cd automation
npm install
```

### 2️⃣ 获取 Resend API Key（免费）
1. 访问 https://resend.com/ 注册
2. 创建 API Key
3. 复制 Key

### 3️⃣ 配置环境变量
```bash
cp .env.example .env
```

编辑 `.env`，添加：
```env
RESEND_API_KEY=re_你的API密钥
EMAIL_FROM=Daily Verse <noreply@你的域名.com>
```

### 4️⃣ 启动服务
```bash
# 启动订阅服务器
npm run server

# 另开一个终端，启动定时任务
npm run schedule
```

### 5️⃣ 测试
打开浏览器访问 `subscribe.html` 页面，输入邮箱测试订阅。

## 主要文件说明

| 文件 | 说明 |
|------|------|
| `email-subscription.js` | 邮件订阅核心逻辑 |
| `subscription-server.js` | API 服务器（处理订阅/取消订阅） |
| `scheduler.js` | 定时任务（每天发送邮件） |
| `subscribers.json` | 订阅者数据库（自动生成） |
| `subscribe.html` | 订阅页面 |
| `unsubscribe.html` | 取消订阅页面 |

## 部署到生产环境

### 推荐方案：Railway（最简单）
1. 访问 https://railway.app/
2. 连接 GitHub 仓库
3. 添加环境变量 `RESEND_API_KEY`
4. 自动部署 ✅

### 或使用 GitHub Actions（完全免费）
已包含配置文件，只需在 GitHub 仓库设置 Secrets。

## 常见问题

**Q: 免费额度够用吗？**  
A: Resend 免费 100 封/天，足够个人使用。

**Q: 如何查看订阅者？**  
A: 查看 `automation/subscribers.json` 文件。

**Q: 如何自定义邮件内容？**  
A: 编辑 `email-subscription.js` 中的 `generateEmailHTML()` 函数。

**Q: 如何更改发送时间？**  
A: 修改 `.env` 中的 `CRON_SCHEDULE`（Cron 格式）。

## 下一步

查看完整文档：`EMAIL_SUBSCRIPTION_SETUP.md`
