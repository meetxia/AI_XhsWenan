import EnhancedGenerator from './enhanced-generator.js'
import PersonalityConfig from './personality-config.js'

class EnhancedAPI {
  constructor() {
    this.generator = new EnhancedGenerator()
    this.personalityConfig = new PersonalityConfig()
  }

  // 生成个性化文案
  async generatePersonalizedCopy(req, res) {
    try {
      const {
        product,
        style = 'authentic_experiencer',
        warmth = 7,
        vulnerability = 6,
        excitement = 6,
        audienceAge = '26-35',
        contentGoal = 'engagement'
      } = req.body

      if (!product) {
        return res.status(400).json({ error: '产品信息不能为空' })
      }

      const result = this.generator.generateEnhancedCopy(product, {
        personality: style,
        warmth,
        vulnerability,
        excitement,
        audienceAge,
        contentGoal
      })

      res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      })

    } catch (error) {
      console.error('Enhanced copy generation error:', error)
      res.status(500).json({
        error: '文案生成失败',
        message: error.message
      })
    }
  }

  // 获取个性推荐
  async getPersonalityRecommendation(req, res) {
    try {
      const { productType, audienceAge, contentGoal, brandTone } = req.body

      const recommendation = this.personalityConfig.recommendPersonality({
        productType,
        audienceAge,
        contentGoal,
        brandTone
      })

      res.json({
        success: true,
        data: recommendation
      })

    } catch (error) {
      res.status(500).json({
        error: '推荐失败',
        message: error.message
      })
    }
  }

  // 获取可用个性类型
  async getPersonalityTypes(req, res) {
    try {
      const personalities = Object.keys(this.personalityConfig.personalityProfiles)
        .map(key => {
          const profile = this.personalityConfig.personalityProfiles[key]
          return {
            id: key,
            name: profile.name,
            description: profile.description,
            traits: profile.traits
          }
        })

      res.json({
        success: true,
        data: personalities
      })

    } catch (error) {
      res.status(500).json({
        error: '获取个性类型失败',
        message: error.message
      })
    }
  }
}

export default EnhancedAPI
