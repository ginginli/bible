# 🚀 Vercel 部署指南 - Webhook 设置

## 为什么选择 Vercel？

- ✅ 完全免费（个人项目）
- ✅ 自动部署（连接 GitHub）
- ✅ 支持 Serverless Functions（处理 Webhook）
- ✅ 全球 CDN（网站快速）
- ✅ 自动 HTTPS

## 📋 完整部署步骤

### 步骤 1：注册 Vercel

1. 访问 https://vercel.com/
2. 点击 "Sign Up"
3. 选择 "Continue with GitHub"
4. 授权 Vercel 访问你的 GitHub

### 步骤 2：导入项目

1. 在 Vercel Dashboard 点击 "Add New Project"
2. 选择你的 GitHub 仓库：`ginginli/bible`
3. 点击 "Import"

### 步骤 3：配置环境变量

在 Vercel 项目设置中添加环境变量：

**必需的环境变量：**

```
RESEND_API_KEY=re_你的Resend密钥
CREEM_WEBHOOK_SECRET=whsec_你的Creem密钥
WEBSITE_URL=https://random-bible-verse-generator.info
EMAIL_FROM=Daily Verse <ladyiney25@gmail.com>
```

**如何添加：**
1. 进入项目 → Settings → Environment Variables
2. 添加每个变量
3. 选择 "Production, Preview, Development"

### 步骤 4：部署

1. 点击 "Deploy"
2. 等待 1-2 分钟
3. 部署完成！

你会得到一个 URL，类似：
```
https://bible-ginginli.vercel.app
```

### 步骤 5：配置自定义域名（可选）

1. 在 Vercel 项目 → Settings → Domains
2. 添加你的域名：`random-bible-verse-generator.info`
3. 按照提示配置 DNS
4. 等待生效（几分钟到几小时）

## 🔗 Webhook URL

部署完成后，你的 Webhook URL 是：

```
https://random-bible-verse-generator.info/api/webhook
```

或者（如果还没配置域名）：

```
https://bible-ginginli.vercel.app/api/webhook
```

## 📧 在 Creem 配置 Webhook

### 步骤 1：登录 Creem Dashboard

访问：https://www.creem.io/dashboard

### 步骤 2：进入 Webhook 设置

1. 点击左侧菜单 "Settings" 或 "Webhooks"
2. 点击 "Add Webhook" 或 "New Endpoint"

### 步骤 3：填写 Webhook 信息

**Webhook URL：**
```
https://random-bible-verse-generator.info/api/webhook
```

**选择事件（Events to send）：**
勾选以下事件：
- ✅ `purchase.completed` - 购买完成
- ✅ `subscription.created` - 订阅创建
- ✅ `subscription.renewed` - 订阅续费
- ✅ `subscription.cancelled` - 订阅取消
- ✅ `subscription.expired` - 订阅过期
- ✅ `refund.completed` - 退款完成

### 步骤 4：保存并获取 Secret

1. 点击 "Save" 或 "Create"
2. Creem 会生成一个 Webhook Secret
3. 复制这个 Secret（类似：`whsec_abc123...`）
4. 添加到 Vercel 环境变量：`CREEM_WEBHOOK_SECRET`

### 步骤 5：测试 Webhook

1. 在 Creem Dashboard 找到 "Test Webhook" 按钮
2. 发送测试事件
3. 检查 Vercel 日志（Functions → Logs）
4. 应该看到 "Received webhook: test" 或类似信息

## 🧪 测试支付流程

### 完整测试步骤

1. **访问定价页面**
   ```
   https://random-bible-verse-generator.info/premium.html
   ```

2. **点击"Start Quarterly Plan"**
   - 跳转到 Creem 支付页面

3. **使用测试卡号**
   ```
   卡号：4242 4242 4242 4242
   过期日期：任意未来日期（如 12/25）
   CVC：任意 3 位数字（如 123）
   邮箱：你的测试邮箱
   ```

4. **完成支付**
   - Creem 会发送 Webhook 到你的服务器

5. **检查结果**
   - 查看 Vercel 日志
   - 检查 `automation/paid-subscribers.json` 文件
   - 应该看到新用户被添加

## 📊 查看 Webhook 日志

### 在 Vercel 查看

1. 进入项目 → Functions
2. 点击 `/api/webhook`
3. 查看 "Invocations" 和 "Logs"

### 在 Creem 查看

1. Creem Dashboard → Webhooks
2. 点击你的 Webhook
3. 查看 "Recent Deliveries"
4. 可以看到每次发送的状态（成功/失败）

## 🔧 常见问题

### Q1: Webhook 收不到？

**检查清单：**
- [ ] Vercel 部署成功了吗？
- [ ] Webhook URL 正确吗？
- [ ] Creem 中选择了正确的事件吗？
- [ ] 环境变量配置了吗？

**调试方法：**
```bash
# 查看 Vercel 日志
vercel logs

# 或在 Vercel Dashboard 查看
```

### Q2: Webhook 返回 500 错误？

**可能原因：**
- 环境变量缺失
- 代码错误
- 文件路径问题

**解决方法：**
1. 查看 Vercel 日志找到具体错误
2. 检查环境变量是否都配置了
3. 确保 `automation/` 文件夹都推送到 GitHub

### Q3: 如何测试 Webhook？

**方法 1：使用 Creem 测试功能**
- 在 Creem Dashboard 发送测试事件

**方法 2：使用真实支付（测试模式）**
- 使用测试卡号完成支付

**方法 3：使用 curl 手动测试**
```bash
curl -X POST https://your-domain.vercel.app/api/webhook \
  -H "Content-Type: application/json" \
  -d '{"type":"purchase.completed","data":{"customer_email":"test@example.com"}}'
```

### Q4: 如何查看付费用户列表？

**方法 1：在 GitHub 查看**
- 访问你的仓库
- 打开 `automation/paid-subscribers.json`

**方法 2：本地查看**
```bash
cat automation/paid-subscribers.json
```

**方法 3：创建管理页面（未来）**
- 可以创建一个简单的管理界面

## 📁 项目结构

```
bible/
├── api/
│   └── webhook.js          # Vercel Serverless Function
├── automation/
│   ├── creem-integration.js    # Webhook 处理逻辑
│   ├── email-subscription.js   # 邮件发送
│   ├── paid-subscribers.json   # 付费用户数据（自动生成）
│   └── subscribers.json        # 所有订阅者（自动生成）
├── vercel.json             # Vercel 配置
├── premium.html            # 定价页面
└── ...
```

## 🎯 Webhook 工作流程

```
1. 用户点击"购买" → Creem 支付页面
2. 用户完成支付 → Creem 收到钱
3. Creem 发送 Webhook → https://your-domain.vercel.app/api/webhook
4. Vercel Function 接收 → 调用 creem-integration.js
5. 处理事件 → 添加用户到 paid-subscribers.json
6. 发送欢迎邮件 → 用户收到确认
7. 第二天早上 8:00 → 自动发送第一封每日经文
```

## 🔐 安全建议

1. **验证 Webhook 签名**
   - 已在代码中实现
   - 使用 `CREEM_WEBHOOK_SECRET` 验证

2. **使用环境变量**
   - 不要在代码中硬编码密钥
   - 使用 Vercel 环境变量

3. **限制访问**
   - Webhook 端点只接受 POST 请求
   - 验证请求来源

## 📈 监控和维护

### 每周检查

- [ ] 查看 Vercel 日志，确保没有错误
- [ ] 检查 Creem Dashboard，确认支付正常
- [ ] 查看 `paid-subscribers.json`，确认用户添加正常

### 每月检查

- [ ] 查看 Vercel 使用量（免费额度足够）
- [ ] 检查邮件发送情况
- [ ] 回复用户反馈

## 🚀 下一步

1. **部署到 Vercel**
   - 按照上面步骤操作
   - 10 分钟完成

2. **配置 Creem Webhook**
   - 添加 Webhook URL
   - 选择事件
   - 保存 Secret

3. **测试支付**
   - 使用测试卡号
   - 确认 Webhook 收到
   - 检查用户添加成功

4. **配置邮件服务**
   - 获取 Resend API Key
   - 添加到 Vercel 环境变量
   - 测试邮件发送

5. **开始赚钱！** 💰

## 💡 专业提示

- Vercel 免费版足够个人项目使用
- Webhook 会自动重试失败的请求
- 保持代码简单，容易调试
- 定期备份 `paid-subscribers.json`

## 📞 需要帮助？

如果遇到问题：
1. 查看 Vercel 日志
2. 查看 Creem Webhook 日志
3. 检查环境变量配置
4. 联系我或查看文档

---

**准备好了吗？** 开始部署吧！🚀
