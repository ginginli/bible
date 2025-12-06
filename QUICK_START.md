# ⚡ 5分钟快速开始 - 搭建支付系统

## 🎯 目标

让用户可以在你的网站付费，然后自动收到每日邮件。

## 📋 你需要的东西

1. ✅ GitHub 账号（已有）
2. ✅ Creem 账号（已有）
3. ⏳ Vercel 账号（免费注册）
4. ⏳ Resend 账号（免费注册）

## 🚀 5个步骤完成

### 步骤 1：部署到 Vercel（2分钟）

1. 访问 https://vercel.com/
2. 点击 "Sign Up" → "Continue with GitHub"
3. 点击 "Add New Project"
4. 选择 `ginginli/bible` 仓库
5. 点击 "Deploy"
6. 等待部署完成 ✅

**你会得到：** `https://bible-xxx.vercel.app`

### 步骤 2：配置 Creem Webhook（1分钟）

1. 登录 https://www.creem.io/dashboard
2. 找到 "Webhooks" 或 "Settings"
3. 点击 "Add Webhook"
4. 填写：
   ```
   URL: https://bible-xxx.vercel.app/api/webhook
   ```
5. 勾选所有事件
6. 保存并复制 Secret（`whsec_...`）

### 步骤 3：获取 Resend API Key（1分钟）

1. 访问 https://resend.com/
2. 注册账号（免费）
3. 进入 Dashboard → API Keys
4. 点击 "Create API Key"
5. 复制密钥（`re_...`）

### 步骤 4：添加环境变量到 Vercel（1分钟）

1. 回到 Vercel 项目
2. 点击 Settings → Environment Variables
3. 添加 3 个变量：

```
RESEND_API_KEY = re_你的密钥
CREEM_WEBHOOK_SECRET = whsec_你的密钥
EMAIL_FROM = Daily Verse <ladyiney25@gmail.com>
```

4. 点击 "Redeploy" 重新部署

### 步骤 5：测试（1分钟）

1. 访问 `https://random-bible-verse-generator.info/premium.html`
2. 点击 "Start Quarterly Plan"
3. 使用测试卡号：`4242 4242 4242 4242`
4. 完成支付
5. 检查 Vercel 日志，应该看到 "Received webhook"

## ✅ 完成！

现在：
- ✅ 用户可以在你的网站付费
- ✅ 支付成功后自动添加到付费列表
- ✅ 每天早上 8 点自动发送邮件

## 🔍 如何查看付费用户？

**方法 1：GitHub**
- 访问你的仓库
- 打开 `automation/paid-subscribers.json`

**方法 2：Vercel 日志**
- Vercel 项目 → Functions → Logs

**方法 3：Creem Dashboard**
- 查看 "Customers" 或 "Payments"

## 📧 如何发送邮件？

邮件会自动发送，但你也可以手动测试：

1. 在本地运行：
```bash
cd automation
npm install
npm run send-emails
```

2. 或等到明天早上 8 点，系统会自动发送

## ❓ 常见问题

**Q: Webhook 没收到？**
- 检查 Vercel 是否部署成功
- 检查 Creem Webhook URL 是否正确
- 查看 Creem Dashboard 的 Webhook 日志

**Q: 邮件没发送？**
- 检查 Resend API Key 是否正确
- 检查环境变量是否配置
- 查看 Vercel 日志

**Q: 如何测试不花钱？**
- 使用 Creem 测试模式
- 测试卡号：4242 4242 4242 4242
- 不会真的扣款

## 📚 详细文档

- 完整部署指南：`VERCEL_DEPLOYMENT.md`
- Creem 设置：`automation/CREEM_SETUP.md`
- 邮件系统：`automation/EMAIL_SUBSCRIPTION_SETUP.md`

## 🎉 恭喜！

你现在有了一个完整的付费订阅系统！

**下一步：**
1. 发邮件给 Creem 审核（`CREEM_COMPLIANCE.md`）
2. 开始推广你的网站
3. 等待第一个付费用户 💰

---

需要帮助？查看详细文档或联系我！
