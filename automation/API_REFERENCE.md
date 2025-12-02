# Pinterest API v5 Create Pin 参考

## API 端点

**POST** `https://api.pinterest.com/v5/pins`

官方文档：https://developers.pinterest.com/docs/api/v5/pins-create

## 请求头

```
Authorization: Bearer {access_token}
Content-Type: application/json
```

## 请求体参数

### 必需参数

- `board_id` (string) - 目标 Board 的 ID
- `media_source` (object) - 媒体源信息

### 可选参数

- `title` (string) - Pin 的标题（最多 100 个字符）
- `description` (string) - Pin 的描述（最多 8000 个字符）
- `link` (string) - 链接 URL（必须是有效的 URL）
- `alt_text` (string) - 图片的替代文本（最多 500 个字符）

## media_source 对象

### 使用 base64 图片

```json
{
  "source_type": "image_base64",
  "content_type": "image/png",
  "data": "base64_encoded_image_data"
}
```

### 其他支持的 source_type

- `image_url` - 使用图片 URL
- `video_id` - 使用视频 ID

## 响应

成功响应（201 Created）：

```json
{
  "id": "pin_id",
  "board_id": "board_id",
  "board_section_id": null,
  "media": {
    "image_cover_url": "https://...",
    "images": {
      "564x": {
        "url": "https://...",
        "width": 564,
        "height": 846
      }
    }
  },
  "link": "https://...",
  "title": "Bible Verse of the Day",
  "description": "...",
  "dominant_color": "#6B5B73",
  "alt_text": "...",
  "created_at": "2025-12-01T00:00:00.000Z"
}
```

## 错误响应

### 400 Bad Request
- 参数验证失败
- 图片格式不支持
- 图片大小超出限制

### 401 Unauthorized
- Access Token 无效或过期

### 403 Forbidden
- 权限不足（需要 `pins:write` 权限）
- Board 不存在或无权访问

### 404 Not Found
- Board ID 不存在

## 代码实现

当前实现使用 `image_base64` 方式，符合 API 规范：

```javascript
const pinData = {
    board_id: boardId,
    media_source: {
        source_type: 'image_base64',
        content_type: 'image/png',
        data: imageBase64
    },
    title: '...',
    description: '...',
    link: '...',
    alt_text: '...'
};
```

## 权限要求

创建 Pin 需要以下权限：
- `pins:write` - 必需
- `boards:read` - 推荐（用于验证 Board 存在）

## 限制

- 图片大小：最大 32MB
- 图片格式：支持 PNG, JPEG, GIF, WebP
- 标题长度：最多 100 个字符
- 描述长度：最多 8000 个字符
- 链接：必须是有效的 HTTP/HTTPS URL

## 最佳实践

1. **图片尺寸**：推荐 1000x1500px（2:3 比例）用于 Pinterest
2. **描述优化**：包含相关关键词和标签
3. **链接**：确保链接指向相关内容
4. **错误处理**：实现重试机制和错误日志
5. **速率限制**：遵守 Pinterest API 速率限制

## 测试

可以使用 Pinterest API Explorer 测试：
https://developers.pinterest.com/tools/api-explorer/

选择：
- Endpoint: `POST /v5/pins`
- 权限：`pins:write`
- 填写参数并测试

