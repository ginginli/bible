/**
 * 圣经经文解读系统
 * 支持多种来源：预设、AI生成、缓存
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 缓存文件
const CACHE_FILE = path.join(__dirname, 'explanation-cache.json');

// 预设的常见经文解读
const PRESET_EXPLANATIONS = {
  'John 3:16': {
    explanation: `This verse is the heart of the Gospel message. God's love for humanity is so profound that He gave His only Son, Jesus Christ, to save us. This isn't just historical information—it's a personal invitation. "Whoever believes" means this gift is available to you, right now. Eternal life isn't just about living forever; it's about knowing God intimately, starting today.`,
    application: `Today, reflect on how deeply you are loved. Let this truth transform how you see yourself and others. Share this love with someone who needs to hear it.`,
    prayer: `Lord, thank You for Your incredible love. Help me to truly believe and live in the freedom of Your grace.`
  },
  
  'Philippians 4:13': {
    explanation: `Paul wrote this from prison, yet he declared strength in Christ. This verse isn't about achieving anything we want, but about enduring anything God calls us to. Christ's strength enables us to face challenges, overcome obstacles, and remain faithful in difficult circumstances.`,
    application: `What challenge are you facing today? Remember, you're not facing it alone. Christ's strength is available to you right now.`,
    prayer: `Jesus, I need Your strength today. Help me to rely on You rather than my own abilities.`
  },
  
  'Psalm 23:1': {
    explanation: `David, a former shepherd himself, knew what it meant to be cared for. When he calls God his shepherd, he's declaring complete trust. A good shepherd provides, protects, and guides. "I shall not want" doesn't mean we'll have everything we desire, but that we'll have everything we need.`,
    application: `What are you worried about lacking today? Trust that your Shepherd knows your needs and will provide.`,
    prayer: `Lord, You are my Shepherd. Help me to trust You completely with my needs and concerns.`
  },
  
  'Proverbs 3:5-6': {
    explanation: `This passage calls us to radical trust. "Lean not on your own understanding" is challenging because we naturally want to figure everything out. But God's perspective is infinitely greater than ours. When we acknowledge Him in all our ways, He promises to direct our paths—not always in the way we expect, but always in the way that's best.`,
    application: `Is there a decision you're trying to make? Instead of relying solely on logic, bring it to God in prayer and trust His guidance.`,
    prayer: `Father, I surrender my need to understand everything. Guide my steps according to Your perfect will.`
  }
};

/**
 * 从缓存读取解读
 */
function loadCache() {
  if (fs.existsSync(CACHE_FILE)) {
    return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
  }
  return {};
}

/**
 * 保存到缓存
 */
function saveCache(cache) {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

/**
 * 使用 OpenAI 生成解读
 */
async function generateWithAI(verse, reference) {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.warn('OPENAI_API_KEY not configured, using generic explanation');
    return generateGenericExplanation(verse, reference);
  }
  
  try {
    const prompt = `As a warm and encouraging Bible teacher, provide a brief explanation of this verse:

"${verse}" - ${reference}

Structure your response as:
1. Explanation (2-3 sentences about what this verse means)
2. Application (1-2 sentences about how to apply it today)
3. Prayer (A short, personal prayer related to this verse)

Keep the total under 150 words. Be warm, accessible, and practical.`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.choices[0].message.content;
    
  } catch (error) {
    console.error('AI generation failed:', error.message);
    return generateGenericExplanation(verse, reference);
  }
}

/**
 * 生成通用解读（备用方案）
 */
function generateGenericExplanation(verse, reference) {
  return `
    <h3>Understanding Today's Verse</h3>
    <p>This verse from ${reference} reminds us of God's love and wisdom. Take a moment to reflect on how this message applies to your life today.</p>
    
    <h4>Reflection Questions:</h4>
    <ul>
      <li>What does this verse mean to you personally?</li>
      <li>How can you apply this wisdom in your daily life?</li>
      <li>Who might benefit from hearing this message today?</li>
    </ul>
    
    <p><em>Prayer: Lord, help me to understand and live out the truth of Your Word today. Amen.</em></p>
  `;
}

/**
 * 获取经文解读（主函数）
 */
async function getExplanation(verse, reference, isPremium = false) {
  // 1. 检查预设解读
  if (PRESET_EXPLANATIONS[reference]) {
    const preset = PRESET_EXPLANATIONS[reference];
    return formatExplanation(preset, isPremium);
  }
  
  // 2. 检查缓存
  const cache = loadCache();
  if (cache[reference]) {
    console.log(`Using cached explanation for ${reference}`);
    return cache[reference];
  }
  
  // 3. 付费用户：使用 AI 生成
  if (isPremium) {
    console.log(`Generating AI explanation for ${reference}`);
    const aiExplanation = await generateWithAI(verse, reference);
    
    // 保存到缓存
    cache[reference] = aiExplanation;
    saveCache(cache);
    
    return aiExplanation;
  }
  
  // 4. 免费用户：使用通用解读
  return generateGenericExplanation(verse, reference);
}

/**
 * 格式化预设解读
 */
function formatExplanation(preset, isPremium) {
  let html = `
    <h3>Understanding Today's Verse</h3>
    <p>${preset.explanation}</p>
  `;
  
  if (isPremium) {
    html += `
      <h4>Personal Application</h4>
      <p>${preset.application}</p>
      
      <h4>Prayer</h4>
      <p style="font-style: italic; background: #F8F5F0; padding: 15px; border-radius: 8px;">
        ${preset.prayer}
      </p>
    `;
  }
  
  return html;
}

module.exports = {
  getExplanation,
  generateWithAI,
  PRESET_EXPLANATIONS
};

// 测试
if (require.main === module) {
  getExplanation(
    'For God so loved the world that he gave his one and only Son...',
    'John 3:16',
    true
  ).then(explanation => {
    console.log(explanation);
  });
}
