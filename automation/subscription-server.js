const express = require('express');
const cors = require('cors');
const { addSubscriber, unsubscribe } = require('./email-subscription');
const { handleCreemWebhook, verifyCreemWebhook, isPaidSubscriber } = require('./creem-integration');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 订阅 API
app.post('/api/subscribe', async (req, res) => {
    const { email } = req.body;
    
    // 验证邮箱
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Please provide a valid email address' 
        });
    }
    
    try {
        const result = addSubscriber(email);
        
        if (result.success) {
            res.json({ 
                success: true, 
                message: 'Successfully subscribed! Check your email for confirmation.' 
            });
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error('Subscribe error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'An error occurred. Please try again.' 
        });
    }
});

// 取消订阅 API
app.post('/api/unsubscribe', async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email is required' 
        });
    }
    
    try {
        const result = unsubscribe(email);
        res.json(result);
    } catch (error) {
        console.error('Unsubscribe error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'An error occurred. Please try again.' 
        });
    }
});

// Creem Webhook 处理
app.post('/api/webhooks/creem', async (req, res) => {
    const signature = req.headers['x-creem-signature'];
    const payload = req.body;
    
    // 验证签名
    if (!verifyCreemWebhook(payload, signature)) {
        return res.status(401).json({ error: 'Invalid signature' });
    }
    
    try {
        await handleCreemWebhook(payload);
        res.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
});

// 检查用户订阅状态
app.get('/api/subscription-status/:email', (req, res) => {
    const { email } = req.params;
    const isPaid = isPaidSubscriber(email);
    
    res.json({
        email,
        isPaid,
        tier: isPaid ? 'premium' : 'free'
    });
});

// 健康检查
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Subscription server running on port ${PORT}`);
    console.log(`Subscribe endpoint: http://localhost:${PORT}/api/subscribe`);
    console.log(`Unsubscribe endpoint: http://localhost:${PORT}/api/unsubscribe`);
});

module.exports = app;
