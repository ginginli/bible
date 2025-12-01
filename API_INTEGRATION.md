# Bible API 集成说明

## ✅ 已完成的集成

### 1. API 接入
- ✅ 使用 `bible-api.com` 获取真实经文数据
- ✅ 支持随机经文生成
- ✅ 支持多种翻译版本（默认：WEB 英文版）
- ✅ 错误处理和备用方案

### 2. 实现方式

**主要方法**：使用参数化 API 的随机端点
```
GET https://bible-api.com/data/{translation}/random
```

**备用方法**：随机选择书卷、章节和节数
```
GET https://bible-api.com/{book} {chapter}:{verse}?translation={translation}
```

**最终备用**：使用本地示例数据（如果 API 失败）

### 3. 支持的翻译版本

- `web` - World English Bible (默认，英文)
- `kjv` - King James Version (英文)
- `cuv` - Chinese Union Version (中文和合本)
- 更多版本见 [bible-api.com](https://bible-api.com/)

## 🧪 测试方法

### 1. 本地测试

```bash
# 方法 1: 直接打开文件
open index.html

# 方法 2: 使用本地服务器（推荐，避免 CORS 问题）
python -m http.server 8000
# 然后访问 http://localhost:8000
```

### 2. 功能测试

1. **点击 "Generate Random Verse" 按钮**
   - 应该显示加载动画
   - 然后显示从 API 获取的真实经文
   - 显示章节引用（如 "John 3:16"）

2. **检查控制台**
   - 打开浏览器开发者工具（F12）
   - 查看 Console 标签
   - 如果有错误，会显示错误信息
   - 如果使用备用数据，会显示提示

3. **测试网络请求**
   - 打开 Network 标签
   - 点击生成按钮
   - 应该看到对 `bible-api.com` 的请求
   - 检查响应状态（应该是 200）

## 🔧 自定义配置

### 更改默认翻译版本

在 `index.html` 中找到：
```javascript
const DEFAULT_TRANSLATION = 'web'; // 改为 'cuv' 使用中文
```

### 添加更多书卷

修改 `popularBooks` 数组：
```javascript
const popularBooks = [
    { name: 'john', chapters: 21 },
    { name: 'psalms', chapters: 150 },
    // 添加更多书卷...
];
```

### 切换语言

可以创建语言切换功能：
```javascript
// 英文
generateVerse('web');

// 中文
generateVerse('cuv');
```

## 📊 API 限制

根据 bible-api.com 的文档：
- **速率限制**：每 30 秒 15 次请求（基于 IP）
- **CORS 支持**：✅ 支持跨域请求
- **免费使用**：✅ 完全免费，无需 API Key

## 🐛 故障排除

### 问题 1: CORS 错误

**症状**：控制台显示 CORS 相关错误

**解决方案**：
- 使用本地服务器而不是直接打开文件
- 或部署到支持 HTTPS 的服务器

### 问题 2: API 返回 404

**症状**：网络请求返回 404 错误

**可能原因**：
- 随机选择的章节/节数不存在
- 书卷名称格式不正确

**解决方案**：
- 代码已包含错误处理，会自动使用备用方法
- 或使用备用数据

### 问题 3: 加载很慢

**症状**：点击按钮后很久才显示结果

**可能原因**：
- 网络连接慢
- API 服务器响应慢

**解决方案**：
- 检查网络连接
- 考虑添加超时处理
- 或使用本地 JSON 数据

## 🚀 下一步优化

1. **添加语言切换功能**
   - 在 UI 中添加语言选择器
   - 支持中英文切换

2. **添加主题筛选**
   - 自己维护主题标签数据
   - 实现前端筛选功能

3. **缓存机制**
   - 使用 LocalStorage 缓存经文
   - 减少 API 请求

4. **错误提示优化**
   - 显示用户友好的错误信息
   - 添加重试按钮

## 📝 API 文档参考

- 官方文档：https://bible-api.com/
- 支持的翻译：https://bible-api.com/ 页面底部
- 参数化 API：`/data/{translation}/random`

## ✅ 当前状态

- ✅ API 集成完成
- ✅ 错误处理完成
- ✅ 备用方案完成
- ⏳ 语言切换（待添加）
- ⏳ 主题筛选（待添加）
- ⏳ 缓存机制（待添加）

