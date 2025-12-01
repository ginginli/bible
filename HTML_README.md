# HTML 版本说明

## 文件说明

`index.html` - 完整的单页面 HTML 文件，包含所有功能

## 页面结构

1. **Header** - 导航栏，包含 Logo、导航链接和生成按钮
2. **Hero** - 大标题区域，包含主标题和 CTA 按钮
3. **Verse Generator** - 经文生成器（功能区域）
4. **Features** - 功能特点展示（6 个卡片）
5. **What Is** - 项目介绍部分
6. **How To** - 使用说明（4 步流程）
7. **Why** - 为什么使用（6 个好处）
8. **FAQ** - 常见问题（7 个问题）
9. **Footer** - 页脚，包含链接和版权信息

## 功能特点

### 已实现
- ✅ 响应式设计（移动端友好）
- ✅ 随机经文生成功能
- ✅ 平滑滚动导航
- ✅ FAQ 折叠展开
- ✅ 现代化 UI 设计
- ✅ 渐变背景和动画效果

### 待完善（生产环境）
- ⚠️ 图片生成功能（需要 html2canvas 库）
- ⚠️ 更多圣经经文数据（当前只有 10 条示例）
- ⚠️ 主题筛选功能
- ⚠️ 多版本支持

## 使用方法

### 本地预览
1. 直接在浏览器中打开 `index.html` 文件
2. 或使用本地服务器：
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js (需要安装 http-server)
   npx http-server
   ```
3. 访问 `http://localhost:8000`

### 部署
- 可以直接部署到任何静态网站托管服务：
  - GitHub Pages
  - Netlify
  - Vercel
  - Cloudflare Pages
  - 或任何 Web 服务器

## 自定义修改

### 添加更多经文
在 `bibleVerses` 数组中添加更多对象：
```javascript
{
    text: "你的经文内容",
    reference: "书卷 章节:节数",
    topics: ["主题1", "主题2"]
}
```

### 修改颜色主题
在 `<style>` 标签中修改 CSS 变量：
```css
:root {
    --primary-color: #4A5568;
    --accent-color: #667EEA;
    /* ... 其他颜色 */
}
```

### 添加图片生成功能
1. 引入 html2canvas 库：
```html
<script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
```

2. 修改 `generateImage()` 函数实现真实图片生成

## 浏览器兼容性

- ✅ Chrome/Edge (最新版本)
- ✅ Firefox (最新版本)
- ✅ Safari (最新版本)
- ✅ 移动端浏览器

## 性能优化建议

1. **图片优化**：如果有图片，使用 WebP 格式
2. **字体优化**：考虑使用 `font-display: swap`
3. **代码分割**：如果添加更多功能，考虑拆分 JS
4. **CDN**：使用 CDN 加载外部资源

## 下一步开发建议

1. 添加真实的圣经数据（JSON 文件）
2. 实现图片生成功能（html2canvas）
3. 添加主题筛选功能
4. 添加多版本支持
5. 添加本地存储（保存收藏的经文）
6. 添加分享功能（社交媒体 API）

## 注意事项

- 当前经文数据是示例数据，生产环境需要完整的圣经数据
- 图片生成功能是占位符，需要实际实现
- 所有链接（About, Contact 等）都是占位符，需要创建对应页面

