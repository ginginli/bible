# Pinterest 自动化发布方案

## 方案概述

使用 Node.js + Puppeteer + Pinterest API 实现每日自动生成圣经经文图片并发布到 Pinterest。

## 前置要求

1. **Pinterest API 访问权限**
   - 访问 [Pinterest Developers](https://developers.pinterest.com/)
   - 创建应用并获取 Access Token
   - 获取 Board ID

2. **Node.js 环境**
   - Node.js 14+ 
   - npm 或 yarn

3. **服务器或云服务**
   - 需要 24/7 运行的服务器
   - 推荐：VPS、AWS EC2、Google Cloud、Heroku、Railway

## 安装步骤

### 1. 安装依赖

```bash
cd automation
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填写：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
PINTEREST_ACCESS_TOKEN=your_pinterest_access_token_here
PINTEREST_BOARD_ID=your_pinterest_board_id_here
WEBSITE_URL=https://random-bible-verse-generator.info
BIBLE_VERSE_PAGE=https://random-bible-verse-generator.info/bible-verse-of-the-day.html
CRON_SCHEDULE=0 8 * * *  # 每天上午 8:00
```

### 3. 获取 Pinterest API 凭证

#### 步骤 A: 创建 Pinterest 应用
1. 访问 https://developers.pinterest.com/apps/
2. 点击 "Create app"
3. 填写应用信息
4. 获取 App ID 和 App Secret

#### 步骤 B: 获取 Access Token
1. 使用 OAuth 2.0 流程获取用户授权
2. 或使用 Pinterest API Explorer 生成测试 token
3. 将 token 填入 `.env` 文件

#### 步骤 C: 获取 Board ID
1. 在 Pinterest 创建 Board（如 "Daily Bible Verses"）
2. Board ID 在 Board URL 中：`pinterest.com/username/board-name/`
3. 或通过 API 获取：`GET /v5/boards`

## 使用方法

### 手动运行一次

```bash
npm start
```

### 启动定时任务（后台运行）

```bash
npm run schedule
```

### 使用 PM2 管理（推荐生产环境）

```bash
# 安装 PM2
npm install -g pm2

# 启动
pm2 start scheduler.js --name pinterest-automation

# 查看状态
pm2 status

# 查看日志
pm2 logs pinterest-automation

# 设置开机自启
pm2 startup
pm2 save
```

## 部署选项

### 选项 1: VPS 服务器（推荐）

**优点：** 完全控制，成本低
**缺点：** 需要维护

**步骤：**
1. 租用 VPS（如 DigitalOcean, Linode, Vultr）
2. 安装 Node.js
3. 上传代码
4. 使用 PM2 运行

### 选项 2: Railway / Render

**优点：** 简单，免费额度
**缺点：** 免费版有限制

**步骤：**
1. 注册 Railway 或 Render
2. 连接 GitHub 仓库
3. 设置环境变量
4. 自动部署

### 选项 3: GitHub Actions（免费）

**优点：** 完全免费
**缺点：** 需要 GitHub 仓库

创建 `.github/workflows/pinterest.yml`：

```yaml
name: Daily Pinterest Post

on:
  schedule:
    - cron: '0 8 * * *'  # 每天 UTC 8:00
  workflow_dispatch:  # 允许手动触发

jobs:
  post:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd automation && npm install
      - run: cd automation && npm start
        env:
          PINTEREST_ACCESS_TOKEN: ${{ secrets.PINTEREST_ACCESS_TOKEN }}
          PINTEREST_BOARD_ID: ${{ secrets.PINTEREST_BOARD_ID }}
          WEBSITE_URL: https://random-bible-verse-generator.info
```

## 故障排查

### 常见问题

1. **Puppeteer 安装失败**
   ```bash
   # 安装系统依赖（Ubuntu/Debian）
   sudo apt-get install -y \
     chromium-browser \
     libnss3 \
     libatk-bridge2.0-0 \
     libdrm2 \
     libxkbcommon0 \
     libxcomposite1 \
     libxdamage1 \
     libxrandr2 \
     libgbm1 \
     libxss1 \
     libasound2
   ```

2. **Pinterest API 错误**
   - 检查 Access Token 是否有效
   - 确认 Board ID 正确
   - 检查 API 权限

3. **图片生成失败**
   - 确保网站可访问
   - 检查网络连接
   - 增加等待时间

## 成本估算

- **VPS**: $5-10/月
- **Railway/Render**: 免费额度通常足够
- **GitHub Actions**: 完全免费（2000 分钟/月）

## 安全建议

1. 不要将 `.env` 文件提交到 Git
2. 使用环境变量或密钥管理服务
3. 定期更新依赖包
4. 监控 API 使用量

## 扩展功能

- 添加错误通知（Email/Slack）
- 支持多个 Pinterest Board
- 添加图片缓存
- 支持其他社交媒体平台

