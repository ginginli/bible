const cron = require('node-cron');
const { generateVerseImage, postToPinterest } = require('./index');
const { sendDailyEmails } = require('./email-subscription');

/**
 * Schedule daily posting and email sending
 * Default: 8:00 AM US Eastern Time (EST/EDT)
 */
function scheduleDailyTasks() {
    // Get schedule from environment or use default
    // Default: 8:00 AM US Eastern Time = 13:00 UTC (EST) or 12:00 UTC (EDT)
    // Using 12:00 UTC to account for EDT (most of the year)
    const schedule = process.env.CRON_SCHEDULE || '0 12 * * *';
    
    console.log(`Scheduling daily tasks with cron: ${schedule}`);
    console.log('Time zone: US Eastern Time (8:00 AM EST/EDT)');
    console.log('Scheduler started. Waiting for scheduled time...');
    
    cron.schedule(schedule, async () => {
        try {
            console.log(`\n=== Scheduled run at ${new Date().toISOString()} ===`);
            
            // 1. Generate and post to Pinterest
            console.log('Step 1: Generating verse image...');
            const { imagePath, verseData } = await generateVerseImage();
            
            console.log('Step 2: Posting to Pinterest...');
            await postToPinterest(imagePath, verseData);
            
            // 2. Send daily emails to subscribers
            console.log('Step 3: Sending daily emails...');
            await sendDailyEmails();
            
            console.log('✓ All scheduled tasks completed successfully!\n');
            
        } catch (error) {
            console.error('✗ Scheduled tasks failed:', error);
        }
    });
    
    // Keep process running
    console.log('Scheduler is running. Press Ctrl+C to stop.');
}

// Start scheduler
scheduleDailyTasks();

