# 技术架构设计

## 一、系统架构图

```
┌─────────────────────────────────────────────────────────┐
│                     用户层                                │
│  (浏览器 / 移动端)                                        │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   前端应用层                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  页面组件    │  │  功能组件    │  │  工具组件    │  │
│  │  - Home      │  │  - Generator │  │  - ImageGen  │  │
│  │  - Theme     │  │  - Theme     │  │  - Share     │  │
│  │  - About     │  │  - Version   │  │  - Cache     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
│  技术栈: Next.js + React + Tailwind CSS                  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   数据层                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  圣经数据    │  │  主题标签    │  │  用户数据    │  │
│  │  (JSON)      │  │  (JSON)      │  │  (LocalStorage)│ │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   服务层 (可选)                           │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │  API Routes  │  │  Serverless   │                    │
│  │  (Next.js)   │  │  Functions    │                    │
│  └──────────────┘  └──────────────┘                    │
└─────────────────────────────────────────────────────────┘
```

## 二、技术选型对比

### 方案 A: 纯前端方案（推荐 MVP）

```
优点：
✅ 开发快速，无需后端
✅ 部署简单（Vercel/Netlify）
✅ 成本低（免费托管）
✅ SEO 友好（Next.js SSR）

缺点：
❌ 数据需要打包到前端
❌ 无法做复杂的数据分析

适合：MVP 阶段，快速验证
```

**技术栈：**
- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- TypeScript
- 数据：JSON 文件

---

### 方案 B: 轻量后端方案

```
优点：
✅ 数据管理灵活
✅ 可以扩展功能（用户系统、API）
✅ 可以做数据分析

缺点：
❌ 需要维护后端
❌ 成本增加（数据库、服务器）

适合：需要用户系统、API 开放
```

**技术栈：**
- 前端：Next.js + React
- 后端：Node.js + Express / Python + FastAPI
- 数据库：PostgreSQL / MongoDB
- 部署：Vercel + Railway / Render

---

### 方案 C: Serverless 方案

```
优点：
✅ 按需付费，成本可控
✅ 自动扩展
✅ 无需管理服务器

缺点：
❌ 冷启动可能较慢
❌ 调试相对复杂

适合：需要动态功能但不想维护服务器
```

**技术栈：**
- Next.js (API Routes)
- Vercel Functions / AWS Lambda
- Supabase / Firebase (数据库)
- Vercel / AWS (部署)

---

## 三、推荐技术栈（方案 A）

### 核心框架

```json
{
  "framework": "Next.js 14",
  "language": "TypeScript",
  "styling": "Tailwind CSS",
  "ui": "React 18",
  "deployment": "Vercel"
}
```

### 依赖包

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "html2canvas": "^1.4.1",
    "react-share": "^4.4.0",
    "framer-motion": "^10.16.0",
    "zustand": "^4.4.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

---

## 四、项目结构

```
bible/
├── public/                 # 静态资源
│   ├── images/           # 图片资源
│   └── fonts/            # 字体文件
│
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── layout.tsx   # 根布局
│   │   ├── page.tsx     # 首页
│   │   ├── [theme]/     # 主题页面（动态路由）
│   │   └── api/         # API 路由（可选）
│   │
│   ├── components/       # React 组件
│   │   ├── VerseCard/   # 经文卡片
│   │   ├── Generator/   # 生成器组件
│   │   ├── ImageGen/    # 图片生成组件
│   │   ├── ThemeSelector/ # 主题选择器
│   │   ├── VersionSelector/ # 版本选择器
│   │   └── ShareButtons/ # 分享按钮
│   │
│   ├── data/            # 数据文件
│   │   ├── bible.json   # 圣经数据
│   │   ├── themes.json  # 主题标签
│   │   └── versions.json # 版本信息
│   │
│   ├── lib/             # 工具函数
│   │   ├── random.ts    # 随机算法
│   │   ├── filter.ts    # 筛选逻辑
│   │   ├── image.ts     # 图片生成
│   │   └── utils.ts     # 通用工具
│   │
│   ├── hooks/           # 自定义 Hooks
│   │   ├── useVerse.ts  # 经文相关
│   │   └── useImage.ts  # 图片相关
│   │
│   ├── store/           # 状态管理
│   │   └── verseStore.ts # Zustand store
│   │
│   └── styles/          # 样式文件
│       └── globals.css  # 全局样式
│
├── DESIGN.md            # 设计文档
├── ARCHITECTURE.md      # 架构文档
├── README.md           # 项目说明
├── package.json        # 依赖配置
├── tsconfig.json       # TypeScript 配置
├── tailwind.config.js  # Tailwind 配置
└── next.config.js      # Next.js 配置
```

---

## 五、数据模型设计

### 圣经数据模型

```typescript
interface BibleVerse {
  id: string;              // 唯一标识
  book: string;            // 书卷名（如 "John"）
  bookChinese?: string;    // 中文书卷名（如 "约翰福音"）
  chapter: number;         // 章节
  verse: number;           // 节数
  text: string;            // 经文内容
  version: string;          // 版本（NIV, ESV, KJV, CUV）
  topics: string[];        // 主题标签
}

// 示例
const verse: BibleVerse = {
  id: "john-3-16-niv",
  book: "John",
  bookChinese: "约翰福音",
  chapter: 3,
  verse: 16,
  text: "For God so loved the world that he gave his one and only Son...",
  version: "NIV",
  topics: ["love", "salvation", "faith", "Jesus"]
};
```

### 主题数据模型

```typescript
interface Theme {
  id: string;              // 主题 ID
  name: string;            // 主题名称
  nameChinese?: string;    // 中文名称
  description: string;     // 描述
  icon?: string;           // 图标
  color: string;           // 主题色
  verseCount: number;      // 相关经文数量
}

// 示例
const theme: Theme = {
  id: "love",
  name: "Love",
  nameChinese: "爱",
  description: "Bible verses about love",
  color: "#FF6B6B",
  verseCount: 150
};
```

### 版本数据模型

```typescript
interface BibleVersion {
  id: string;              // 版本 ID
  name: string;            // 版本名称
  abbreviation: string;    // 缩写
  language: string;         // 语言
  description: string;     // 描述
}

// 示例
const version: BibleVersion = {
  id: "niv",
  name: "New International Version",
  abbreviation: "NIV",
  language: "en",
  description: "A modern English translation"
};
```

---

## 六、核心功能实现思路

### 1. 随机生成算法

```typescript
// lib/random.ts
export function getRandomVerse(
  verses: BibleVerse[],
  theme?: string,
  version?: string
): BibleVerse {
  let filtered = verses;
  
  // 按主题筛选
  if (theme) {
    filtered = filtered.filter(v => v.topics.includes(theme));
  }
  
  // 按版本筛选
  if (version) {
    filtered = filtered.filter(v => v.version === version);
  }
  
  // 随机选择
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}
```

### 2. 图片生成

```typescript
// lib/image.ts
import html2canvas from 'html2canvas';

export async function generateVerseImage(
  verse: BibleVerse,
  options: {
    backgroundColor: string;
    textColor: string;
    font: string;
  }
): Promise<string> {
  // 创建临时 DOM 元素
  const element = document.createElement('div');
  element.innerHTML = `
    <div style="background: ${options.backgroundColor}; color: ${options.textColor};">
      <p>${verse.text}</p>
      <p>${verse.book} ${verse.chapter}:${verse.verse}</p>
    </div>
  `;
  
  // 转换为图片
  const canvas = await html2canvas(element);
  return canvas.toDataURL('image/png');
}
```

### 3. 状态管理

```typescript
// store/verseStore.ts
import { create } from 'zustand';

interface VerseState {
  currentVerse: BibleVerse | null;
  selectedTheme: string | null;
  selectedVersion: string;
  history: BibleVerse[];
  
  setVerse: (verse: BibleVerse) => void;
  setTheme: (theme: string | null) => void;
  setVersion: (version: string) => void;
  addToHistory: (verse: BibleVerse) => void;
}

export const useVerseStore = create<VerseState>((set) => ({
  currentVerse: null,
  selectedTheme: null,
  selectedVersion: 'niv',
  history: [],
  
  setVerse: (verse) => set({ currentVerse: verse }),
  setTheme: (theme) => set({ selectedTheme: theme }),
  setVersion: (version) => set({ selectedVersion: version }),
  addToHistory: (verse) => set((state) => ({
    history: [...state.history, verse]
  }))
}));
```

---

## 七、部署方案

### Vercel 部署（推荐）

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 部署
vercel

# 4. 生产环境部署
vercel --prod
```

**优势：**
- 自动 CI/CD
- 全球 CDN
- 免费 SSL
- 自动优化

### Netlify 部署（备选）

```bash
# 1. 安装 Netlify CLI
npm i -g netlify-cli

# 2. 登录
netlify login

# 3. 初始化
netlify init

# 4. 部署
netlify deploy --prod
```

---

## 八、性能优化策略

### 1. 数据优化

```
- 使用 JSON 压缩
- 按需加载数据（代码分割）
- 缓存策略（SWR/React Query）
```

### 2. 图片优化

```
- 使用 Next.js Image 组件
- WebP 格式
- 懒加载
- CDN 加速
```

### 3. 代码优化

```
- 代码分割（动态 import）
- Tree Shaking
- 压缩打包
- 预加载关键资源
```

### 4. SEO 优化

```
- 服务端渲染（SSR）
- Meta 标签优化
- 结构化数据（JSON-LD）
- Sitemap 生成
```

---

## 九、开发环境设置

### 快速开始

```bash
# 1. 创建 Next.js 项目
npx create-next-app@latest bible-generator --typescript --tailwind --app

# 2. 安装依赖
cd bible-generator
npm install html2canvas react-share framer-motion zustand

# 3. 启动开发服务器
npm run dev

# 4. 访问
# http://localhost:3000
```

### 环境变量

```env
# .env.local
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX  # Google Analytics (可选)
```

---

## 十、测试策略

### 单元测试

```typescript
// __tests__/random.test.ts
import { getRandomVerse } from '@/lib/random';

describe('getRandomVerse', () => {
  it('should return a random verse', () => {
    const verse = getRandomVerse(mockVerses);
    expect(verse).toBeDefined();
  });
  
  it('should filter by theme', () => {
    const verse = getRandomVerse(mockVerses, 'love');
    expect(verse.topics).toContain('love');
  });
});
```

### E2E 测试

```
- Playwright / Cypress
- 测试关键用户流程
- 跨浏览器测试
```

---

## 十一、监控与分析

### 工具集成

```
1. Google Analytics
   - 用户行为分析
   - 流量来源
   - 转化率

2. Vercel Analytics
   - 性能监控
   - Web Vitals
   - 错误追踪

3. Sentry (可选)
   - 错误监控
   - 性能监控
```

---

## 十二、总结

### 技术选型总结

```
✅ 前端：Next.js + React + TypeScript
✅ 样式：Tailwind CSS
✅ 状态：Zustand
✅ 部署：Vercel
✅ 数据：JSON 文件（MVP 阶段）

优势：
- 开发快速
- 部署简单
- 成本低
- SEO 友好
- 可扩展
```

### 下一步

1. ✅ 搭建项目基础结构
2. ✅ 准备圣经数据
3. ✅ 实现核心功能
4. ✅ 优化用户体验
5. ✅ 部署上线

