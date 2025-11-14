class EmotionController {
  constructor() {
    this.emotionDatabase = {
      // 情感强度映射
      intensity: {
        1: { name: '冷静', color: '#64748b', keywords: ['客观', '理性', '平静'] },
        2: { name: '淡定', color: '#6b7280', keywords: ['稳重', '从容', '淡然'] },
        3: { name: '温和', color: '#84cc16', keywords: ['温柔', '和缓', '舒适'] },
        4: { name: '友好', color: '#22c55e', keywords: ['亲切', '友善', '温暖'] },
        5: { name: '热情', color: '#f59e0b', keywords: ['积极', '主动', '热心'] },
        6: { name: '兴奋', color: '#f97316', keywords: ['开心', '愉快', '振奋'] },
        7: { name: '激动', color: '#ef4444', keywords: ['激昂', '热烈', '澎湃'] },
        8: { name: '狂热', color: '#dc2626', keywords: ['疯狂', '狂欢', '炽热'] },
        9: { name: '爆发', color: '#b91c1c', keywords: ['爆炸', '沸腾', '燃烧'] },
        10: { name: '极致', color: '#991b1b', keywords: ['极限', '巅峰', '无敌'] }
      },

      // 真实度表达库
      authenticity: {
        low: {
          phrases: ['从客观角度', '根据了解', '据我所知'],
          admissions: ['可能存在', '或许会有', '理论上'],
          experiences: ['听说过', '了解到', '据反馈']
        },
        medium: {
          phrases: ['说实话', '老实讲', '坦白说'],
          admissions: ['确实有点', '不得不承认', '我也遇到过'],
          experiences: ['我试过', '我用过', '我体验了']
        },
        high: {
          phrases: ['不瞒你们说', '说出来不怕笑话', '我必须坦白'],
          admissions: ['我真的很焦虑', '我当时超级紧张', '我差点就放弃了'],
          experiences: ['我亲身经历', '我深有体会', '我感同身受']
        }
      },

      // 情感转折点
      transitions: {
        surprise: ['没想到', '意外的是', '出乎意料', '让我惊讶的是'],
        relief: ['终于', '总算', '还好', '幸运的是'],
        disappointment: ['可惜的是', '遗憾的是', '不过', '但是'],
        excitement: ['更棒的是', '最惊喜的是', '关键是', '重点来了']
      },

      // 互动温度
      interaction: {
        cold: {
          questions: ['你觉得如何？', '有什么看法？'],
          invitations: ['供参考', '仅供了解'],
          closings: ['就这样吧', '说完了']
        },
        warm: {
          questions: ['你们有遇到过吗？', '有同感的举手！'],
          invitations: ['有需要可以问我', '欢迎交流'],
          closings: ['希望有帮助', '我们一起加油']
        },
        hot: {
          questions: ['姐妹们有没有同款经历？', '你们懂我的意思吧？'],
          invitations: ['快来找我聊！', '私信我冲鸭！'],
          closings: ['爱你们！', '么么哒！']
        }
      }
    }
  }

  // 根据温度生成情感表达
  generateEmotionalExpression(warmth, vulnerability, context = 'general') {
    const intensity = this.emotionDatabase.intensity[warmth] || this.emotionDatabase.intensity[5]
    const authLevel = this.getAuthenticityLevel(vulnerability)
    const interactionLevel = this.getInteractionLevel(warmth)

    return {
      intensity: intensity,
      authenticity: this.emotionDatabase.authenticity[authLevel],
      interaction: this.emotionDatabase.interaction[interactionLevel],
      transitions: this.emotionDatabase.transitions,
      suggestions: this.generateContextualSuggestions(warmth, vulnerability, context)
    }
  }

  // 获取真实度级别
  getAuthenticityLevel(vulnerability) {
    if (vulnerability <= 3) return 'low'
    if (vulnerability <= 7) return 'medium'
    return 'high'
  }

  // 获取互动温度级别
  getInteractionLevel(warmth) {
    if (warmth <= 3) return 'cold'
    if (warmth <= 7) return 'warm'
    return 'hot'
  }

  // 生成上下文建议
  generateContextualSuggestions(warmth, vulnerability, context) {
    const suggestions = {
      openings: [],
      emotional_peaks: [],
      closings: [],
      emojis: []
    }

    // 开场建议
    if (warmth >= 8) {
      suggestions.openings.push('我真的忍不住要分享', '必须安利给你们', '发现了个宝藏')
    } else if (warmth >= 5) {
      suggestions.openings.push('想和你们聊聊', '分享个最近的体验', '说个真心话')
    } else {
      suggestions.openings.push('客观分析一下', '简单说说', '从我的角度来看')
    }

    // 情感高潮建议
    if (vulnerability >= 7) {
      suggestions.emotional_peaks.push('我当时真的很焦虑', '说出来不怕你们笑话', '我承认我想错了')
    } else if (vulnerability >= 4) {
      suggestions.emotional_peaks.push('说实话确实有点担心', '我也纠结过', '虽然开始有疑虑')
    }

    // 结尾建议
    if (warmth >= 8) {
      suggestions.closings.push('真的太推荐了！！！', '姐妹们冲鸭！！！', '爱你们！')
    } else if (warmth >= 5) {
      suggestions.closings.push('希望对你们有帮助！', '我们一起加油！', '有问题随时问我！')
    } else {
      suggestions.closings.push('供参考。', '仅个人观点。', '根据需要选择。')
    }

    // Emoji建议
    if (warmth >= 8) {
      suggestions.emojis = ['🔥', '💖', '✨', '🎉', '😍', '🥰']
    } else if (warmth >= 5) {
      suggestions.emojis = ['😊', '👍', '✅', '💪', '🌟', '😄']
    } else {
      suggestions.emojis = ['📝', '💭', '🤔', '📊', '⭐', '👌']
    }

    return suggestions
  }

  // 情感曲线生成
  generateEmotionalArc(narrative, warmth, vulnerability) {
    const arcs = {
      problemSolution: [
        { stage: '困扰', emotion: Math.max(1, warmth - 3), description: '遇到问题时的焦虑' },
        { stage: '寻找', emotion: Math.max(2, warmth - 2), description: '寻找解决方案' },
        { stage: '尝试', emotion: warmth, description: '尝试新方案' },
        { stage: '惊喜', emotion: Math.min(10, warmth + 2), description: '发现效果' },
        { stage: '满足', emotion: Math.min(10, warmth + 1), description: '问题解决' }
      ],
      discovery: [
        { stage: '好奇', emotion: Math.max(3, warmth - 1), description: '初次接触' },
        { stage: '试探', emotion: warmth, description: '小心尝试' },
        { stage: '惊讶', emotion: Math.min(10, warmth + 3), description: '超出预期' },
        { stage: '兴奋', emotion: Math.min(10, warmth + 2), description: '深度体验' },
        { stage: '分享', emotion: Math.min(10, warmth + 1), description: '推荐给他人' }
      ],
      transformation: [
        { stage: '不满', emotion: Math.max(2, warmth - 2), description: '对现状不满' },
        { stage: '机会', emotion: warmth, description: '遇到改变契机' },
        { stage: '努力', emotion: Math.max(4, warmth), description: '付出努力' },
        { stage: '收获', emotion: Math.min(10, warmth + 2), description: '看到成果' },
        { stage: '成长', emotion: Math.min(10, warmth + 1), description: '完成转变' }
      ]
    }

    return arcs[narrative] || arcs.discovery
  }

  // 生成个性化表达包
  generatePersonalizedExpressions(personality, warmth, vulnerability) {
    const expressions = {
      cautious: {
        decision_words: ['仔细考虑后', '反复对比', '慎重选择', '深思熟虑'],
        emotion_modifiers: warmth >= 7 ? ['确实很棒', '真的不错'] : ['还可以', '比较满意'],
        vulnerability_admits: vulnerability >= 6 ? ['我也曾经很纠结', '说实话我也担心过'] : ['稍有顾虑', '略有担心']
      },
      impulsive: {
        decision_words: ['一眼就爱了', '立马下单', '不管了直接冲', '看到就想要'],
        emotion_modifiers: warmth >= 7 ? ['爱死了', '太绝了'] : ['还不错', '挺喜欢'],
        vulnerability_admits: vulnerability >= 6 ? ['我承认我很冲动', '我就是控制不住'] : ['可能有点急躁', '确实比较冲动']
      },
      analytical: {
        decision_words: ['从数据来看', '对比分析后', '综合评估', '理性选择'],
        emotion_modifiers: warmth >= 7 ? ['数据很亮眼', '表现超预期'] : ['数据不错', '表现合格'],
        vulnerability_admits: vulnerability >= 6 ? ['我承认之前判断有误', '数据让我改变了看法'] : ['略有偏差', '需要调整预期']
      },
      social: {
        decision_words: ['朋友推荐的', '大家都在用', '闺蜜安利', '跟风试试'],
        emotion_modifiers: warmth >= 7 ? ['朋友们都爱了', '大家反响超好'] : ['朋友说不错', '大家评价还行'],
        vulnerability_admits: vulnerability >= 6 ? ['我承认我就是跟风', '朋友圈看到就心动了'] : ['确实受朋友影响', '看到推荐就想试']
      }
    }

    return expressions[personality] || expressions.social
  }

  // 动态调节建议
  getDynamicAdjustments(currentWarmth, currentVulnerability, targetAudience) {
    const adjustments = {
      warmth: currentWarmth,
      vulnerability: currentVulnerability,
      suggestions: []
    }

    // 根据目标受众调整
    if (targetAudience === '18-25') {
      if (currentWarmth < 7) {
        adjustments.warmth = Math.min(10, currentWarmth + 2)
        adjustments.suggestions.push('年轻受众偏好更高的情感温度')
      }
    } else if (targetAudience === '36+') {
      if (currentWarmth > 7) {
        adjustments.warmth = Math.max(1, currentWarmth - 2)
        adjustments.suggestions.push('成熟受众偏好更稳重的表达')
      }
    }

    // 真实度平衡建议
    if (currentVulnerability < 4) {
      adjustments.suggestions.push('适当增加真实度可提升可信度')
    } else if (currentVulnerability > 8) {
      adjustments.suggestions.push('过高的脆弱度可能影响专业性')
    }

    return adjustments
  }
}

export default EmotionController
