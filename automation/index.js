const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

/**
 * Generate Bible verse image using Puppeteer
 */
async function generateVerseImage() {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        
        // Set viewport to match Pinterest image size
        await page.setViewport({
            width: 1000,
            height: 1500,
            deviceScaleFactor: 2
        });
        
        // Load the Bible verse page
        const url = process.env.BIBLE_VERSE_PAGE || 'https://random-bible-verse-generator.info/bible-verse-of-the-day.html';
        await page.goto(url, { waitUntil: 'networkidle0' });
        
        // Wait for verse to load
        await page.waitForSelector('#verseText', { timeout: 10000 });
        await page.waitForTimeout(2000); // Wait for fonts to load
        
        // Get verse data
        const verseData = await page.evaluate(() => {
            return {
                date: document.getElementById('verseDate')?.textContent || '',
                text: document.getElementById('verseText')?.textContent?.replace(/"/g, '') || '',
                reference: document.getElementById('verseReference')?.textContent || ''
            };
        });
        
        if (!verseData.text || verseData.text.includes('Click')) {
            throw new Error('Verse not loaded properly');
        }
        
        // Update hidden image generator
        await page.evaluate((data) => {
            const imageGen = document.getElementById('imageGenerator');
            if (imageGen) {
                document.getElementById('imageDate').textContent = data.date;
                document.getElementById('imageVerse').textContent = data.text;
                document.getElementById('imageReference').textContent = data.reference;
                imageGen.style.display = 'flex';
            }
        }, verseData);
        
        await page.waitForTimeout(500);
        
        // Capture the image generator element
        const imageGenerator = await page.$('#imageGenerator');
        if (!imageGenerator) {
            throw new Error('Image generator element not found');
        }
        
        // Generate image
        const imageBuffer = await imageGenerator.screenshot({
            type: 'png',
            omitBackground: false
        });
        
        // Save image
        const dateStr = new Date().toISOString().split('T')[0];
        const imagePath = path.join(__dirname, 'images', `bible-verse-${dateStr}.png`);
        
        // Create images directory if it doesn't exist
        const imagesDir = path.join(__dirname, 'images');
        if (!fs.existsSync(imagesDir)) {
            fs.mkdirSync(imagesDir, { recursive: true });
        }
        
        fs.writeFileSync(imagePath, imageBuffer);
        console.log(`Image saved: ${imagePath}`);
        
        return { imagePath, verseData };
        
    } finally {
        await browser.close();
    }
}

/**
 * Post image to Pinterest using API
 */
async function postToPinterest(imagePath, verseData) {
    const accessToken = process.env.PINTEREST_ACCESS_TOKEN;
    const boardId = process.env.PINTEREST_BOARD_ID;
    
    if (!accessToken || !boardId) {
        throw new Error('Pinterest credentials not configured');
    }
    
    // Read image file
    const imageBuffer = fs.readFileSync(imagePath);
    const imageBase64 = imageBuffer.toString('base64');
    
    // Create pin
    const pinData = {
        board_id: boardId,
        media_source: {
            source_type: 'image_base64',
            content_type: 'image/png',
            data: imageBase64
        },
        title: `Bible Verse of the Day - ${verseData.date}`,
        description: `${verseData.text}\n\n${verseData.reference}\n\n#BibleVerse #DailyVerse #BibleVerseOfTheDay #Scripture #Faith #Inspiration\n\nVisit: ${process.env.WEBSITE_URL}/bible-verse-of-the-day.html`,
        link: `${process.env.WEBSITE_URL}/bible-verse-of-the-day.html`,
        alt_text: `Bible Verse of the Day - ${verseData.reference}`
    };
    
    try {
        const response = await axios.post(
            'https://api.pinterest.com/v5/pins',
            pinData,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        console.log('Successfully posted to Pinterest:', response.data.id);
        return response.data;
        
    } catch (error) {
        console.error('Error posting to Pinterest:', error.response?.data || error.message);
        throw error;
    }
}

/**
 * Main function
 */
async function main() {
    try {
        console.log('Starting daily Bible verse automation...');
        console.log(`Date: ${new Date().toISOString()}`);
        
        // Generate image
        console.log('Generating verse image...');
        const { imagePath, verseData } = await generateVerseImage();
        
        // Post to Pinterest
        console.log('Posting to Pinterest...');
        await postToPinterest(imagePath, verseData);
        
        console.log('Automation completed successfully!');
        
    } catch (error) {
        console.error('Automation failed:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { generateVerseImage, postToPinterest };

