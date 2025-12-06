const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

/**
 * 邮件订阅管理系统
 * 使用 Resend API 发送邮件（免费额度：100封/天）
 */

const SUBSCRIBERS_FILE = path.join(__dirname, 'subscribers.json');

// 初始化订阅者文件
function initSubscribersFile() {
    if (!fs.existsSync(SUBSCRIBERS_FILE)) {
        fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify({ subscribers: [] }, null, 2));
    }
}

// 读取订阅者列表
function getSubscribers() {
    initSubscribersFile();
    const data = fs.readFileSync(SUBSCRIBERS_FILE, 'utf8');
    return JSON.parse(data).subscribers;
}

// 添加订阅者
function addSubscriber(email) {
    const subscribers = getSubscribers();
    
    // 检查是否已存在
    if (subscribers.find(s => s.email === email)) {
        return { success: false, message: 'Email already subscribed' };
    }
    
    subscribers.push({
        email,
        subscribedAt: new Date().toISOString(),
        active: true
    });
    
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify({ subscribers }, null, 2));
    return { success: true, message: 'Successfully subscribed' };
}

// 取消订阅
function unsubscribe(email) {
    const subscribers = getSubscribers();
    const index = subscribers.findIndex(s => s.email === email);
    
    if (index === -1) {
        return { success: false, message: 'Email not found' };
    }
    
    subscribers[index].active = false;
    subscribers[index].unsubscribedAt = new Date().toISOString();
    
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify({ subscribers }, null, 2));
    return { success: true, message: 'Successfully unsubscribed' };
}

// 获取今日经文数据
async function getTodayVerse() {
    try {
        const url = process.env.BIBLE_VERSE_PAGE || 'https://random-bible-verse-generator.info/bible-verse-of-the-day.html';
        const response = await axios.get(url);
        
        // 这里需要解析 HTML 获取经文
        // 简化版：直接从 API 获取（你需要创建一个 API 端点）
        // 或者使用 puppeteer 抓取
        
        return {
            text: "For God so loved the world that he gave his one and only Son...",
            reference: "John 3:16",
            date: new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })
        };
    } catch (error) {
        console.error('Error fetching verse:', error);
        throw error;
    }
}

// 生成经文解释（使用 AI 或预设内容）
function generateExplanation(verse, isPremium = false) {
    if (isPremium) {
        // 付费用户：更深入的解释（可以集成 OpenAI API）
        return `
            <h3>🌟 Premium Insight: Understanding Today's Verse</h3>
            <p style="font-size: 17px; line-height: 1.9;">This verse reminds us of God's love and grace. Take a moment to reflect on how this message applies to your life today.</p>
            
            <h4 style="color: #A67C00; margin-top: 25px;">Historical Context</h4>
            <p>Understanding the background of this passage helps us appreciate its deeper meaning and relevance to our modern lives.</p>
            
            <h4 style="color: #A67C00; margin-top: 25px;">Personal Application</h4>
            <ul style="line-height: 2;">
                <li>What does this verse mean to you personally?</li>
                <li>How can you apply this wisdom in your daily life?</li>
                <li>Who might benefit from hearing this message today?</li>
                <li>What action can you take today to live out this truth?</li>
            </ul>
            
            <h4 style="color: #A67C00; margin-top: 25px;">Prayer Prompt</h4>
            <p style="font-style: italic; background: #F8F5F0; padding: 20px; border-radius: 8px;">
                "Lord, help me to understand and live out the truth of this verse today. Guide my steps and open my heart to Your wisdom."
            </p>
        `;
    } else {
        // 免费用户：基础解释
        return `
            <h3>Understanding Today's Verse</h3>
            <p>This verse reminds us of God's love and grace. Take a moment to reflect on how this message applies to your life today.</p>
            <p>Consider:</p>
            <ul>
                <li>What does this verse mean to you personally?</li>
                <li>How can you apply this wisdom in your daily life?</li>
                <li>Who might benefit from hearing this message today?</li>
            </ul>
            <div style="margin-top: 30px; padding: 20px; background: #FFF9E6; border-radius: 8px; text-align: center;">
                <p style="margin: 0 0 15px 0; font-weight: 600; color: #A67C00;">Want deeper insights?</p>
                <a href="${process.env.WEBSITE_URL}/premium.html" 
                   style="display: inline-block; background: linear-gradient(135deg, #A67C00, #C9A236); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 600;">
                    Upgrade to Premium
                </a>
            </div>
        `;
    }
}

// 发送邮件（使用 Resend）
async function sendEmail(to, subject, html) {
    const apiKey = process.env.RESEND_API_KEY;
    
    if (!apiKey) {
        throw new Error('RESEND_API_KEY not configured');
    }
    
    try {
        const response = await axios.post(
            'https://api.resend.com/emails',
            {
                from: process.env.EMAIL_FROM || 'Daily Verse <noreply@random-bible-verse-generator.info>',
                to: [to],
                subject: subject,
                html: html
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error sending email:', error.response?.data || error.message);
        return { success: false, error: error.message };
    }
}

// 生成邮件 HTML 模板
function generateEmailHTML(verseData, explanation, isPremium = false) {
    const unsubscribeLink = `${process.env.WEBSITE_URL}/unsubscribe.html`;
    const headerGradient = isPremium 
        ? 'background: linear-gradient(135deg, #A67C00 0%, #C9A236 100%);'
        : 'background: linear-gradient(135deg, #5B4B63 0%, #4B3C55 100%);';
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily Bible Verse - ${verseData.date}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Georgia', serif; background-color: #FDF9F3;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FDF9F3;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="${headerGradient} padding: 40px; text-align: center; border-radius: 16px 16px 0 0;">
                            <h1 style="color: #FFFFFF; font-size: 28px; margin: 0; font-weight: 600;">
                                ${isPremium ? '🌟 ' : '✝ '}Daily Bible Verse${isPremium ? ' Premium' : ''}
                            </h1>
                            <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin: 10px 0 0 0;">${verseData.date}</p>
                        </td>
                    </tr>
                    
                    <!-- Verse Content -->
                    <tr>
                        <td style="padding: 50px 40px;">
                            <div style="text-align: center; margin-bottom: 30px;">
                                <p style="font-size: 24px; line-height: 1.8; color: #2D2D2D; font-style: italic; margin: 0 0 20px 0;">
                                    "${verseData.text}"
                                </p>
                                <p style="font-size: 16px; color: #A67C00; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; margin: 0;">
                                    ${verseData.reference}
                                </p>
                            </div>
                            
                            <!-- Divider -->
                            <div style="height: 1px; background: linear-gradient(90deg, transparent, #E0DCD2, transparent); margin: 40px 0;"></div>
                            
                            <!-- Explanation -->
                            <div style="color: #4A4A4A; font-size: 16px; line-height: 1.8;">
                                ${explanation}
                            </div>
                            
                            <!-- CTA Button -->
                            <div style="text-align: center; margin-top: 40px;">
                                <a href="${process.env.WEBSITE_URL}/bible-verse-of-the-day.html" 
                                   style="display: inline-block; background: linear-gradient(135deg, #A67C00 0%, #C9A236 100%); color: #FFFFFF; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                                    Read More Verses
                                </a>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #F8F5F0; padding: 30px 40px; text-align: center; border-radius: 0 0 16px 16px;">
                            <p style="color: #6B6B6B; font-size: 14px; margin: 0 0 10px 0;">
                                You're receiving this because you subscribed to daily Bible verses.
                            </p>
                            <p style="margin: 0;">
                                <a href="${unsubscribeLink}" style="color: #A67C00; text-decoration: none; font-size: 14px;">Unsubscribe</a>
                                <span style="color: #D0D0D0; margin: 0 10px;">|</span>
                                <a href="${process.env.WEBSITE_URL}" style="color: #A67C00; text-decoration: none; font-size: 14px;">Visit Website</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
}

// 发送每日邮件给所有订阅者
async function sendDailyEmails() {
    console.log('Starting daily email send...');
    
    try {
        const { isPaidSubscriber } = require('./creem-integration');
        
        // 获取今日经文
        const verseData = await getTodayVerse();
        
        // 获取所有活跃订阅者（免费 + 付费）
        const freeSubscribers = getSubscribers().filter(s => s.active);
        console.log(`Found ${freeSubscribers.length} free subscribers`);
        
        if (freeSubscribers.length === 0) {
            console.log('No active subscribers');
            return;
        }
        
        let successCount = 0;
        let failCount = 0;
        
        // 只给付费用户发送邮件
        for (const subscriber of freeSubscribers) {
            const isPremium = isPaidSubscriber(subscriber.email);
            
            // 只发送给付费用户
            if (!isPremium) {
                console.log(`⊘ Skipping ${subscriber.email} (not premium)`);
                continue;
            }
            
            // 生成付费用户内容
            const explanation = generateExplanation(verseData, true);
            const emailHTML = generateEmailHTML(verseData, explanation, true);
            const subject = `🌟 Daily Bible Verse - ${verseData.reference}`;
            
            const result = await sendEmail(subscriber.email, subject, emailHTML);
            
            if (result.success) {
                successCount++;
                console.log(`✓ Sent to ${subscriber.email} (Premium)`);
            } else {
                failCount++;
                console.error(`✗ Failed to send to ${subscriber.email}`);
            }
            
            // 延迟 100ms 避免限流
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        console.log(`\nEmail send complete:`);
        console.log(`  Success: ${successCount}`);
        console.log(`  Failed: ${failCount}`);
        
    } catch (error) {
        console.error('Error in sendDailyEmails:', error);
        throw error;
    }
}

module.exports = {
    addSubscriber,
    unsubscribe,
    getSubscribers,
    sendDailyEmails,
    sendEmail,
    generateEmailHTML
};

// 如果直接运行此文件，执行测试
if (require.main === module) {
    sendDailyEmails().catch(console.error);
}
