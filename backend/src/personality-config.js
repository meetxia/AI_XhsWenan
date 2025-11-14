class PersonalityConfig {
  constructor() {
    this.personalityProfiles = {
      // 谨慎理性型
      cautious_rational: {
        name: '谨慎理性型',
        description: '深思熟虑，注重数据和逻辑',
        traits: {
          decision_making: 'analytical',
          risk_tolerance: 'low',
          expression_style: 'measured',
          trust_building: 'evidence_based'
        },
        language_patterns: {
          openings: ['仔细研究后', '经过对比分析', '从多个维度考虑'],
          qualifiers: ['相对来说', '在一定程度上', '根据我的观察'],
          conclusions: ['综合来看', '权衡利弊后', '基于实际体验'],
          emotional_modifiers: ['确实', '的确', '客观地说']
        },
        parameter_preferences: {
          warmth: { min: 4, max: 7, default: 5 },
          vulnerability: { min: 3, max: 6, default: 4 },
          excitement: { min: 3, max: 6, default: 4 }
        }
      },

      // 热情分享型
      enthusiastic_sharer: {
        name: '热情分享型',
        description: '热爱分享，情感丰富，感染力强',
        traits: {
          decision_making: 'intuitive',
          risk_tolerance: 'medium',
          expression_style: 'expressive',
          trust_building: 'emotional_connection'
        },
        language_patterns: {
          openings: ['我必须分享', '忍不住要安利', '发现了个宝藏'],
          qualifiers: ['真的', '超级', '特别'],
          conclusions: ['强烈推荐', '真的值得', '你们一定要试试'],
          emotional_modifiers: ['爱了爱了', '太棒了', '绝绝子']
        },
        parameter_preferences: {
          warmth: { min: 7, max: 10, default: 8 },
          vulnerability: { min: 6, max: 9, default: 7 },
          excitement: { min: 7, max: 10, default: 8 }
        }
      },

      // 真实体验型
      authentic_experiencer: {
        name: '真实体验型',
        description: '注重真实感受，坦诚分享得失',
        traits: {
          decision_making: 'experience_based',
          risk_tolerance: 'medium',
          expression_style: 'honest',
          trust_building: 'vulnerability'
        },
        language_patterns: {
          openings: ['说个真心话', '不瞒你们', '老实讲'],
          qualifiers: ['说实话', '坦白说', '我承认'],
          conclusions: ['这是我的真实感受', '希望对你们诚实有帮助', '分享我的真实体验'],
          emotional_modifiers: ['确实', '真的', '的确']
        },
        parameter_preferences: {
          warmth: { min: 6, max: 8, default: 7 },
          vulnerability: { min: 7, max: 10, default: 8 },
          excitement: { min: 5, max: 7, default: 6 }
        }
      },

      // 专业测评型
      professional_reviewer: {
        name: '专业测评型',
        description: '客观专业，注重细节和数据',
        traits: {
          decision_making: 'systematic',
          risk_tolerance: 'low',
          expression_style: 'professional',
          trust_building: 'expertise'
        },
        language_patterns: {
          openings: ['从测评角度', '客观分析', '数据显示'],
          qualifiers: ['根据测试', '从数据来看', '实际表现'],
          conclusions: ['综合评分', '推荐指数', '适用人群'],
          emotional_modifiers: ['表现', '水准', '质量']
        },
        parameter_preferences: {
          warmth: { min: 3, max: 6, default: 4 },
          vulnerability: { min: 2, max: 5, default: 3 },
          excitement: { min: 3, max: 5, default: 4 }
        }
      },

      // 闺蜜聊天型
      bestie_chat: {
        name: '闺蜜聊天型',
        description: '亲密自然，像和最好的朋友聊天',
        traits: {
          decision_making: 'social',
          risk_tolerance: 'high',
          expression_style: 'intimate',
          trust_building: 'friendship'
        },
        language_patterns: {
          openings: ['姐妹们', '宝贝们', '我的天'],
          qualifiers: ['你们懂的', '就是那种感觉', '你知道吧'],
          conclusions: ['爱你们', '么么哒', '有问题随时找我'],
          emotional_modifiers: ['超级', '巨', 'yyds']
        },
        parameter_preferences: {
          warmth: { min: 8, max: 10, default: 9 },
          vulnerability: { min: 7, max: 10, default: 8 },
          excitement: { min: 8, max: 10, default: 9 }
        }
      }
    }

    this.adaptiveRules = {
      // 根据产品类型调整个性
      product_adaptation: {
        education: {
          preferred_personalities: ['cautious_rational', 'professional_reviewer'],
          adjustments: { warmth: -1, vulnerability: -1, excitement: -1 }
        },
        lifestyle: {
          preferred_personalities: ['enthusiastic_sharer', 'bestie_chat'],
          adjustments: { warmth: +1, vulnerability: +1, excitement: +1 }
        },
        tools: {
          preferred_personalities: ['authentic_experiencer', 'cautious_rational'],
          adjustments: { warmth: 0, vulnerability: +1, excitement: 0 }
        },
        health: {
          preferred_personalities: ['authentic_experiencer', 'cautious_rational'],
          adjustments: { warmth: 0, vulnerability: +2, excitement: -1 }
        }
      },

      // 根据受众年龄调整
      audience_adaptation: {
        '18-25': {
          adjustments: { warmth: +2, excitement: +2, trendy_words: 'high' },
          preferred_interactions: ['bestie_chat', 'enthusiastic_sharer']
        },
        '26-35': {
          adjustments: { warmth: 0, excitement: 0, trendy_words: 'medium' },
          preferred_interactions: ['authentic_experiencer', 'enthusiastic_sharer']
        },
        '36+': {
          adjustments: { warmth: -1, excitement: -1, trendy_words: 'low' },
          preferred_interactions: ['cautious_rational', 'professional_reviewer']
        }
      }
    }
  }

  // 获取个性配置
  getPersonalityConfig(personalityType) {
    return this.personalityProfiles[personalityType] || this.personalityProfiles.authentic_experiencer
  }

  // 根据上下文推荐个性类型
  recommendPersonality(context) {
    const { productType, audienceAge, contentGoal, brandTone } = context
    
    let scores = {}
    
    // 为每种个性类型计算适配分数
    Object.keys(this.personalityProfiles).forEach(personality => {
      scores[personality] = this.calculatePersonalityScore(personality, context)
    })

    // 返回得分最高的个性类型
    const recommended = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b)
    
    return {
      recommended,
      scores,
      explanation: this.explainRecommendation(recommended, context)
    }
  }

  // 计算个性适配分数
  calculatePersonalityScore(personality, context) {
    const profile = this.personalityProfiles[personality]
    let score = 50 // 基础分数

    // 产品类型适配
    const productAdaptation = this.adaptiveRules.product_adaptation[context.productType]
    if (productAdaptation && productAdaptation.preferred_personalities.includes(personality)) {
      score += 20
    }

    // 受众年龄适配
    const audienceAdaptation = this.adaptiveRules.audience_adaptation[context.audienceAge]
    if (audienceAdaptation && audienceAdaptation.preferred_interactions.includes(personality)) {
      score += 15
    }

    // 内容目标适配
    if (context.contentGoal === 'trust_building' && profile.traits.trust_building === 'vulnerability') {
      score += 10
    }
    if (context.contentGoal === 'engagement' && profile.traits.expression_style === 'expressive') {
      score += 10
    }
    if (context.contentGoal === 'conversion' && profile.traits.decision_making === 'systematic') {
      score += 10
    }

    // 品牌调性适配
    if (context.brandTone === 'professional' && personality === 'professional_reviewer') {
      score += 15
    }
    if (context.brandTone === 'friendly' && personality === 'bestie_chat') {
      score += 15
    }

    return score
  }

  // 解释推荐理由
  explainRecommendation(personality, context) {
    const profile = this.personalityProfiles[personality]
    const reasons = []

    if (context.productType === 'education' && personality === 'cautious_rational') {
      reasons.push('教育类产品适合理性谨慎的表达方式')
    }
    if (context.audienceAge === '18-25' && personality === 'bestie_chat') {
      reasons.push('年轻受众偏好亲密自然的沟通风格')
    }
    if (context.contentGoal === 'trust_building' && personality === 'authentic_experiencer') {
      reasons.push('建立信任需要真实坦诚的分享')
    }

    return reasons.length > 0 ? reasons.join('；') : `${profile.name}适合当前场景`
  }

  // 生成个性化参数
  generatePersonalizedParameters(personality, context = {}) {
    const profile = this.getPersonalityConfig(personality)
    const params = { ...profile.parameter_preferences }

    // 应用上下文调整
    if (context.productType) {
      const adaptation = this.adaptiveRules.product_adaptation[context.productType]
      if (adaptation) {
        Object.keys(adaptation.adjustments).forEach(key => {
          if (params[key]) {
            const adjustment = adaptation.adjustments[key]
            params[key].default = Math.max(
              params[key].min,
              Math.min(params[key].max, params[key].default + adjustment)
            )
          }
        })
      }
    }

    if (context.audienceAge) {
      const adaptation = this.adaptiveRules.audience_adaptation[context.audienceAge]
      if (adaptation) {
        Object.keys(adaptation.adjustments).forEach(key => {
          if (params[key]) {
            const adjustment = adaptation.adjustments[key]
            params[key].default = Math.max(
              params[key].min,
              Math.min(params[key].max, params[key].default + adjustment)
            )
          }
        })
      }
    }

    return {
      personality: profile,
      parameters: params,
      language_patterns: profile.language_patterns
    }
  }

  // 生成风格一致性检查
  validateStyleConsistency(content, personality) {
    const profile = this.getPersonalityConfig(personality)
    const issues = []
    const suggestions = []

    // 检查语言模式一致性
    const hasOpeningPattern = profile.language_patterns.openings.some(pattern => 
      content.includes(pattern)
    )
    if (!hasOpeningPattern) {
      issues.push('缺少符合个性的开场表达')
      suggestions.push(`建议使用：${profile.language_patterns.openings.join('、')}`)
    }

    // 检查情感强度一致性
    const emotionalWords = profile.language_patterns.emotional_modifiers
    const hasEmotionalConsistency = emotionalWords.some(word => content.includes(word))
    if (!hasEmotionalConsistency) {
      issues.push('情感表达与个性不符')
      suggestions.push(`建议使用：${emotionalWords.join('、')}`)
    }

    return {
      isConsistent: issues.length === 0,
      issues,
      suggestions,
      score: Math.max(0, 100 - issues.length * 20)
    }
  }

  // 获取个性化模板
  getPersonalizedTemplates(personality) {
    const profile = this.getPersonalityConfig(personality)
    
    return {
      title_templates: this.generateTitleTemplates(profile),
      opening_templates: this.generateOpeningTemplates(profile),
      transition_templates: this.generateTransitionTemplates(profile),
      closing_templates: this.generateClosingTemplates(profile)
    }
  }

  generateTitleTemplates(profile) {
    const patterns = profile.language_patterns
    return [
      `${patterns.openings[0]}：{{product_name}}`,
      `{{product_name}} ${patterns.emotional_modifiers[0]}体验`,
      `${patterns.qualifiers[0]}，{{product_name}}值得推荐`
    ]
  }

  generateOpeningTemplates(profile) {
    const patterns = profile.language_patterns
    return [
      `${patterns.openings[0]}，{{product_name}}{{emotional_modifier}}`,
      `${patterns.qualifiers[0]}，我对{{product_name}}的感受是...`,
      `关于{{product_name}}，${patterns.openings[1]}`
    ]
  }

  generateTransitionTemplates(profile) {
    return [
      `${profile.language_patterns.qualifiers[0]}，最让我印象深刻的是...`,
      `使用过程中，我发现...`,
      `${profile.language_patterns.emotional_modifiers[0]}的部分是...`
    ]
  }

  generateClosingTemplates(profile) {
    const patterns = profile.language_patterns
    return [
      `${patterns.conclusions[0]}，希望对你们有帮助`,
      `这就是我的真实感受，${patterns.conclusions[1]}`,
      `${patterns.conclusions[2]}，有问题可以问我`
    ]
  }
}

export default PersonalityConfig
