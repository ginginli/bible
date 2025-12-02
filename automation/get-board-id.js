const axios = require('axios');
require('dotenv').config();

/**
 * Get Board ID from Pinterest API
 * 
 * Usage:
 * 1. Set PINTEREST_ACCESS_TOKEN in .env file
 * 2. Run: node get-board-id.js
 */
async function getBoardId() {
    const accessToken = process.env.PINTEREST_ACCESS_TOKEN;
    
    if (!accessToken) {
        console.error('❌ Error: PINTEREST_ACCESS_TOKEN not found in .env file');
        console.log('\nPlease:');
        console.log('1. Copy env.example to .env');
        console.log('2. Add your PINTEREST_ACCESS_TOKEN to .env file');
        process.exit(1);
    }
    
    try {
        console.log('🔍 Fetching your Pinterest boards...\n');
        
        // Get all boards for the user
        const response = await axios.get(
            'https://api.pinterest.com/v5/boards',
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                params: {
                    page_size: 25  // Get first 25 boards
                }
            }
        );
        
        const boards = response.data.items || [];
        
        if (boards.length === 0) {
            console.log('❌ No boards found. Please create a board first on Pinterest.');
            return;
        }
        
        console.log('📌 Your Pinterest Boards:\n');
        console.log('─'.repeat(60));
        
        boards.forEach((board, index) => {
            console.log(`\n${index + 1}. ${board.name}`);
            console.log(`   Board ID: ${board.id}`);
            console.log(`   URL: ${board.url || 'N/A'}`);
            
            // Highlight if it matches "daily-bible-verse"
            if (board.name.toLowerCase().includes('daily-bible-verse') || 
                board.name.toLowerCase().includes('bible-verse')) {
                console.log(`   ⭐ This looks like your target board!`);
            }
        });
        
        console.log('\n' + '─'.repeat(60));
        console.log('\n✅ Copy the Board ID for "daily-bible-verse" board');
        console.log('   Add it to your .env file as: PINTEREST_BOARD_ID=your_board_id_here');
        console.log('\n   Or add it to GitHub Secrets as: PINTEREST_BOARD_ID');
        
        // Try to find the specific board
        const targetBoard = boards.find(board => 
            board.name.toLowerCase().includes('daily-bible-verse') ||
            board.url?.includes('daily-bible-verse')
        );
        
        if (targetBoard) {
            console.log('\n🎯 Found your board!');
            console.log(`   Board ID: ${targetBoard.id}`);
            console.log(`   Board Name: ${targetBoard.name}`);
        }
        
    } catch (error) {
        if (error.response) {
            console.error('❌ API Error:', error.response.status, error.response.statusText);
            console.error('   Response:', JSON.stringify(error.response.data, null, 2));
            
            if (error.response.status === 401) {
                console.error('\n💡 Your Access Token might be invalid or expired.');
                console.error('   Please get a new token from: https://developers.pinterest.com/tools/api-explorer/');
            }
        } else {
            console.error('❌ Error:', error.message);
        }
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    getBoardId();
}

module.exports = { getBoardId };

