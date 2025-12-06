// Vercel Serverless Function for Creem Webhook
const { handleCreemWebhook, verifyCreemWebhook } = require('../automation/creem-integration');

module.exports = async (req, res) => {
    // 只接受 POST 请求
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        // 获取 Creem 签名
        const signature = req.headers['x-creem-signature'];
        const payload = req.body;
        
        // 验证签名（可选，开发环境可以跳过）
        if (process.env.CREEM_WEBHOOK_SECRET) {
            const isValid = verifyCreemWebhook(payload, signature);
            if (!isValid) {
                console.error('Invalid webhook signature');
                return res.status(401).json({ error: 'Invalid signature' });
            }
        }
        
        // 处理 webhook 事件
        console.log('Received webhook:', payload.type);
        await handleCreemWebhook(payload);
        
        // 返回成功响应
        res.status(200).json({ received: true });
        
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
};
