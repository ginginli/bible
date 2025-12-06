const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

/**
 * Creem.io 付费订阅集成
 * 文档: https://docs.creem.io/
 */

const PAID_SUBSCRIBERS_FILE = path.join(__dirname, 'paid-subscribers.json');

// 初始化付费订阅者文件
function initPaidSubscribersFile() {
    if (!fs.existsSync(PAID_SUBSCRIBERS_FILE)) {
        fs.writeFileSync(PAID_SUBSCRIBERS_FILE, JSON.stringify({ 
            paidSubscribers: [] 
        }, null, 2));
    }
}

// 获取付费订阅者列表
function getPaidSubscribers() {
    initPaidSubscribersFile();
    const data = fs.readFileSync(PAID_SUBSCRIBERS_FILE, 'utf8');
    return JSON.parse(data).paidSubscribers;
}

// 添加付费订阅者
function addPaidSubscriber(email, creemData) {
    const subscribers = getPaidSubscribers();
    
    // 检查是否已存在
    const existingIndex = subscribers.findIndex(s => s.email === email);
    
    if (existingIndex !== -1) {
        // 更新现有订阅
        subscribers[existingIndex] = {
            ...subscribers[existingIndex],
            ...creemData,
            updatedAt: new Date().toISOString()
        };
    } else {
        // 添加新订阅
        subscribers.push({
            email,
            ...creemData,
            subscribedAt: new Date().toISOString(),
            active: true
        });
    }
    
    fs.writeFileSync(PAID_SUBSCRIBERS_FILE, JSON.stringify({ 
        paidSubscribers: subscribers 
    }, null, 2));
    
    return { success: true };
}

// 取消付费订阅
function cancelPaidSubscription(email) {
    const subscribers = getPaidSubscribers();
    const index = subscribers.findIndex(s => s.email === email);
    
    if (index === -1) {
        return { success: false, message: 'Subscription not found' };
    }
    
    subscribers[index].active = false;
    subscribers[index].cancelledAt = new Date().toISOString();
    
    fs.writeFileSync(PAID_SUBSCRIBERS_FILE, JSON.stringify({ 
        paidSubscribers: subscribers 
    }, null, 2));
    
    return { success: true };
}

// 检查用户是否为付费订阅者
function isPaidSubscriber(email) {
    const subscribers = getPaidSubscribers();
    const subscriber = subscribers.find(s => s.email === email && s.active);
    
    if (!subscriber) return false;
    
    // 检查订阅是否过期
    if (subscriber.expiresAt) {
        const expiryDate = new Date(subscriber.expiresAt);
        if (expiryDate < new Date()) {
            return false;
        }
    }
    
    return true;
}

// 验证 Creem Webhook 签名
function verifyCreemWebhook(payload, signature) {
    const crypto = require('crypto');
    const secret = process.env.CREEM_WEBHOOK_SECRET;
    
    if (!secret) {
        console.warn('CREEM_WEBHOOK_SECRET not configured');
        return true; // 开发环境跳过验证
    }
    
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(JSON.stringify(payload))
        .digest('hex');
    
    return signature === expectedSignature;
}

// 处理 Creem Webhook 事件
async function handleCreemWebhook(event) {
    console.log('Processing Creem webhook:', event.type);
    
    try {
        switch (event.type) {
            case 'purchase.completed':
            case 'subscription.created':
                // 新订阅
                await handleNewSubscription(event.data);
                break;
                
            case 'subscription.renewed':
                // 订阅续费
                await handleSubscriptionRenewal(event.data);
                break;
                
            case 'subscription.cancelled':
            case 'subscription.expired':
                // 订阅取消/过期
                await handleSubscriptionCancellation(event.data);
                break;
                
            case 'refund.completed':
                // 退款
                await handleRefund(event.data);
                break;
                
            default:
                console.log('Unhandled event type:', event.type);
        }
        
        return { success: true };
        
    } catch (error) {
        console.error('Error handling webhook:', error);
        return { success: false, error: error.message };
    }
}

// 处理新订阅
async function handleNewSubscription(data) {
    const { customer_email, product_id, subscription_id, expires_at } = data;
    
    console.log(`New subscription: ${customer_email}`);
    
    addPaidSubscriber(customer_email, {
        productId: product_id,
        subscriptionId: subscription_id,
        expiresAt: expires_at,
        status: 'active'
    });
    
    // 发送欢迎邮件
    await sendWelcomeEmail(customer_email);
}

// 处理订阅续费
async function handleSubscriptionRenewal(data) {
    const { customer_email, expires_at } = data;
    
    console.log(`Subscription renewed: ${customer_email}`);
    
    addPaidSubscriber(customer_email, {
        expiresAt: expires_at,
        status: 'active',
        lastRenewal: new Date().toISOString()
    });
}

// 处理订阅取消
async function handleSubscriptionCancellation(data) {
    const { customer_email } = data;
    
    console.log(`Subscription cancelled: ${customer_email}`);
    
    cancelPaidSubscription(customer_email);
    
    // 发送取消确认邮件
    await sendCancellationEmail(customer_email);
}

// 处理退款
async function handleRefund(data) {
    const { customer_email } = data;
    
    console.log(`Refund processed: ${customer_email}`);
    
    cancelPaidSubscription(customer_email);
}

// 发送欢迎邮件（付费用户）
async function sendWelcomeEmail(email) {
    const { sendEmail } = require('./email-subscription');
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Welcome to Premium</title>
</head>
<body style="font-family: Georgia, serif; background-color: #FDF9F3; margin: 0; padding: 40px 20px;">
    <table width="600" cellpadding="0" cellspacing="0" style="margin: 0 auto; background: white; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <tr>
            <td style="background: linear-gradient(135deg, #5B4B63 0%, #4B3C55 100%); padding: 40px; text-align: center; border-radius: 16px 16px 0 0;">
                <h1 style="color: white; font-size: 32px; margin: 0;">🎉 Welcome to Premium!</h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 40px;">
                <h2 style="color: #2D2D2D; font-size: 24px;">Thank You for Subscribing!</h2>
                <p style="color: #4A4A4A; font-size: 16px; line-height: 1.8;">
                    You now have access to premium features:
                </p>
                <ul style="color: #4A4A4A; font-size: 16px; line-height: 2;">
                    <li>📧 Daily Bible verses (instead of weekly)</li>
                    <li>🤖 AI-powered deep explanations</li>
                    <li>📄 Beautiful PDF downloads</li>
                    <li>🎨 Exclusive verse images</li>
                    <li>💬 Priority support</li>
                </ul>
                <div style="text-align: center; margin-top: 30px;">
                    <a href="${process.env.WEBSITE_URL}" 
                       style="display: inline-block; background: linear-gradient(135deg, #A67C00 0%, #C9A236 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600;">
                        Explore Premium Features
                    </a>
                </div>
            </td>
        </tr>
        <tr>
            <td style="background: #F8F5F0; padding: 30px; text-align: center; border-radius: 0 0 16px 16px;">
                <p style="color: #6B6B6B; font-size: 14px; margin: 0;">
                    Questions? Reply to this email or visit our <a href="${process.env.WEBSITE_URL}/support" style="color: #A67C00;">support page</a>
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
    
    await sendEmail(email, '🎉 Welcome to Premium - Daily Bible Verse', html);
}

// 发送取消确认邮件
async function sendCancellationEmail(email) {
    const { sendEmail } = require('./email-subscription');
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Subscription Cancelled</title>
</head>
<body style="font-family: Georgia, serif; background-color: #FDF9F3; margin: 0; padding: 40px 20px;">
    <table width="600" cellpadding="0" cellspacing="0" style="margin: 0 auto; background: white; border-radius: 16px;">
        <tr>
            <td style="padding: 40px; text-align: center;">
                <h1 style="color: #2D2D2D; font-size: 28px;">We're Sorry to See You Go</h1>
                <p style="color: #4A4A4A; font-size: 16px; line-height: 1.8;">
                    Your premium subscription has been cancelled. You'll continue to receive free weekly verses.
                </p>
                <p style="color: #4A4A4A; font-size: 16px; line-height: 1.8;">
                    We'd love to hear your feedback to improve our service.
                </p>
                <div style="margin-top: 30px;">
                    <a href="${process.env.WEBSITE_URL}/feedback" 
                       style="display: inline-block; background: #A67C00; color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px;">
                        Share Feedback
                    </a>
                </div>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
    
    await sendEmail(email, 'Subscription Cancelled - Daily Bible Verse', html);
}

// 获取 Creem 产品信息
async function getCreemProduct(productId) {
    const apiKey = process.env.CREEM_API_KEY;
    
    if (!apiKey) {
        throw new Error('CREEM_API_KEY not configured');
    }
    
    try {
        const response = await axios.get(
            `https://api.creem.io/v1/products/${productId}`,
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        return response.data;
    } catch (error) {
        console.error('Error fetching Creem product:', error.response?.data || error.message);
        throw error;
    }
}

module.exports = {
    getPaidSubscribers,
    addPaidSubscriber,
    cancelPaidSubscription,
    isPaidSubscriber,
    verifyCreemWebhook,
    handleCreemWebhook,
    getCreemProduct
};
