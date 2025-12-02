/**
 * Helper script to get Pinterest Access Token
 * 
 * This is a simplified version. For production, use OAuth 2.0 flow.
 * 
 * Steps:
 * 1. Go to https://developers.pinterest.com/apps/
 * 2. Create an app
 * 3. Get App ID and App Secret
 * 4. Use OAuth 2.0 to get user authorization
 * 5. Exchange authorization code for access token
 * 
 * Or use Pinterest API Explorer:
 * https://developers.pinterest.com/tools/api-explorer/
 */

const axios = require('axios');
require('dotenv').config();

/**
 * Get Board ID from Board URL
 */
async function getBoardId(boardUrl) {
    // Board URL format: https://www.pinterest.com/username/board-name/
    // Or: pinterest.com/username/board-name/
    
    const match = boardUrl.match(/pinterest\.com\/[^\/]+\/([^\/]+)/);
    if (!match) {
        throw new Error('Invalid board URL format');
    }
    
    const boardName = match[1];
    console.log(`Board name: ${boardName}`);
    console.log('You need to get the Board ID from Pinterest API or URL');
    
    // To get Board ID programmatically, you need:
    // 1. Access token
    // 2. Call GET /v5/boards to list all boards
    // 3. Find board by name
    
    return boardName;
}

/**
 * Instructions for getting Pinterest credentials
 */
function printInstructions() {
    console.log(`
=== Pinterest API 设置指南 ===

1. 创建 Pinterest 应用:
   - 访问: https://developers.pinterest.com/apps/
   - 点击 "Create app"
   - 填写应用信息
   - 获取 App ID 和 App Secret

2. 获取 Access Token:
   
   方法 A - 使用 API Explorer (推荐测试):
   - 访问: https://developers.pinterest.com/tools/api-explorer/
   - 选择权限: boards:read, pins:write
   - 生成 token
   - 复制到 .env 文件

   方法 B - OAuth 2.0 (生产环境):
   - 使用 OAuth 2.0 流程获取用户授权
   - 参考: https://developers.pinterest.com/docs/getting-started/authentication/

3. 获取 Board ID:
   - 在 Pinterest 创建 Board
   - Board ID 在 Board URL 中
   - 或通过 API: GET /v5/boards

4. 配置 .env 文件:
   PINTEREST_ACCESS_TOKEN=your_token_here
   PINTEREST_BOARD_ID=your_board_id_here

5. 测试连接:
   node index.js
`);
}

// Run instructions
if (require.main === module) {
    printInstructions();
}

module.exports = { getBoardId };

