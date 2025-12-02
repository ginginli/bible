const cron = require('node-cron');
const { generateVerseImage, postToPinterest } = require('./index');

/**
 * Schedule daily posting
 */
function scheduleDailyPosting() {
    // Get schedule from environment or use default (8:00 AM daily)
    const schedule = process.env.CRON_SCHEDULE || '0 8 * * *';
    
    console.log(`Scheduling daily posts with cron: ${schedule}`);
    console.log('Scheduler started. Waiting for scheduled time...');
    
    cron.schedule(schedule, async () => {
        try {
            console.log(`\n=== Scheduled run at ${new Date().toISOString()} ===`);
            
            const { imagePath, verseData } = await generateVerseImage();
            await postToPinterest(imagePath, verseData);
            
            console.log('Scheduled post completed successfully!\n');
            
        } catch (error) {
            console.error('Scheduled post failed:', error);
        }
    });
    
    // Keep process running
    console.log('Scheduler is running. Press Ctrl+C to stop.');
}

// Start scheduler
scheduleDailyPosting();

