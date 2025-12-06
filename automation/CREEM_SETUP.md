# Creem.io 付费订阅设置指南

## 📋 最终定价方案

- **季付：** $7.99/3个月（$2.66/月）
- **年付：** $24.99/年（$2.08/月，节省 $7）
- **终身：** $79（一次性，最佳价值）

## 🚀 快速设置步骤

### 1. 在 Creem 创建产品

访问：https://www.creem.io/dashboard/products/new

#### 产品 1：季付订阅
```
产品名称：Daily Bible Verse - Quarterly
价格：$7.99
计费周期：每 3 个月
描述：Get daily Bible verses with AI-powered insights delivered to your inbox. Just $2.66/month!
```

#### 产品 2：年付订阅
```
产品名称：Daily Bible Verse - Annual
价格：$24.99
计费周期：每年
描述：Get daily Bible verses with AI insights. Save $7 compared to quarterly plan! Best value at $2.08/month.
```

#### 产品 3：终身访问
```
产品名称：Daily Bible Verse - Lifetime
价格：$79
计费周期：一次性
描述：Pay once, get lifetime access to daily Bible verses with AI insights and all future updates. Limited time offer!
```

### 2. 获取产品链接

创建产品后，Creem 会给你一个 Checkout 链接，类似：
```
https://creem.io/checkout/prod_abc123xyz
```

### 3. 更新网站链接

在 `premium.html` 中，替换这些链接：

```html
<!-- 季付 -->
<a href="https://creem.io/checkout/YOUR_QUARTERLY_PRODUCT_ID" ...>

<!-- 年付 -->
<a href="https://creem.io/checkout/YOUR_ANNUAL_PRODUCT_ID" ...>

<!-- 终身 -->
<a href="https://creem.io/checkout/YOUR_LIFETIME_PRODUCT_ID" ...>
```

### 4. 配置 Webhook

#### 4.1 获取 Webhook URL

你的 webhook 端点：
```
https://your-domain.com/api/webhooks/creem
```

如果使用本地测试，可以用 ngrok：
```bash
ngrok http 3000
# 会得到类似：https://abc123.ngrok.io
# Webhook URL: https://abc123.ngrok.io/api/webhooks/creem
```

#### 4.2 在 Creem Dashboard 设置 Webhook

1. 进入 Creem Dashboard → Settings → Webhooks
2. 添加新的 Webhook URL
3. 选择要监听的事件：
   - ✅ `purchase.completed`
   - ✅ `subscription.created`
   - ✅ `subscription.renewed`
   - ✅ `subscription.cancelled`
   - ✅ `subscription.expired`
   - ✅ `refund.completed`

4. 保存并复制 Webhook Secret

### 5. 配置环境变量

编辑 `automation/.env`：

```env
# Creem 配置
CREEM_API_KEY=your_creem_api_key_here
CREEM_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# 网站 URL
WEBSITE_URL=https://random-bible-verse-generator.info
```

### 6. 测试支付流程

#### 6.1 测试模式

Creem 提供测试模式，使用测试卡号：
```
卡号：4242 4242 4242 4242
过期日期：任意未来日期
CVC：任意 3 位数字
```

#### 6.2 测试步骤

1. 访问 `premium.html`
2. 点击 "Start Monthly Plan"
3. 使用测试卡号完成支付
4. 检查服务器日志，确认 webhook 收到
5. 验证用户被添加到 `paid-subscribers.json`

### 7. 启动服务

```bash
cd automation
npm install
npm run server  # 启动 API 服务器
```

另开终端：
```bash
npm run schedule  # 启动定时任务
```

## 📧 邮件发送逻辑

### 免费用户
- ❌ 不发送邮件
- ✅ 可以访问网站浏览经文

### 付费用户
- ✅ 每天早上 8:00 发送邮件
- ✅ AI 生成的深度解释
- ✅ 精美 PDF 下载链接
- ✅ 独家经文图片

## 🔄 用户流程

### 新用户订阅流程
```
1. 访问 premium.html
2. 选择计划（月付/年付/终身）
3. 点击按钮 → 跳转到 Creem 支付页面
4. 完成支付
5. Creem 发送 webhook 到你的服务器
6. 服务器自动添加用户到付费列表
7. 发送欢迎邮件
8. 第二天开始收到每日经文邮件
```

### 取消订阅流程
```
1. 用户在 Creem 取消订阅
2. Creem 发送 webhook
3. 服务器标记用户为非活跃
4. 停止发送邮件
5. 发送取消确认邮件
```

## 💰 收入追踪

### 查看付费用户
```bash
cd automation
cat paid-subscribers.json
```

### 统计数据
```javascript
// 在 Node.js 中运行
const { getPaidSubscribers } = require('./creem-integration');
const subscribers = getPaidSubscribers();

console.log('总付费用户:', subscribers.length);
console.log('活跃用户:', subscribers.filter(s => s.active).length);
```

## 🎯 营销建议

### 1. 早鸟优惠（可选）
在 `premium.html` 添加限时优惠横幅：

```html
<div style="background: linear-gradient(135deg, #FF6B6B, #FF8E53); color: white; padding: 1rem; text-align: center; font-weight: 600;">
    🎉 Early Bird Special: First 100 subscribers get 50% off! Use code EARLY50
</div>
```

### 2. 在网站添加 CTA

在 `index.html` 的显眼位置添加：

```html
<div style="background: #FFF9E6; padding: 2rem; border-radius: 16px; text-align: center; margin: 3rem 0;">
    <h3>📧 Get Daily Verses in Your Inbox</h3>
    <p>AI-powered insights delivered every morning</p>
    <a href="premium.html" class="btn-primary">Start for $2.99/month</a>
</div>
```

### 3. 社交证明

收集用户评价后添加到 `premium.html`：

```html
<section class="testimonials">
    <h2>What Our Subscribers Say</h2>
    <div class="testimonial">
        <p>"The AI explanations help me understand the verses on a deeper level!"</p>
        <span>- Sarah M.</span>
    </div>
</section>
```

## 🔧 故障排查

### Webhook 未收到
1. 检查服务器是否运行：`curl http://localhost:3000/health`
2. 检查 Creem Dashboard 的 Webhook 日志
3. 确认 URL 正确且可访问（使用 ngrok 测试）

### 用户支付了但未收到邮件
1. 检查 `paid-subscribers.json` 是否有该用户
2. 检查邮箱地址是否正确
3. 查看服务器日志
4. 手动运行：`npm run send-emails`

### 邮件进入垃圾箱
1. 配置 Resend 域名验证（SPF, DKIM）
2. 避免使用过多营销词汇
3. 确保有取消订阅链接

## 📊 成本分析

### 100 个付费用户（假设 60% 季付，30% 年付，10% 终身）
- 季付：60 人 × $7.99 × 4 次/年 = $1,918
- 年付：30 人 × $24.99 = $750
- 终身：10 人 × $79 = $790
- **年收入：$3,458**
- Creem 手续费（5%）：-$173
- Resend 邮件：$0（免费额度）
- OpenAI API：-$240/年
- **净利润：~$3,045/年**

### 扩展到 500 个用户
- 季付：300 人 × $7.99 × 4 = $9,588
- 年付：150 人 × $24.99 = $3,749
- 终身：50 人 × $79 = $3,950
- **年收入：$17,287**
- Creem 手续费：-$864
- Resend：-$240/年（Pro 计划）
- OpenAI：-$600/年
- **净利润：~$15,583/年**

## 🚀 下一步

1. ✅ 在 Creem 创建 3 个产品
2. ✅ 更新 `premium.html` 的链接
3. ✅ 配置 Webhook
4. ✅ 测试支付流程
5. ✅ 部署到生产环境
6. 📣 开始推广！

## 需要帮助？

- Creem 文档：https://docs.creem.io/
- Creem 支持：support@creem.io
- 我的邮箱：[你的邮箱]
