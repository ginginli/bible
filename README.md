# Random Bible Verse Generator

一个简洁高效的随机圣经经文生成器，支持图片生成和社交分享。

## 📋 项目概述

这是一个基于 Next.js 的随机圣经经文生成器，主要特点：

- ✨ **简洁界面**：专注核心功能，减少干扰
- 🎨 **图片生成**：一键生成精美图片，便于分享
- 📚 **多版本支持**：支持多种圣经译本（NIV, ESV, KJV, 中文和合本等）
- 🏷️ **主题分类**：20+ 主题筛选（Love, Hope, Faith, Peace 等）
- 📱 **移动优先**：响应式设计，随时随地使用
- 🚀 **性能优化**：快速加载，流畅交互

## 📖 设计文档

详细的设计思路和技术架构请查看：

- **[DESIGN.md](./DESIGN.md)** - 完整的设计思路文档
  - 项目定位与差异化策略
  - 功能设计（MVP + 扩展功能）
  - 用户体验流程
  - 视觉设计规范
  - SEO 策略
  - 开发计划

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - 技术架构文档
  - 系统架构图
  - 技术选型对比
  - 项目结构
  - 数据模型设计
  - 核心功能实现思路
  - 部署方案

## 🎯 核心功能

### MVP 功能

1. **随机经文生成**
   - 点击按钮随机生成一条圣经经文
   - 显示经文内容、章节出处
   - 支持快速刷新

2. **图片生成与分享**
   - 将经文转换为精美图片
   - 自定义样式（背景、文字、字体）
   - 一键分享到社交媒体

3. **主题筛选**
   - 20+ 主题分类
   - 按主题生成相关经文
   - 主题切换流畅

4. **多版本支持**
   - 支持 3-5 种主流译本
   - 版本切换实时更新

## 🛠️ 技术栈

### 推荐方案（MVP）

```
前端框架：Next.js 14 (App Router)
开发语言：TypeScript
UI 框架：React 18
样式方案：Tailwind CSS
状态管理：Zustand
图片生成：html2canvas
社交分享：react-share
部署平台：Vercel
```

## 📁 项目结构

```
bible/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React 组件
│   ├── data/             # 数据文件（JSON）
│   ├── lib/              # 工具函数
│   ├── hooks/            # 自定义 Hooks
│   └── store/            # 状态管理
├── DESIGN.md             # 设计文档
├── ARCHITECTURE.md       # 架构文档
└── README.md            # 项目说明
```

## 🚀 快速开始

### 1. 创建项目

```bash
npx create-next-app@latest bible-generator --typescript --tailwind --app
cd bible-generator
```

### 2. 安装依赖

```bash
npm install html2canvas react-share framer-motion zustand
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 📊 开发计划

### Phase 1: MVP（2-3 周）
- [x] 项目搭建
- [ ] 基础 UI 组件
- [ ] 随机生成功能
- [ ] 图片生成功能
- [ ] 主题筛选功能
- [ ] 多版本支持
- [ ] 响应式设计
- [ ] SEO 优化

### Phase 2: 优化（1-2 周）
- [ ] 每日经文功能
- [ ] 收藏功能
- [ ] 性能优化
- [ ] 用户反馈收集

### Phase 3: 扩展（持续）
- [ ] 搜索功能
- [ ] 用户账户（可选）
- [ ] API 开放（可选）

## 🎨 设计原则

1. **简洁优先** - 界面简洁，功能聚焦
2. **性能优先** - 快速加载，流畅交互
3. **移动优先** - 响应式设计，触摸友好
4. **SEO 优先** - 内容优化，技术 SEO
5. **用户价值优先** - 解决真实需求，持续改进

## 📝 参考资源

### 竞品分析
- [DailyVerses.net](https://dailyverses.net/random-bible-verse)
- [BibleVerseGenerator.com](https://bibleversegenerator.com)
- [BibleDice.com](https://www.bibledice.com)

### 数据来源
- [Bible API](https://api.bible/)
- GitHub 开源圣经数据

## 📄 License

MIT

---

**设计思路总结：**
打造一个**简洁、高效、美观**的随机圣经经文生成器，通过**图片生成**和**主题分类**实现差异化，通过**SEO 优化**和**社交分享**实现自然增长。

