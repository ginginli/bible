# 圣经经文数据源指南

## 一、免费 API 服务

### 1. **Bible API** (推荐)
- **网址**: https://bible-api.com/
- **特点**: 
  - 完全免费，无需 API Key
  - 支持多种版本（KJV, NIV, ESV 等）
  - RESTful API，使用简单
  - 支持随机经文、按章节查询
  - ⚠️ **不支持按主题/类别查询**（需要自己实现）

**使用示例**:
```javascript
// 获取随机经文
fetch('https://bible-api.com/john%203:16')
  .then(response => response.json())
  .then(data => console.log(data));

// 返回格式:
{
  "reference": "John 3:16",
  "verses": [
    {
      "book_id": "JHN",
      "book_name": "John",
      "chapter": 3,
      "verse": 16,
      "text": "For God so loved the world..."
    }
  ],
  "text": "For God so loved the world...",
  "translation_id": "kjv",
  "translation_name": "King James Version",
  "translation_note": "Public Domain"
}
```

### 2. **API.Bible**
- **网址**: https://api.bible/
- **特点**:
  - 官方 API，数据权威
  - 需要注册获取 API Key（免费）
  - 支持 2000+ 种语言和版本
  - 功能强大，文档完善

**注册**: https://scripture.api.bible/

### 3. **Bible Gateway API**
- **网址**: https://www.biblegateway.com/
- **特点**:
  - 需要申请 API 访问
  - 数据质量高
  - 支持多种版本

---

## 二、GitHub 开源数据

### 1. **Bible-Database** ⭐ 推荐
- **GitHub**: https://github.com/scrollmapper/bible_databases
- **格式**: SQL, XML, JSON
- **语言**: 18+ 种语言
- **特点**:
  - 完全开源
  - 多种格式可选
  - 包含多个版本

**下载方式**:
```bash
git clone https://github.com/scrollmapper/bible_databases.git
```

### 2. **bible-corpus**
- **GitHub**: https://github.com/christos-c/bible-corpus
- **格式**: XML, JSON
- **特点**:
  - 多语言平行语料库
  - 句子级别对齐
  - 适合 NLP 任务

### 3. **bible-json**
- **GitHub**: https://github.com/thiagobodruk/bible
- **格式**: JSON
- **特点**:
  - 纯 JSON 格式
  - 结构清晰
  - 易于使用

### 4. **Chinese Bible (和合本)**
- **GitHub**: https://github.com/godlytalias/Bible-Database
- **格式**: SQL, JSON
- **特点**:
  - 中文和合本
  - 包含简体/繁体
  - 数据库格式

---

## 三、直接下载的数据文件

### 1. **Open English Bible**
- **网址**: https://openenglishbible.org/
- **特点**: 
  - 公共领域（Public Domain）
  - 可自由使用
  - 提供 JSON/XML 格式

### 2. **World English Bible (WEB)**
- **网址**: https://worldenglish.bible/
- **特点**:
  - 公共领域
  - 免费使用
  - 提供电子文本

### 3. **King James Version (KJV)**
- **特点**:
  - 公共领域（版权已过期）
  - 可自由使用
  - 多种格式可用

---

## 四、推荐方案对比

### 方案 A: 使用 API（适合动态加载）

**优点**:
- ✅ 数据实时更新
- ✅ 不需要存储大量数据
- ✅ 支持多种版本切换
- ✅ 可以获取随机经文

**缺点**:
- ❌ 需要网络连接
- ❌ 可能有请求限制
- ❌ 加载速度依赖网络

**适用场景**: 
- 需要多版本支持
- 数据量要求大
- 可以接受网络请求

**推荐 API**: Bible API (bible-api.com) - 最简单

---

### 方案 B: 使用 JSON 文件（适合静态网站）

**优点**:
- ✅ 离线可用
- ✅ 加载速度快
- ✅ 完全控制数据
- ✅ 无 API 限制

**缺点**:
- ❌ 文件较大（可能需要压缩）
- ❌ 需要手动更新数据
- ❌ 版本切换需要多个文件

**适用场景**:
- 纯前端项目
- 需要离线功能
- 数据量适中（几千条经文）

**推荐数据源**: 
- GitHub: scrollmapper/bible_databases
- 或自己整理 JSON 文件

---

## 五、快速开始指南

### 方案 1: 使用 Bible API（最简单）

```javascript
// 在你的 HTML 中添加
async function fetchRandomVerse() {
  // 获取随机书卷和章节
  const books = ['john', 'psalms', 'proverbs', 'romans', 'corinthians'];
  const book = books[Math.floor(Math.random() * books.length)];
  const chapter = Math.floor(Math.random() * 20) + 1;
  const verse = Math.floor(Math.random() * 30) + 1;
  
  try {
    const response = await fetch(
      `https://bible-api.com/${book}%20${chapter}:${verse}`
    );
    const data = await response.json();
    
    return {
      text: data.text,
      reference: data.reference,
      version: data.translation_name
    };
  } catch (error) {
    console.error('Error fetching verse:', error);
    return null;
  }
}

// 使用
fetchRandomVerse().then(verse => {
  if (verse) {
    document.getElementById('verseText').textContent = verse.text;
    document.getElementById('verseReference').textContent = verse.reference;
  }
});
```

### 方案 2: 使用本地 JSON 文件

1. **下载数据**:
```bash
# 从 GitHub 下载
git clone https://github.com/scrollmapper/bible_databases.git
# 或直接下载 JSON 文件
```

2. **整理数据格式**:
```json
// bible-data.json
{
  "verses": [
    {
      "id": "john-3-16",
      "book": "John",
      "bookChinese": "约翰福音",
      "chapter": 3,
      "verse": 16,
      "text": "For God so loved the world that he gave his one and only Son...",
      "version": "NIV",
      "topics": ["love", "salvation", "faith"]
    }
    // ... 更多经文
  ]
}
```

3. **在 HTML 中使用**:
```javascript
// 加载 JSON 文件
fetch('bible-data.json')
  .then(response => response.json())
  .then(data => {
    const verses = data.verses;
    // 随机选择
    const randomVerse = verses[Math.floor(Math.random() * verses.length)];
    // 显示经文
    displayVerse(randomVerse);
  });
```

---

## 六、数据格式建议

### 推荐的 JSON 结构

```json
{
  "metadata": {
    "version": "1.0",
    "lastUpdated": "2025-01-01",
    "totalVerses": 31102
  },
  "versions": [
    {
      "id": "niv",
      "name": "New International Version",
      "language": "en"
    },
    {
      "id": "kjv",
      "name": "King James Version",
      "language": "en"
    }
  ],
  "verses": [
    {
      "id": "john-3-16-niv",
      "book": "John",
      "bookAbbr": "JHN",
      "bookNumber": 43,
      "chapter": 3,
      "verse": 16,
      "text": "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
      "version": "niv",
      "topics": ["love", "salvation", "faith", "Jesus", "eternal life"]
    }
  ],
  "topics": {
    "love": ["john-3-16-niv", "1cor-13-4-niv", ...],
    "faith": ["hebrews-11-1-niv", ...],
    "hope": ["romans-15-13-niv", ...]
  }
}
```

---

## 七、版权注意事项

### 公共领域版本（可自由使用）
- ✅ King James Version (KJV) - 1611 年版
- ✅ World English Bible (WEB)
- ✅ Open English Bible (OEB)
- ✅ 中文和合本（1919 年版）

### 需要授权的版本
- ⚠️ New International Version (NIV) - 需要授权
- ⚠️ English Standard Version (ESV) - 需要授权
- ⚠️ New Living Translation (NLT) - 需要授权

**建议**: 
- MVP 阶段使用公共领域版本（KJV, WEB）
- 生产环境如需使用受版权保护的版本，需要联系版权方获取授权

---

## 八、实际实施建议

### 对于你的 HTML 项目

**推荐方案**: 
1. **开发阶段**: 使用 Bible API 快速开发
2. **生产阶段**: 
   - 选项 A: 继续使用 API（如果允许）
   - 选项 B: 下载 KJV 或 WEB 版本 JSON 文件，本地使用

**具体步骤**:

1. **立即开始**（使用 API）:
```javascript
// 修改 index.html 中的 generateVerse 函数
async function generateVerse() {
  const books = ['john', 'psalms', 'proverbs', 'romans', '1corinthians', 
                 'philippians', 'colossians', '1peter', 'james', 'hebrews'];
  const book = books[Math.floor(Math.random() * books.length)];
  const chapter = Math.floor(Math.random() * 20) + 1;
  const verse = Math.floor(Math.random() * 30) + 1;
  
  try {
    const response = await fetch(
      `https://bible-api.com/${book}%20${chapter}:${verse}?translation=web`
    );
    const data = await response.json();
    
    document.getElementById('verseText').textContent = `"${data.text}"`;
    document.getElementById('verseReference').textContent = data.reference;
  } catch (error) {
    console.error('Error:', error);
    // 回退到本地数据
    generateVerseLocal();
  }
}
```

2. **后续优化**（使用本地 JSON）:
   - 从 GitHub 下载 KJV 或 WEB 版本
   - 整理成你需要的 JSON 格式
   - 添加主题标签
   - 压缩文件（如果太大）

---

## 九、资源链接汇总

### API 服务
- https://bible-api.com/ (最简单，推荐)
- https://api.bible/ (功能强大，需注册)
- https://www.biblegateway.com/ (需申请)

### GitHub 数据源
- https://github.com/scrollmapper/bible_databases
- https://github.com/christos-c/bible-corpus
- https://github.com/thiagobodruk/bible
- https://github.com/godlytalias/Bible-Database (中文)

### 公共领域版本
- https://worldenglish.bible/
- https://openenglishbible.org/

---

## 十、主题分类功能说明

### ⚠️ 重要发现

**bible-api.com 不支持按主题/类别查询**

大多数免费的圣经 API（包括 bible-api.com）都**不支持**按主题、类别或标签查询经文。它们只支持：
- 按书卷查询（如 John）
- 按章节查询（如 John 3）
- 按具体经文查询（如 John 3:16）
- 随机经文查询

### 解决方案

要实现按主题查询，你需要：

#### 方案 A: 自己维护主题标签（推荐）

1. **获取经文数据**（从 API 或 JSON 文件）
2. **手动或半自动添加主题标签**
3. **在前端实现筛选功能**

**示例数据结构**:
```json
{
  "verses": [
    {
      "id": "john-3-16",
      "book": "John",
      "chapter": 3,
      "verse": 16,
      "text": "For God so loved the world...",
      "topics": ["love", "salvation", "faith", "Jesus", "eternal life"]
    },
    {
      "id": "1cor-13-4",
      "book": "1 Corinthians",
      "chapter": 13,
      "verse": 4,
      "text": "Love is patient, love is kind...",
      "topics": ["love", "relationships", "character", "patience"]
    }
  ]
}
```

**实现筛选**:
```javascript
function getVersesByTopic(verses, topic) {
  return verses.filter(verse => verse.topics.includes(topic));
}

// 使用
const loveVerses = getVersesByTopic(allVerses, "love");
const randomLoveVerse = loveVerses[Math.floor(Math.random() * loveVerses.length)];
```

#### 方案 B: 使用预分类的数据集

一些 GitHub 项目可能包含已分类的经文数据，但需要：
- 搜索 GitHub 上的相关项目
- 检查数据质量和完整性
- 可能需要自己整理和验证

#### 方案 C: 使用关键词搜索（有限支持）

虽然不能直接按主题查询，但可以通过：
1. 使用 API 获取大量经文
2. 在前端进行关键词匹配
3. 根据关键词匹配结果筛选

**示例**:
```javascript
const topicKeywords = {
  "love": ["love", "loved", "loving", "beloved"],
  "faith": ["faith", "believe", "belief", "trust"],
  "hope": ["hope", "hopeful", "hoping"]
};

function matchTopic(text, topic) {
  const keywords = topicKeywords[topic] || [];
  const lowerText = text.toLowerCase();
  return keywords.some(keyword => lowerText.includes(keyword));
}
```

### 常见主题列表

建议支持的主题：
- Love (爱)
- Faith (信心)
- Hope (盼望)
- Peace (平安)
- Strength (力量)
- Courage (勇气)
- Forgiveness (饶恕)
- Gratitude (感恩)
- Prayer (祷告)
- Wisdom (智慧)
- Trust (信靠)
- Salvation (救恩)
- Healing (医治)
- Comfort (安慰)
- Encouragement (鼓励)

### 实施建议

1. **MVP 阶段**:
   - 先实现基础随机生成
   - 手动整理 50-100 条热门经文
   - 为这些经文添加主题标签
   - 实现主题筛选功能

2. **扩展阶段**:
   - 逐步增加经文数量
   - 完善主题标签系统
   - 考虑使用 AI 辅助分类（可选）

3. **数据来源**:
   - 从 bible-api.com 获取经文文本
   - 自己添加主题标签
   - 存储为本地 JSON 文件

---

## 十一、快速决策树

```
需要实时数据？
├─ 是 → 使用 Bible API (bible-api.com)
│
└─ 否 → 需要离线功能？
    ├─ 是 → 下载 JSON 文件（GitHub）
    │
    └─ 否 → 需要多版本？
        ├─ 是 → 使用 API.Bible (需注册)
        │
        └─ 否 → 使用本地 JSON 文件
```

**我的推荐**: 
- **MVP/开发**: Bible API (bible-api.com) - 零配置，立即可用
- **生产环境**: 下载 KJV 或 WEB 的 JSON 文件，本地使用

