import PromptEngine from './prompt-engine.js'
import EmotionController from './emotion-controller.js'
import PersonalityConfig from './personality-config.js'

class EnhancedPromptBuilder {
  constructor() {
    this.promptEngine = new PromptEngine()
    this.emotionController = new EmotionController()
    this.personalityConfig = new PersonalityConfig()
  }

  // 构建发给AI的增强版提示词
  buildEnhancedPrompt(product, options = {}) {
    const {
      warmth = 7,
      vulnerability = 6,
      excitement = 6,
      personality = 'authentic_experiencer',
      audienceAge = '26-35',
      contentGoal = 'engagement',
      includeMetaphors = true,
      trendyLevel = 'moderate'
    } = options

    // 获取个性化配置
    const personalityData = this.personalityConfig.generatePersonalizedParameters(
      personality, 
      { 
        productType: this.getProductType(product),
        audienceAge,
        contentGoal
      }
    )

    // 生成情感表达指导
    const emotionalData = this.emotionController.generateEmotionalExpression(
      warmth, 
      vulnerability, 
      'product_review'
    )

    // 构建完整的AI提示词
    return this.buildAIPrompt(product, personalityData, emotionalData, options)
  }

  // 构建AI提示词
  buildAIPrompt(product, personalityData, emotionalData, options) {
    const { personality, language_patterns } = personalityData
    const { suggestions, intensity } = emotionalData

    const systemPrompt = this.buildSystemPrompt(personality, intensity, suggestions)
    const userPrompt = this.buildUserPrompt(product, personalityData, emotionalData, options)

    return {
      system: systemPrompt,
      user: userPrompt,
      metadata: {
        personality_type: personality.name,
        emotional_tone: intensity.name,
        warmth: options.warmth || 7,
        vulnerability: options.vulnerability || 6,
        excitement: options.excitement || 6
      }
    }
  }

  // 构建系统提示词
  buildSystemPrompt(personality, intensity, suggestions) {
    const personalityDesc = this.getPersonalityDescription(personality)
    const emotionalGuidelines = this.getEmotionalGuidelines(intensity, suggestions)
    const structureRules = this.getStructureRules()
    
    return `你是一位资深的小红书博主，专门撰写真诚、有温度的种草文案。

# 个性设定
${personalityDesc}

# 情感表达指导
${emotionalGuidelines}

# 文案结构要求
${structureRules}

# 输出格式
请严格按照以下格式输出：

标题：[吸引人的标题，12-20个字符]

正文：[文案正文，包含emoji和hashtags]

要求：
1. 必须体现指定的个性特征和情感温度
2. 语言必须符合小红书平台调性
3. 包含3-5个相关的hashtags
4. 真实、有温度、有感染力`
  }

  // 构建用户提示词
  buildUserPrompt(product, personalityData, emotionalData, options) {
    const { personality, language_patterns } = personalityData
    const { suggestions } = emotionalData
    
    const productInfo = this.formatProductInfo(product)
    const styleGuidelines = this.formatStyleGuidelines(personality, suggestions, options)
    
    return `请为以下产品生成小红书文案：

${productInfo}

${styleGuidelines}

请生成一篇符合以上要求的小红书种草文案。`
  }

  // 获取个性描述
  getPersonalityDescription(personality) {
    const descriptions = {
      '谨慎理性型': '你的特点：深思熟虑、注重数据、权衡利弊。常用表达："仔细研究后"、"经过对比分析"、"综合来看"',
      '热情分享型': '你的特点：热情洋溢、强烈推荐、感染力强。常用表达："我必须分享"、"忍不住要安利"、"真的太棒了"',
      '真实体验型': '你的特点：坦诚分享、包含缺点、真实可信。常用表达："说个真心话"、"老实讲"、"我承认"',
      '专业测评型': '你的特点：客观分析、数据导向、专业权威。常用表达："从测评角度"、"客观分析"、"数据显示"',
      '闺蜜聊天型': '你的特点：亲密自然、口语化强、互动频繁。常用表达："姐妹们"、"宝贝们"、"你们懂的"'
    }
    return descriptions[personality.name] || descriptions['真实体验型']
  }

  // 获取情感指导
  getEmotionalGuidelines(intensity, suggestions) {
    const warmthDesc = `情感温度：${intensity.name}（${intensity.color}级别）`
    const expressionExamples = suggestions.openings.slice(0, 3).join('、')
    const emojiSuggestions = suggestions.emojis.slice(0, 5).join('')
    
    return `${warmthDesc}
建议开场：${expressionExamples}
推荐emoji：${emojiSuggestions}
结尾方式：${suggestions.closings.slice(0, 2).join('、')}`
  }

  // 获取结构规则
  getStructureRules() {
    return `- 标题要有吸引力，包含产品名称
- 正文分段清晰，每段不超过3句话
- 必须包含个人真实体验感受
- 适度使用emoji增强表现力
- 结尾要有互动性或行动召唤
- 严禁使用破折号(—)、冒号(:)、双引号("")
- 避免"A而且B"的句式结构`
  }

  // 格式化产品信息
  formatProductInfo(product) {
    return `产品名称：${product.name}
产品描述：${product.summary || '无'}
核心卖点：${(product.sellingPoints || []).join('、')}
目标用户：${product.audience || '年轻用户'}
默认标签：${(product.tagsDefault || []).join('、')}`
  }

  // 格式化风格指导
  formatStyleGuidelines(personality, suggestions, options) {
    return `风格要求：
- 个性类型：${personality.name}
- 情感温度：${options.warmth}/10
- 真实度：${options.vulnerability}/10
- 兴奋度：${options.excitement}/10
- 目标受众：${options.audienceAge}
- 内容目标：${options.contentGoal}`
  }

  // 获取产品类型
  getProductType(product) {
    if (product.category) {
      const categoryMap = {
        '教育': 'education',
        '生活': 'lifestyle', 
        '工具': 'tools',
        '健康': 'health'
      }
      return categoryMap[product.category] || 'lifestyle'
    }
    return 'lifestyle'
  }

  // 随机选择元素
  getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)]
  }
}

export default EnhancedPromptBuilder
