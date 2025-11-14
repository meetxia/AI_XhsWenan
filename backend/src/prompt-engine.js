import fs from 'fs'
import path from 'path'

class PromptEngine {
  constructor() {
    this.rules = null
    this.loadRules()
  }

  loadRules() {
    try {
      // 修复路径问题 - 正确处理当前工作目录
      const currentDir = process.cwd()
      const rulesPath = currentDir.includes('backend') 
        ? path.join(currentDir, 'data/enhanced-prompt-rules.json')
        : path.join(currentDir, 'backend/data/enhanced-prompt-rules.json')
      
      console.log('Loading prompt rules from:', rulesPath)
      this.rules = JSON.parse(fs.readFileSync(rulesPath, 'utf8'))
    } catch (error) {
      console.error('Failed to load prompt rules:', error)
      throw new Error('提示词规则加载失败')
    }
  }

  // 生成个性化提示词
  generatePrompt(options = {}) {
    const {
      productType = 'lifestyle',
      audienceAge = '26-35',
      warmth = 7,
      vulnerability = 6,
      excitement = 6,
      personality = 'social',
      narrative = 'discovery',
      contentLength = 'medium',
      includeMetaphors = true,
      trendyLevel = 'moderate'
    } = options

    // 获取适应性参数
    const productConfig = this.rules.adaptiveParameters.productType[productType] || {}
    const audienceConfig = this.rules.adaptiveParameters.audienceAge[audienceAge] || {}
    
    // 合并配置
    const finalWarmth = warmth || productConfig.warmth || 7
    const finalVulnerability = vulnerability || productConfig.vulnerability || 6
    const finalPersonality = personality || productConfig.personality || 'social'
    const finalNarrative = narrative || productConfig.narrative || 'discovery'

    return this.buildPrompt({
      warmth: finalWarmth,
      vulnerability: finalVulnerability,
      excitement,
      personality: finalPersonality,
      narrative: finalNarrative,
      contentLength,
      includeMetaphors,
      trendyLevel: audienceConfig.trendyWords || trendyLevel,
      vocabularyLevel: audienceConfig.vocabulary || 'casual'
    })
  }

  buildPrompt(config) {
    const sections = []
    
    // 角色设定
    sections.push(this.buildRoleSection(config))
    
    // 核心风格
    sections.push(this.buildStyleSection(config))
    
    // 情感参数
    sections.push(this.buildEmotionalSection(config))
    
    // 个性特征
    sections.push(this.buildPersonalitySection(config))
    
    // 叙事结构
    sections.push(this.buildNarrativeSection(config))
    
    // 互动模式
    sections.push(this.buildInteractionSection(config))
    
    // 语言特色
    sections.push(this.buildLanguageSection(config))
    
    // 内容结构
    sections.push(this.buildStructureSection(config))
    
    // 质量控制
    sections.push(this.buildQualitySection())
    
    // 严格禁忌
    sections.push(this.buildForbiddenSection())

    return sections.join('\n\n')
  }

  buildRoleSection(config) {
    const base = this.rules.basePersonality
    return `# 角色设定
你是${base.name}，${base.description}。
平台：${base.platform}

你的写作风格会根据以下参数动态调整：
- 情感温度：${config.warmth}/10
- 真实脆弱度：${config.vulnerability}/10  
- 兴奋程度：${config.excitement}/10
- 个性类型：${config.personality}
- 叙事结构：${config.narrative}`
  }

  buildStyleSection(config) {
    const styles = this.rules.coreStyles
    const sincerityLevel = this.getSincerityLevel(config.warmth)
    const vocabularyLevel = config.vocabularyLevel
    
    return `# 核心风格要求
1. **${styles.sincerity.name}**：${styles.sincerity.intensityLevels[sincerityLevel]}
2. **${styles.authenticity.name}**：必须使用第一人称"我"，分享${this.getRandomElement(styles.authenticity.experienceTypes)}
3. **${styles.colloquial.name}**：使用${styles.colloquial.vocabularyLevels[vocabularyLevel]}的表达方式`
  }

  buildEmotionalSection(config) {
    const emotional = this.rules.emotionalParameters
    const warmthExpressions = this.getExpressionsByLevel(emotional.warmth.expressions, config.warmth)
    const vulnerabilityExpressions = this.getExpressionsByLevel(emotional.vulnerability.expressions, config.vulnerability)
    const punctuation = this.getExpressionsByLevel(emotional.excitement.punctuation, config.excitement)

    return `# 情感表达指南
**温度表达**（${config.warmth}/10）：优先使用 ${warmthExpressions.join('、')} 等表达
**真实度表达**（${config.vulnerability}/10）：适当使用 ${vulnerabilityExpressions.join('、')} 等表达  
**兴奋度**（${config.excitement}/10）：句末使用 ${punctuation} 标点`
  }

  buildPersonalitySection(config) {
    const trait = this.rules.personalityTraits[config.personality]
    if (!trait) return ''
    
    return `# 个性特征（${trait.name}）
**常用表达**：${trait.phrases.join('、')}
**决策模式**：${trait.decisionPattern}`
  }

  buildNarrativeSection(config) {
    const structure = this.rules.narrativeStructures[config.narrative]
    if (!structure) return ''
    
    return `# 叙事结构（${structure.name}）
**故事流程**：${structure.flow.join(' → ')}
**情感弧线**：${structure.emotionalArc}`
  }

  buildInteractionSection(config) {
    const patterns = this.rules.interactionPatterns
    const selectedPattern = this.getRandomElement(Object.keys(patterns))
    const pattern = patterns[selectedPattern]
    
    return `# 互动模式
**开场方式**：${this.getRandomElement(pattern.starters)}
**中间互动**：${this.getRandomElement(pattern.middles)}  
**结尾引导**：${this.getRandomElement(pattern.endings)}`
  }

  buildLanguageSection(config) {
    const features = this.rules.languageFeatures
    const trendyWords = this.getTrendyWordsByLevel(config.trendyLevel)
    const metaphor = config.includeMetaphors ? this.getRandomElement(features.lifeMetaphors) : ''
    
    return `# 语言特色
**流行用语**：适度使用 ${trendyWords.join('、')}
**生活比喻**：${metaphor}
**感官描述**：结合视觉、触觉、情感等多维度描述`
  }

  buildStructureSection(config) {
    const structure = this.rules.contentStructure
    const hook = this.getRandomElement(Object.values(structure.openingHooks))
    const closing = this.getRandomElement(Object.values(structure.closingPatterns))
    
    return `# 内容结构
**开场钩子**：${hook}
**段落规则**：每段最多${structure.paragraphRules.maxSentences}句话，保持呼吸感
**结尾模式**：${closing}
**Emoji使用**：${structure.paragraphRules.emojiFrequency}`
  }

  buildQualitySection() {
    const quality = this.rules.qualityControls
    
    return `# 质量控制
- 必须包含个人真实体验
- 避免泛泛而谈的表述  
- 包含具体细节描述
- 至少${quality.engagement.minInteractionElements}个互动元素
- 每句话不超过${quality.readability.maxWordsPerSentence}字`
  }

  buildForbiddenSection() {
    const forbidden = this.rules.forbiddenElements
    
    return `# 严格禁忌
**禁用标点**：${forbidden.punctuation.join('、')}
**禁用结构**：${forbidden.structures.join('、')}
**禁用词汇**：${forbidden.words.join('、')}
**禁用短语**：${forbidden.phrases.join('、')}`
  }

  // 辅助方法
  getSincerityLevel(warmth) {
    if (warmth <= 3) return 'subtle'
    if (warmth <= 7) return 'moderate'
    return 'intense'
  }

  getExpressionsByLevel(expressions, level) {
    for (const [range, words] of Object.entries(expressions)) {
      const [min, max] = range.split('-').map(Number)
      if (level >= min && level <= (max || min)) {
        return words
      }
    }
    return expressions['4-6'] || []
  }

  getTrendyWordsByLevel(level) {
    const trendy = this.rules.languageFeatures.trendyWords
    const all = [...trendy['2024'], ...trendy.emotions, ...trendy.approval]
    
    switch (level) {
      case 'high': return all.slice(0, 8)
      case 'moderate': return all.slice(0, 4)
      case 'low': return all.slice(0, 2)
      default: return all.slice(0, 4)
    }
  }

  getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)]
  }

  // 生成情感温度调节的表达库
  generateEmotionalExpressions(warmth, vulnerability, excitement) {
    const expressions = {
      openings: [],
      transitions: [],
      conclusions: []
    }

    // 根据温度生成开场表达
    if (warmth >= 8) {
      expressions.openings.push('我真的要忍不住分享了', '必须安利给你们', '发现了个宝藏')
    } else if (warmth >= 5) {
      expressions.openings.push('想和你们聊聊', '分享个最近的发现', '说个真心话')
    } else {
      expressions.openings.push('客观来说', '从我的体验来看', '简单分享一下')
    }

    // 根据脆弱度生成真实表达
    if (vulnerability >= 7) {
      expressions.transitions.push('说实话我之前也踩过坑', '我承认我当时很焦虑', '老实说我也有过这种困扰')
    } else if (vulnerability >= 4) {
      expressions.transitions.push('虽然开始有点担心', '说实话确实有点小问题', '我也曾经纠结过')
    }

    // 根据兴奋度生成结尾表达
    if (excitement >= 8) {
      expressions.conclusions.push('真的太推荐了！！！', '姐妹们冲鸭！！！', '必须安利！！！')
    } else if (excitement >= 5) {
      expressions.conclusions.push('真的值得试试！', '推荐给需要的人！', '希望对你们有帮助！')
    } else {
      expressions.conclusions.push('供参考。', '可以考虑一下。', '根据需要选择。')
    }

    return expressions
  }
}

export default PromptEngine
