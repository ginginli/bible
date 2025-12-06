# 邮件订阅系统设置指南

## 功能概述

用户可以订阅每日圣经经文邮件，系统会自动：
1. 收集用户邮箱
2. 每天定时发送精选经文 + 解释
3. 支持取消订阅

## 快速开始

### 1. 安装依赖

```bash
cd automation
npm install
```

### 2. 配置邮件服务（Resend - 推荐）

#### 为什么选择 Resend？
- 免费额度：100 封/天（足够个人使用）
- 简单易用的 API
- 无需信用卡即可开始
- 优秀的送达率

#### 获取 Resend API Key

1. 访问 https://resend.com/
2. 注册账号（免费）
3. 进入 Dashboard
4. 点击 "API Keys"
5. 创建新的 API Key
6. 复制 API Key

#### 配置域名（可选，提高送达率）

如果你有自己的域名：
1. 在 Resend Dashboard 添加域名
2. 添加 DNS 记录（SPF, DKIM）
3. 验证域名

没有域名也可以使用，但会显示 "via resend.dev"

### 3. 配置环境变量

复制 `.env.example` 为 `.env`：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# 邮件配置
RESEND_API_KEY=re_123456789  # 你的 Resend API Key
EMAIL_FROM=Daily Verse <noreply@random-bible-verse-generator.info>
PORT=3000

# 网站配置
WEBSITE_URL=https://random-bible-verse-generator.info
BIBLE_VERSE_PAGE=https://random-bible-verse-generator.info/bible-verse-of-the-day.html
```

### 4. 启动订阅服务器

```bash
npm run server
```

服务器会在 http://localhost:3000 启动

### 5. 测试订阅功能

打开浏览器访问：
- 订阅页面：`http://localhost:3000/../subscribe.html`
- 或直接打开项目根目录的 `subscribe.html`

输入邮箱测试订阅。

### 6. 手动发送测试邮件

```bash
npm run send-emails
```

这会给所有订阅者发送今日经文邮件。

## 部署方案

### 方案 1: Vercel + Vercel Cron（推荐）

**优点：** 完全免费，自动部署
**步骤：**

1. 安装 Vercel CLI：
```bash
npm i -g vercel
```

2. 创建 `vercel.json`：
```json
{
  "functions": {
    "api/subscribe.js": {
      "memory": 1024,
      "maxDuration": 10
    }
  },
  "crons": [{
    "path": "/api/send-daily-emails",
    "schedule": "0 8 * * *"
  }]
}
```

3. 部署：
```bash
vercel
```

4. 在 Vercel Dashboard 设置环境变量

### 方案 2: Railway（简单）

**优点：** 支持后台服务，免费额度充足

1. 访问 https://railway.app/
2. 连接 GitHub 仓库
3. 设置环境变量
4. 自动部署

### 方案 3: VPS（完全控制）

使用 PM2 管理进程：

```bash
# 安装 PM2
npm install -g pm2

# 启动服务器
pm2 start subscription-server.js --name bible-subscription

# 启动定时任务
pm2 start scheduler.js --name bible-cron

# 保存配置
pm2 save

# 开机自启
pm2 startup
```

## 定时发送邮件

### 方法 1: 使用 node-cron（本地/VPS）

更新 `scheduler.js`：

```javascript
const cron = require('node-cron');
const { sendDailyEmails } = require('./email-subscription');

// 每天早上 8:00 发送
cron.schedule('0 8 * * *', async () => {
    console.log('Running daily email job...');
    await sendDailyEmails();
});

console.log('Email scheduler started');
```

运行：
```bash
npm run schedule
```

### 方法 2: GitHub Actions（免费）

创建 `.github/workflows/daily-email.yml`：

```yaml
name: Send Daily Emails

on:
  schedule:
    - cron: '0 8 * * *'  # UTC 8:00
  workflow_dispatch:

jobs:
  send-emails:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd automation && npm install
      - run: cd automation && npm run send-emails
        env:
          RESEND_API_KEY: ${{ secrets.RESEND_API_KEY }}
          WEBSITE_URL: https://random-bible-verse-generator.info
```

在 GitHub 仓库设置 Secrets：
- `RESEND_API_KEY`

## 集成到现有网站

### 1. 在首页添加订阅按钮

在 `index.html` 的导航栏或页脚添加：

```html
<a href="subscribe.html" class="btn-primary">📧 Subscribe to Daily Verses</a>
```

### 2. 在页脚添加订阅表单

```html
<div class="footer-subscribe">
    <h3>Get Daily Inspiration</h3>
    <form id="footerSubscribeForm">
        <input type="email" placeholder="Your email" required>
        <button type="submit">Subscribe</button>
    </form>
</div>
```

### 3. 添加弹窗订阅（可选）

在用户访问一段时间后显示订阅弹窗。

## 数据管理

### 查看订阅者

订阅者数据存储在 `automation/subscribers.json`：

```json
{
  "subscribers": [
    {
      "email": "user@example.com",
      "subscribedAt": "2024-01-01T08:00:00.000Z",
      "active": true
    }
  ]
}
```

### 导出订阅者列表

```bash
cd automation
node -e "console.log(require('./subscribers.json').subscribers.filter(s => s.active).map(s => s.email).join('\n'))"
```

### 备份数据

定期备份 `subscribers.json` 文件。

## 自定义邮件内容

### 修改邮件模板

编辑 `email-subscription.js` 中的 `generateEmailHTML()` 函数。

### 添加 AI 生成的解释

集成 OpenAI API：

```javascript
async function generateAIExplanation(verse) {
    const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
            model: 'gpt-3.5-turbo',
            messages: [{
                role: 'user',
                content: `Provide a brief, inspiring explanation of this Bible verse: "${verse.text}" (${verse.reference})`
            }]
        },
        {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        }
    );
    
    return response.data.choices[0].message.content;
}
```

## 监控和分析

### 添加邮件打开追踪

在邮件中添加追踪像素：

```html
<img src="https://your-domain.com/track/open?email=${email}&date=${date}" width="1" height="1" />
```

### 记录发送日志

```javascript
const logFile = path.join(__dirname, 'email-logs.json');

function logEmailSend(email, success, error = null) {
    const logs = JSON.parse(fs.readFileSync(logFile, 'utf8'));
    logs.push({
        email,
        success,
        error,
        timestamp: new Date().toISOString()
    });
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
}
```

## 故障排查

### 邮件发送失败

1. 检查 API Key 是否正确
2. 确认免费额度未用完
3. 查看 Resend Dashboard 的日志
4. 检查邮箱地址格式

### 订阅者收不到邮件

1. 检查垃圾邮件文件夹
2. 验证域名配置（如果使用自定义域名）
3. 确认邮箱地址正确

### 服务器无法启动

1. 检查端口 3000 是否被占用
2. 确认所有依赖已安装
3. 查看错误日志

## 成本估算

- **Resend 免费版：** 100 封/天 = 3000 封/月（免费）
- **Resend Pro：** $20/月 = 50,000 封/月
- **VPS（可选）：** $5-10/月
- **GitHub Actions：** 免费

对于个人项目，完全免费方案足够使用。

## 安全建议

1. 不要将 `.env` 文件提交到 Git
2. 使用环境变量存储敏感信息
3. 实现邮箱验证（双重确认）
4. 添加 CAPTCHA 防止滥用
5. 限制订阅频率（防止同一邮箱重复订阅）

## 下一步优化

- [ ] 添加邮箱验证（发送确认邮件）
- [ ] 支持用户选择接收时间
- [ ] 添加邮件模板选择
- [ ] 集成 AI 生成个性化解释
- [ ] 添加统计分析面板
- [ ] 支持多语言邮件
- [ ] 添加社交分享按钮

## 需要帮助？

如有问题，请查看：
- Resend 文档：https://resend.com/docs
- Node.js Cron：https://www.npmjs.com/package/node-cron
- Express.js：https://expressjs.com/
