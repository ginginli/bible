# ⏰ 时区配置说明

## 当前设置

**默认发送时间：美国东部时间早上 8:00**

## 美国时区说明

美国有 4 个主要时区：

| 时区 | 缩写 | UTC 偏移 | 主要城市 |
|------|------|----------|----------|
| 东部时间 | EST/EDT | UTC-5/-4 | 纽约、华盛顿、迈阿密 |
| 中部时间 | CST/CDT | UTC-6/-5 | 芝加哥、达拉斯、休斯顿 |
| 山地时间 | MST/MDT | UTC-7/-6 | 丹佛、凤凰城 |
| 太平洋时间 | PST/PDT | UTC-8/-7 | 洛杉矶、旧金山、西雅图 |

**注意：** 美国实行夏令时（3月-11月），时间会提前 1 小时。

## Cron 时间配置

### 当前配置（美国东部时间 8:00 AM）

```env
CRON_SCHEDULE=0 12 * * *
```

这表示：
- **夏令时（EDT，3月-11月）：** UTC 12:00 = 美东 8:00 AM
- **标准时间（EST，11月-3月）：** UTC 13:00 = 美东 8:00 AM

**推荐使用 12:00 UTC**，因为大部分时间是夏令时。

### 其他美国时区配置

#### 美国中部时间 8:00 AM (CST/CDT)
```env
CRON_SCHEDULE=0 13 * * *  # 夏令时
# 或
CRON_SCHEDULE=0 14 * * *  # 标准时间
```

#### 美国太平洋时间 8:00 AM (PST/PDT)
```env
CRON_SCHEDULE=0 15 * * *  # 夏令时
# 或
CRON_SCHEDULE=0 16 * * *  # 标准时间
```

## 如何更改发送时间

### 方法 1：修改环境变量

编辑 `automation/.env` 文件：

```env
# 美东 8:00 AM
CRON_SCHEDULE=0 12 * * *

# 美东 7:00 AM
CRON_SCHEDULE=0 11 * * *

# 美东 9:00 AM
CRON_SCHEDULE=0 13 * * *
```

### 方法 2：使用时区库（推荐生产环境）

安装时区库：
```bash
npm install node-cron-tz
```

修改 `scheduler.js`：
```javascript
const cron = require('node-cron-tz');

// 直接使用美国东部时区
cron.schedule('0 8 * * *', async () => {
    // 任务代码
}, {
    timezone: "America/New_York"
});
```

## Cron 表达式说明

格式：`分钟 小时 日期 月份 星期`

```
┌───────────── 分钟 (0 - 59)
│ ┌───────────── 小时 (0 - 23)
│ │ ┌───────────── 日期 (1 - 31)
│ │ │ ┌───────────── 月份 (1 - 12)
│ │ │ │ ┌───────────── 星期 (0 - 7, 0 和 7 都是周日)
│ │ │ │ │
* * * * *
```

### 常用示例

```bash
# 每天 8:00 AM (UTC)
0 8 * * *

# 每天 8:00 AM 和 8:00 PM (UTC)
0 8,20 * * *

# 工作日 8:00 AM (UTC)
0 8 * * 1-5

# 每周一 8:00 AM (UTC)
0 8 * * 1

# 每月 1 号 8:00 AM (UTC)
0 8 1 * *

# 每 6 小时
0 */6 * * *
```

## 验证当前时间

### 检查服务器时间
```bash
date
# 输出：Thu Dec  6 12:00:00 UTC 2024

# 查看时区
date +%Z
# 输出：UTC
```

### 在代码中检查
```javascript
console.log('Server time:', new Date().toISOString());
console.log('Server timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone);

// 转换为美东时间
const usEastern = new Date().toLocaleString('en-US', { 
    timeZone: 'America/New_York' 
});
console.log('US Eastern time:', usEastern);
```

## 部署平台时区

不同平台的默认时区：

| 平台 | 默认时区 | 可修改 |
|------|----------|--------|
| Heroku | UTC | ✅ |
| Railway | UTC | ✅ |
| Vercel | UTC | ❌ |
| AWS EC2 | UTC | ✅ |
| DigitalOcean | UTC | ✅ |
| GitHub Actions | UTC | ❌ |

**建议：** 始终使用 UTC 时间 + Cron 表达式，避免时区混乱。

## 测试定时任务

### 手动触发
```bash
cd automation
npm run send-emails
```

### 测试 Cron 表达式
使用在线工具：https://crontab.guru/

输入：`0 12 * * *`
结果：`At 12:00 PM (noon)`

### 查看下次执行时间
```javascript
const cron = require('node-cron');

const task = cron.schedule('0 12 * * *', () => {
    console.log('Task running');
});

// 不会直接显示下次执行时间，需要自己计算
```

## 常见问题

### Q: 为什么邮件发送时间不准确？
A: 检查：
1. 服务器时区是否为 UTC
2. Cron 表达式是否正确
3. 服务器是否正常运行

### Q: 夏令时切换时会怎样？
A: 如果使用 UTC 时间，需要手动调整 Cron 表达式。建议使用 `node-cron-tz` 库自动处理。

### Q: 如何同时支持多个时区？
A: 创建多个 Cron 任务：
```javascript
// 美东 8:00 AM
cron.schedule('0 12 * * *', () => sendToEasternUsers());

// 美西 8:00 AM  
cron.schedule('0 15 * * *', () => sendToWesternUsers());
```

## 推荐配置

### 生产环境（推荐）
```javascript
const cron = require('node-cron-tz');

cron.schedule('0 8 * * *', async () => {
    await sendDailyEmails();
}, {
    timezone: "America/New_York"
});
```

### 简单配置（当前）
```javascript
// .env
CRON_SCHEDULE=0 12 * * *  // UTC 12:00 = 美东 8:00 AM (夏令时)
```

## 时区转换速查表

| 美东时间 | UTC (夏令时) | UTC (标准时间) |
|----------|--------------|----------------|
| 6:00 AM  | 10:00        | 11:00          |
| 7:00 AM  | 11:00        | 12:00          |
| 8:00 AM  | 12:00        | 13:00          |
| 9:00 AM  | 13:00        | 14:00          |
| 10:00 AM | 14:00        | 15:00          |

**当前配置：** UTC 12:00 = 美东 8:00 AM（夏令时期间）

---

需要更改时间？修改 `.env` 中的 `CRON_SCHEDULE` 即可！
