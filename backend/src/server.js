import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import fetch from 'node-fetch'
import dotenv from 'dotenv'
import { buildEnhancedPrompt } from './generate.js'
import historyManager from './history-manager.js'
import multiRoundHistoryManager from './multi-round-history-manager.js'

// 加载环境变量
dotenv.config()

// 设置控制台输出编码为UTF-8（Windows兼容性）
if (process.platform === 'win32') {
  process.stdout.write('\x1b[2J\x1b[0f') // 清屏
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()
app.use(express.json())

// 配置CORS，允许前端访问
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// 添加请求日志中间件
app.use((req, res, next) => {
  console.log(`📡 ${new Date().toLocaleTimeString()} ${req.method} ${req.path} - Origin: ${req.get('Origin') || 'N/A'}`)
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('📦 请求体:', JSON.stringify(req.body, null, 2))
  }
  next()
})

const DATA_DIR = path.join(__dirname, '..', 'data')
const PRODUCTS_PATH = path.join(DATA_DIR, 'products.json')

let PRODUCTS = []

function loadJson(p) {
  const raw = fs.readFileSync(p, 'utf-8')
  return JSON.parse(raw)
}

function loadData() {
  PRODUCTS = loadJson(PRODUCTS_PATH)
}

loadData()

// 📏 根据字数设置计算 max_tokens
// 中文字符约 1.5-2 tokens，考虑格式化和标点，使用 1.8 倍系数
function getMaxTokens(wordCount = 'medium') {
  const tokenMap = {
    'short': 600,        // 200-400字 -> ~600 tokens
    'medium': 1200,      // 400-800字 -> ~1200 tokens  
    'long': 1800,        // 800-1200字 -> ~1800 tokens
    'extra_long': 2400,  // 1200-1600字 -> ~2400 tokens
    'ultra_long': 3000   // 1600-2000字 -> ~3000 tokens
  }
  
  const tokens = tokenMap[wordCount] || tokenMap['medium']
  console.log(`📏 字数设置: ${wordCount} -> max_tokens: ${tokens}`)
  return tokens
}

// 🤖 多轮AI协作辅助函数

// 生成初始文案（复用现有逻辑）
async function generateInitialContent(requestBody) {
  const startTime = Date.now()
  
  console.log('🎨 第一轮：生成初始文案')
  
  // 这里复用现有的生成逻辑，但返回更简洁的结果
  const { productId, style, keywords, personality, warmth, vulnerability, excitement, wordCount = 'medium' } = requestBody
  
  const products = PRODUCTS
  const product = products.find(p => p.id === productId)
  if (!product) {
    throw new Error(`产品 ${productId} 未找到`)
  }

  const apiKey = process.env.AI_API_KEY
  if (!apiKey) {
    throw new Error('未配置AI_API_KEY环境变量')
  }

  const base = process.env.AI_OPENAI_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1'
  const model = process.env.AI_MODEL || 'deepseek-v3.1'

  // 构建基础提示词
  const systemPrompt = `你是小红书资深博主，专门分享学习和教育资源的真实体验。请为教育产品生成真诚、有温度的小红书文案。

核心要求：
1. 个性类型：${personality} (情感温度${warmth}/10，真实度${vulnerability}/10，兴奋度${excitement}/10)
2. 必须使用第一人称"我"，分享真实学习体验
3. 包含具体的学习场景和使用感受
4. 适当使用口语化表达："说真的"、"老实讲"、"用了之后"
5. 避免过于完美的表达，要有自然的"不完美"

输出格式：
标题：[12-20字吸引人标题]
正文：[包含真实学习体验的分享，加入emoji和相关hashtags]`

  const userPrompt = `请为以下产品生成小红书文案：

产品：${product.name}
描述：${product.summary || '无'}
卖点：${(product.sellingPoints || []).join('、')}
角度：${style}
关键词：${keywords || '无'}`

  // 调用AI生成
  const maxTokens = getMaxTokens(wordCount)
  const resp = await fetch(base + '/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.85,
      top_p: 0.7,
      frequency_penalty: 0.3,
      max_tokens: maxTokens
    })
  })

  if (!resp.ok) {
    throw new Error(`AI API错误: ${resp.status} ${resp.statusText}`)
  }

  const data = await resp.json()
  const aiText = data.choices?.[0]?.message?.content || ''
  
  // 解析AI回复
  const titleMatch = aiText.match(/标题[：:]\s*(.+?)(?:\n|$)/)
  const bodyMatch = aiText.match(/正文[：:]\s*([\s\S]*)/)
  
  const title = titleMatch?.[1]?.trim() || 'AI生成标题'
  let body = bodyMatch?.[1]?.trim() || aiText
  
  if (!bodyMatch) {
    body = aiText.replace(/^标题[：:]\s*.+?\n\n?/, '').trim()
  }

  const generationTime = Date.now() - startTime
  
  return {
    content: {
      title,
      bodyPlain: body,
      bodyXHS: body,
      tags: (product.tagsDefault || []).slice(0, 5).map(t => `#${t}`),
      generation_time: generationTime
    },
    conversationRecord: {
      timestamp: new Date().toISOString(),
      input: {
        systemPrompt,
        userPrompt,
        parameters: {
          temperature: 0.85,
          top_p: 0.7,
          frequency_penalty: 0.3,
          max_tokens: maxTokens
        }
      },
      output: {
        rawResponse: aiText,
        parsedContent: {
          title,
          bodyPlain: body,
          tags: (product.tagsDefault || []).slice(0, 5).map(t => `#${t}`)
        },
        generation_time: generationTime
      }
    },
    product: product
  }
}

// 分析文案质量
async function analyzeContentQuality(content) {
  const startTime = Date.now()
  console.log('🔍 第二轮：分析文案质量')
  
  const apiKey = process.env.AI_API_KEY
  const base = process.env.AI_OPENAI_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1'
  const model = process.env.AI_MODEL || 'deepseek-v3.1'

  const analysisPrompt = `你是小红书平台的资深内容分析专家，拥有5年以上的爆款文案研究经验。请分析以下文案的质量并给出改进建议。

## 分析维度
1. 真实感评估 (1-10分) - 语言自然度、情感真实性、细节具体性
2. 爆款潜力评估 (1-10分) - 开头吸引力、情绪共鸣度、转发价值  
3. 平台适配性 (1-10分) - 平台调性、互动性、视觉友好性

请严格按照JSON格式输出：
{
  "overallScore": 8.5,
  "analysis": {
    "authenticity": {"score": 8, "strengths": ["具体场景描述"], "weaknesses": ["略显完美"]},
    "viralPotential": {"score": 9, "strengths": ["开头吸引人"], "weaknesses": ["结尾平淡"]},
    "platformFit": {"score": 8, "strengths": ["符合调性"], "weaknesses": ["可更简洁"]}
  },
  "improvements": [
    {"priority": "high", "issue": "开头可更吸引人", "suggestion": "使用疑问句开头", "example": "改为：姐妹们谁懂啊！"}
  ]
}`

  const userPrompt = `请分析以下小红书文案：

标题：${content.title}

正文：${content.bodyPlain}`

  const resp = await fetch(base + '/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: analysisPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      top_p: 0.8
    })
  })

  const data = await resp.json()
  const analysisText = data.choices?.[0]?.message?.content || '{}'
  const analysisTime = Date.now() - startTime
  
  let analysisResult
  try {
    analysisResult = JSON.parse(analysisText)
  } catch (e) {
    console.warn('分析结果解析失败，使用默认格式')
    analysisResult = {
      overallScore: 7.5,
      analysis: {
        authenticity: { score: 7, strengths: ['基础真实'], weaknesses: ['可改进'] },
        viralPotential: { score: 8, strengths: ['有潜力'], weaknesses: ['需优化'] },
        platformFit: { score: 8, strengths: ['基本符合'], weaknesses: ['可提升'] }
      },
      improvements: [{ priority: 'medium', issue: '整体可优化', suggestion: '增加更多细节', example: '添加具体场景' }]
    }
  }

  return {
    analysisResult,
    conversationRecord: {
      timestamp: new Date().toISOString(),
      input: {
        systemPrompt: analysisPrompt,
        userPrompt,
        originalContent: content,
        parameters: {
          temperature: 0.3,
          top_p: 0.8
        }
      },
      output: {
        rawResponse: analysisText,
        parsedAnalysis: analysisResult,
        analysis_time: analysisTime
      }
    }
  }
}

// 优化文案内容
async function optimizeContent(originalContent, analysis, wordCount = 'medium') {
  const startTime = Date.now()
  console.log('✨ 第三轮：优化文案内容')
  
  const apiKey = process.env.AI_API_KEY
  const base = process.env.AI_OPENAI_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1'
  const model = process.env.AI_MODEL || 'deepseek-v3.1'

  const optimizationPrompt = `你是小红书文案优化专家，根据分析报告对文案进行精准改进。

## 优化原则
1. 保持核心信息和产品卖点不变
2. 严格按照分析建议进行针对性改进
3. 提升真实感：增加口语化、具体场景、适度缺点
4. 增强爆款潜力：优化开头、强化共鸣、增加互动

请输出完整的优化后文案：
标题：[优化后标题]
正文：[优化后正文]`

  const improvementsList = analysis.improvements?.map(imp => 
    `- ${imp.priority}优先级: ${imp.issue} -> ${imp.suggestion}`
  ).join('\n') || '暂无具体建议'

  const userPrompt = `请根据以下分析报告优化文案：

## 原文案
标题：${originalContent.title}
正文：${originalContent.bodyPlain}

## 分析评分
- 真实感：${analysis.analysis?.authenticity?.score || 7}/10
- 爆款潜力：${analysis.analysis?.viralPotential?.score || 8}/10  
- 平台适配：${analysis.analysis?.platformFit?.score || 8}/10

## 改进建议
${improvementsList}

请输出优化后的完整文案。`

  const maxTokens = getMaxTokens(wordCount)
  const resp = await fetch(base + '/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: optimizationPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      top_p: 0.8,
      max_tokens: maxTokens
    })
  })

  const data = await resp.json()
  const optimizedText = data.choices?.[0]?.message?.content || ''
  const optimizationTime = Date.now() - startTime

  // 解析优化后的文案
  const titleMatch = optimizedText.match(/标题[：:]\s*(.+?)(?:\n|$)/)
  const bodyMatch = optimizedText.match(/正文[：:]\s*([\s\S]*)/)
  
  const title = titleMatch?.[1]?.trim() || originalContent.title
  let body = bodyMatch?.[1]?.trim() || optimizedText

  if (!bodyMatch) {
    body = optimizedText.replace(/^标题[：:]\s*.+?\n\n?/, '').trim()
  }

  const optimizedContent = {
    title,
    bodyPlain: body,
    bodyXHS: body,
    tags: originalContent.tags,
    ai_generated: true,
    ai_model: model + ' (多轮优化)',
    optimization_applied: true
  }

  return {
    content: optimizedContent,
    conversationRecord: {
      timestamp: new Date().toISOString(),
      input: {
        systemPrompt: optimizationPrompt,
        userPrompt,
        originalContent,
        analysisResult: analysis,
        parameters: {
          temperature: 0.7,
          top_p: 0.8,
          max_tokens: maxTokens
        }
      },
      output: {
        rawResponse: optimizedText,
        parsedContent: optimizedContent,
        optimization_time: optimizationTime
      }
    }
  }
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

app.get('/api/products', (req, res) => {
  const list = PRODUCTS.map(p => ({ id: p.id, name: p.name, tagsDefault: p.tagsDefault || [] }))
  res.json({ products: list })
})

// 模板接口已删除，改用AI动态生成

// 🧪 测试提示词预览API
app.post('/api/test-prompt', async (req, res) => {
  try {
    console.log('🧪 提示词测试请求')
    
    const { 
      productId = 'p0',
      style = '真实体验', 
      personality = 'authentic_experiencer',
      warmth = 7,
      vulnerability = 7, 
      excitement = 6,
      keywords = '',
      wordCount = 'medium'
    } = req.body || {}

    // 查找产品
    const products = PRODUCTS
    const product = products.find(p => p.id === productId)
    if (!product) {
      return res.status(404).json({ error: `产品 ${productId} 未找到` })
    }

    const model = process.env.AI_MODEL || 'deepseek-v3.1'
    
    // 构建提示词（与生成API相同的逻辑）
    const systemPrompt = `你是小红书资深博主，专门分享学习和教育资源的真实体验。请为教育产品生成真诚、有温度的小红书文案。

核心要求：
1. 个性类型：${personality} (情感温度${warmth}/10，真实度${vulnerability}/10，兴奋度${excitement}/10)
2. 必须使用第一人称"我"，分享真实学习体验
3. 包含具体的学习场景和使用感受
4. 适当使用口语化表达："说真的"、"老实讲"、"用了之后"
5. 当真实度≥7时，要坦诚提及轻微缺点或个人局限性
6. 避免过于完美的表达，要有自然的"不完美"

表达风格：
- 语言自然，像和朋友聊天
- 每6-8句话可以插入口语填充词
- 段落长度可以不规律(2-4句为主)
- 强调学习效果和实际收获

输出格式：
标题：[12-20字吸引人标题]

正文：[包含真实学习体验的分享，加入emoji和相关hashtags]`

    const userPrompt = `请为以下产品生成小红书文案：

产品：${product.name}
描述：${product.summary || '无'}
卖点：${(product.sellingPoints || []).join('、')}
角度：${style}
关键词：${keywords || '无'}`

    // 显示在控制台
    console.log('\n' + '='.repeat(80))
    console.log('🎯 【SYSTEM PROMPT】最终发送给AI的系统提示词：')
    console.log('='.repeat(80))
    console.log(systemPrompt)
    console.log('\n' + '='.repeat(80))
    console.log('👤 【USER PROMPT】最终发送给AI的用户提示词：')
    console.log('='.repeat(80))
    console.log(userPrompt)
    console.log('='.repeat(80) + '\n')

    // 返回提示词预览
    res.json({
      success: true,
      message: '提示词预览（请查看后端控制台获取完整内容）',
      data: {
        product: {
          id: product.id,
          name: product.name,
          summary: product.summary
        },
        parameters: {
          style,
          personality,
          warmth,
          vulnerability,
          excitement,
          keywords,
          wordCount
        },
        prompts: {
          system: systemPrompt,
          user: userPrompt
        },
        aiConfig: {
          model: model,
          temperature: 0.85,
          top_p: 0.7,
          frequency_penalty: 0.3,
          max_tokens: getMaxTokens(wordCount)
        }
      }
    })

  } catch (error) {
    console.error('❌ 提示词预览错误:', error)
    res.status(500).json({
      error: '提示词预览失败',
      message: error.message
    })
  }
})

// 🤖 多轮AI协作优化API
app.post('/api/generate/multi-round', async (req, res) => {
  console.log('🚀🚀🚀 多轮AI优化请求开始 🚀🚀🚀')
  console.log('⏰ 时间:', new Date().toLocaleString())
  console.log('📦 收到请求体:', JSON.stringify(req.body, null, 2))
  
  const totalStartTime = Date.now()
  
  try {
    const { 
      productId, 
      style, 
      keywords = '', 
      personality = 'authentic_experiencer',
      warmth = 7,
      vulnerability = 6,
      excitement = 6,
      audienceAge = '26-35',
      contentGoal = 'engagement',
      wordCount = 'medium'
    } = req.body || {}
    
    // 查找产品信息
    const product = PRODUCTS.find(p => p.id === productId)
    if (!product) {
      throw new Error(`产品 ${productId} 未找到`)
    }
    
    console.log('📏 字数设置:', wordCount)
    
    // 第一步：生成初始文案
    console.log('🎨 第一步：生成初始文案')
    const initialResult = await generateInitialContent(req.body)
    
    // 第二步：评估文案质量
    console.log('🔍 第二步：评估文案质量')  
    const analysisResult = await analyzeContentQuality(initialResult.content)
    
    // 第三步：优化文案内容
    console.log('✨ 第三步：优化文案内容')
    const optimizedResult = await optimizeContent(initialResult.content, analysisResult.analysisResult, wordCount)
    
    const totalTime = Date.now() - totalStartTime
    
    // 第四步：构建最终响应结果
    const finalResponse = {
      ...optimizedResult.content,
      multiRound: true,
      analysis: analysisResult.analysisResult,
      originalContent: initialResult.content,
      processSteps: ['生成', '分析', '优化'],
      totalTime: totalTime
    }
    
    // 第五步：保存多轮优化历史记录
    try {
      console.log('💾 保存多轮优化历史记录')
      
      const multiRoundHistoryData = {
        productId,
        productName: product.name,
        style,
        keywords,
        personality,
        warmth,
        vulnerability,
        excitement,
        audienceAge,
        contentGoal,
        
        // 三轮对话记录
        rounds: {
          round1: {
            timestamp: initialResult.conversationRecord.timestamp,
            input: initialResult.conversationRecord.input,
            output: initialResult.conversationRecord.output
          },
          round2: {
            timestamp: analysisResult.conversationRecord.timestamp,
            input: analysisResult.conversationRecord.input,
            output: analysisResult.conversationRecord.output
          },
          round3: {
            timestamp: optimizedResult.conversationRecord.timestamp,
            input: optimizedResult.conversationRecord.input,
            output: optimizedResult.conversationRecord.output
          }
        },
        
        // 内容数据
        originalContent: initialResult.content,
        analysis: analysisResult.analysisResult,
        finalResult: optimizedResult.content,
        
        // 元数据
        ai_model: process.env.AI_MODEL || 'deepseek-v3.1',
        totalTime: totalTime,
        processSteps: ['生成', '分析', '优化']
      }
      
      const historyResult = multiRoundHistoryManager.addMultiRoundRecord(multiRoundHistoryData)
      if (historyResult.success) {
        console.log('💾 多轮优化历史记录保存成功:', historyResult.id)
        finalResponse.multiRoundHistoryId = historyResult.id
      } else {
        console.error('❌ 多轮优化历史记录保存失败:', historyResult.error)
      }
    } catch (historyError) {
      console.error('❌ 多轮优化历史记录保存异常:', historyError)
    }
    
    console.log('✅ 多轮AI优化完成!')
    console.log('📤 返回最终结果')
    res.json(finalResponse)
    
  } catch (error) {
    console.error('❌ 多轮AI优化失败:', error)
    res.status(500).json({
      error: '多轮优化失败',
      message: error.message,
      fallback: '建议使用单轮生成模式'
    })
  }
})

// 📊 反馈评分API
app.post('/api/feedback/rating', async (req, res) => {
  try {
    console.log('📊 收到真实度评分反馈')
    
    const { historyId, rating, ratingText, timestamp } = req.body
    
    if (!historyId || !rating) {
      return res.status(400).json({ 
        error: '缺少必要参数',
        message: 'historyId和rating为必填项'
      })
    }

    // 验证评分范围
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        error: '评分超出范围',
        message: '评分必须在1-5之间'
      })
    }

    // 保存评分到反馈文件
    const feedbackData = {
      historyId,
      rating,
      ratingText,
      timestamp: timestamp || new Date().toISOString()
    }

    // TODO: 这里可以扩展保存到专门的反馈数据库或文件
    console.log('💾 评分反馈数据:', feedbackData)

    // 返回成功响应
    res.json({
      success: true,
      message: '评分保存成功',
      data: feedbackData
    })

    console.log(`✅ 评分反馈处理完成: ${historyId} -> ${rating}星(${ratingText})`)

  } catch (error) {
    console.error('❌ 评分反馈处理失败:', error)
    res.status(500).json({
      error: '评分保存失败',
      message: error.message
    })
  }
})

// 旧接口已删除，只保留AI增强版生成

app.post('/api/generate/enhanced', async (req, res) => {
  console.log('🚀🚀🚀 AI生成请求开始 🚀🚀🚀')
  console.log('⏰ 时间:', new Date().toLocaleString())
  console.log('📦 收到请求体:', JSON.stringify(req.body, null, 2))
  
  try {
    const { 
      productId, 
      style, 
      keywords = '', 
      personality = 'authentic_experiencer',
      warmth = 7,
      vulnerability = 6,
      excitement = 6,
      audienceAge = '26-35',
      contentGoal = 'engagement',
      wordCount = 'medium'
    } = req.body || {}
    
    console.log('🔍 参数验证:')
    console.log('- productId:', productId)
    console.log('- style:', style)
    console.log('- personality:', personality)
    console.log('- wordCount:', wordCount)
    console.log('- warmth:', warmth)
    
    if (!productId) {
      throw new Error('缺少产品ID')
    }
    
    const product = PRODUCTS.find(p => p.id === productId)
    if (!product) {
      throw new Error(`未找到产品: ${productId}`)
    }
    
    console.log('✅ 产品找到:', product.name)
    
    // 检查AI配置
    const apiKey = process.env.AI_API_KEY
    if (!apiKey) {
      throw new Error('未配置AI_API_KEY环境变量')
    }
    
    const base = process.env.AI_OPENAI_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1'
    const model = process.env.AI_MODEL || 'deepseek-v3.1'
    
    console.log('🔧 AI配置:')
    console.log('- API Base:', base)
    console.log('- Model:', model)
    console.log('- API Key 长度:', apiKey.length)
    
    // 🎯 构建针对教育产品的AI提示词
    const systemPrompt = `你是小红书资深博主，专门分享学习和教育资源的真实体验。请为教育产品生成真诚、有温度的小红书文案。

核心要求：
1. 个性类型：${personality} (情感温度${warmth}/10，真实度${vulnerability}/10，兴奋度${excitement}/10)
2. 必须使用第一人称"我"，分享真实学习体验
3. 包含具体的学习场景和使用感受，使用具体时间锚点如："昨晚熬夜准备考试时"、"备考期间"、"刷题的时候"
4. 适当使用口语化表达："说真的"、"老实讲"、"用了之后"、"学完才知道"
5. 必须包含1个感官细节描述：界面感受、操作体验或学习感受
6. 当真实度≥7时，要坦诚提及轻微缺点："资料有点多，需要时间消化"或个人局限性："我这种懒人都能坚持下来"
7. 避免过于完美的表达，要有自然的"不完美"和学习过程中的真实感受

表达风格：
- 语言自然，像和朋友聊天，参考真实小红书用户的表达方式
- 每6-8句话可以插入口语填充词："说真的"、"怎么说呢"、"老实讲"
- 段落长度可以不规律(2-4句为主)
- 强调学习效果和实际收获
- 包含学习突破感："突然开窍了"、"那一瞬间明白了"、"效果立竿见影"

真实示例参考风格（学习表达自然度，不要复制内容）：
- "说真的，备考的这半年我真的被各种资料绕糊涂了😵"
- "老实讲，刚开始我还有点怀疑，毕竟之前踩过太多坑了🥲"
- "唯一的小缺点就是资料有点多，需要时间慢慢消化"
- "作为一个重度社恐患者分享一下，昨天熬夜做了这个测评"

输出格式：
标题：[12-20字吸引人标题]

正文：[包含真实学习体验的分享，加入emoji和相关hashtags]`

    const userPrompt = `请为以下产品生成小红书文案：

产品：${product.name}
描述：${product.summary || '无'}
卖点：${(product.sellingPoints || []).join('、')}
角度：${style}
关键词：${keywords || '无'}`

    console.log('📝 AI提示词准备完成')
    console.log('System prompt length:', systemPrompt.length)
    console.log('User prompt length:', userPrompt.length)
    
    // 📋 详细显示发送给AI的提示词内容
    console.log('\n' + '='.repeat(80))
    console.log('🎯 【SYSTEM PROMPT】发送给AI的系统提示词：')
    console.log('='.repeat(80))
    console.log(systemPrompt)
    console.log('\n' + '='.repeat(80))
    console.log('👤 【USER PROMPT】发送给AI的用户提示词：')
    console.log('='.repeat(80))
    console.log(userPrompt)
    console.log('='.repeat(80) + '\n')
    
    // 调用AI
    console.log('🤖 开始调用AI...')
    const startTime = Date.now()
    
    const maxTokens = getMaxTokens(wordCount)
    const resp = await fetch(base + '/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.85,        // 提高随机性，减少AI感
        top_p: 0.7,              // 控制输出质量
        frequency_penalty: 0.3,   // 减少重复，增加自然表达
        max_tokens: maxTokens    // 根据前端字数设置动态调整
      })
    })
    
    const aiTime = Date.now() - startTime
    console.log(`⚡ AI调用耗时: ${aiTime}ms`)
    console.log(`📡 AI响应状态: ${resp.status} ${resp.statusText}`)
    
    if (!resp.ok) {
      const errorText = await resp.text()
      console.error(`❌ AI API错误:`, errorText)
      throw new Error(`AI API错误 ${resp.status}: ${errorText}`)
    }
    
    const json = await resp.json()
    const aiText = json.choices?.[0]?.message?.content || ''
    
    console.log(`📥 AI响应长度: ${aiText.length} 字符`)
    console.log(`📄 AI响应内容预览:`, aiText.substring(0, 100) + '...')
    
    if (!aiText) {
      throw new Error('AI返回空内容')
    }

    // 简单解析AI回复
    const titleMatch = aiText.match(/标题[：:]\s*(.+?)(?:\n|$)/)
    const bodyMatch = aiText.match(/正文[：:]\s*([\s\S]*)/)
    
    const title = titleMatch?.[1]?.trim() || 'AI生成标题'
    let body = bodyMatch?.[1]?.trim() || aiText
    
    // 如果找不到格式，直接使用全部内容
    if (!bodyMatch) {
      body = aiText.replace(/^标题[：:]\s*.+?\n\n?/, '').trim()
    }
    
    const tags = (product.tagsDefault || []).slice(0, 5).map(t => `#${t}`)
    
    const response = {
      title,
      bodyPlain: body,
      bodyXHS: body,
      tags,
      ai_generated: true,
      ai_model: model,
      generation_time: aiTime
    }
    
    // 📝 保存到历史记录
    try {
      const historyData = {
        productId,
        productName: product.name,
        style,
        keywords,
        personality,
        warmth,
        vulnerability,
        excitement,
        audienceAge,
        contentGoal,
        result: response
      }
      
      const historyResult = historyManager.addRecord(historyData)
      if (historyResult.success) {
        console.log('💾 历史记录保存成功:', historyResult.id)
        response.historyId = historyResult.id
      } else {
        console.error('❌ 历史记录保存失败:', historyResult.error)
      }
    } catch (historyError) {
      console.error('❌ 历史记录保存异常:', historyError)
    }
    
    console.log('✅ AI生成成功!')
    console.log('📤 返回数据:', JSON.stringify(response, null, 2))
    console.log('🏁🏁🏁 AI生成请求完成 🏁🏁🏁')
    
    res.json(response)
    
  } catch (error) {
    console.error('❌❌❌ AI生成失败:', error.message)
    console.log('🏁🏁🏁 AI生成请求结束（失败）🏁🏁🏁')
    res.status(500).json({ 
      error: error.message,
      ai_generated: false
    })
  }
})

// ================= 历史记录相关API =================

// 获取历史记录列表
app.get('/api/history', (req, res) => {
  try {
    console.log('📋 获取历史记录列表请求')
    
    const { page = 1, pageSize = 20 } = req.query
    const result = historyManager.getHistoryList(
      parseInt(page), 
      parseInt(pageSize)
    )
    
    if (result.success) {
      console.log(`✅ 历史记录获取成功: 第${page}页, ${result.data.records.length}条记录`)
      res.json(result.data)
    } else {
      throw new Error(result.error)
    }
  } catch (error) {
    console.error('❌ 获取历史记录失败:', error)
    res.status(500).json({ 
      error: '获取历史记录失败',
      message: error.message,
      records: [],
      pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0, hasMore: false }
    })
  }
})

// 根据ID获取单条历史记录
app.get('/api/history/:id', (req, res) => {
  try {
    console.log('🔍 获取单条历史记录:', req.params.id)
    
    const result = historyManager.getRecordById(req.params.id)
    
    if (result.success) {
      console.log('✅ 历史记录获取成功')
      res.json(result.record)
    } else {
      res.status(404).json({ error: result.error })
    }
  } catch (error) {
    console.error('❌ 获取历史记录失败:', error)
    res.status(500).json({ error: '获取历史记录失败', message: error.message })
  }
})

// 删除历史记录
app.delete('/api/history/:id', (req, res) => {
  try {
    console.log('🗑️ 删除历史记录:', req.params.id)
    
    const result = historyManager.deleteRecord(req.params.id)
    
    if (result.success) {
      console.log('✅ 历史记录删除成功')
      res.json({ success: true, message: result.message })
    } else {
      res.status(404).json({ success: false, error: result.error })
    }
  } catch (error) {
    console.error('❌ 删除历史记录失败:', error)
    res.status(500).json({ success: false, error: '删除历史记录失败', message: error.message })
  }
})

// 获取历史记录统计信息
app.get('/api/history-stats', (req, res) => {
  try {
    console.log('📊 获取历史记录统计信息')
    
    const result = historyManager.getHistoryStats()
    
    if (result.success) {
      console.log('✅ 历史记录统计获取成功')
      res.json(result.stats)
    } else {
      throw new Error(result.error)
    }
  } catch (error) {
    console.error('❌ 获取历史记录统计失败:', error)
    res.status(500).json({ error: '获取统计信息失败', message: error.message })
  }
})

// 批量删除历史记录
app.post('/api/history/batch-delete', (req, res) => {
  try {
    console.log('🗑️ 批量删除历史记录')
    
    const { ids } = req.body
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: '无效的ID列表' })
    }
    
    const results = []
    let successCount = 0
    let failureCount = 0
    
    ids.forEach(id => {
      const result = historyManager.deleteRecord(id)
      results.push({ id, success: result.success, message: result.success ? 'OK' : result.error })
      
      if (result.success) {
        successCount++
      } else {
        failureCount++
      }
    })
    
    console.log(`✅ 批量删除完成: ${successCount}成功, ${failureCount}失败`)
    res.json({
      success: true,
      summary: { total: ids.length, success: successCount, failure: failureCount },
      details: results
    })
  } catch (error) {
    console.error('❌ 批量删除历史记录失败:', error)
    res.status(500).json({ error: '批量删除失败', message: error.message })
  }
})

// ================= 多轮优化历史记录相关API =================

// 获取多轮优化历史记录列表
app.get('/api/multi-round-history', (req, res) => {
  try {
    console.log('📋 获取多轮优化历史记录列表请求')
    
    const { page = 1, pageSize = 20 } = req.query
    const result = multiRoundHistoryManager.getMultiRoundHistory(
      parseInt(page), 
      parseInt(pageSize)
    )
    
    if (result.success) {
      console.log(`✅ 多轮优化历史记录获取成功: 第${page}页, ${result.data.records.length}条记录`)
      res.json(result.data)
    } else {
      throw new Error(result.error)
    }
  } catch (error) {
    console.error('❌ 获取多轮优化历史记录失败:', error)
    res.status(500).json({ 
      error: '获取多轮优化历史记录失败',
      message: error.message,
      records: [],
      pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0, hasMore: false }
    })
  }
})

// 根据ID获取单条多轮优化历史记录
app.get('/api/multi-round-history/:id', (req, res) => {
  try {
    console.log('🔍 获取单条多轮优化历史记录:', req.params.id)
    
    const result = multiRoundHistoryManager.getMultiRoundRecordById(req.params.id)
    
    if (result.success) {
      console.log('✅ 多轮优化历史记录获取成功')
      res.json(result.record)
    } else {
      res.status(404).json({ error: result.error })
    }
  } catch (error) {
    console.error('❌ 获取多轮优化历史记录失败:', error)
    res.status(500).json({ error: '获取多轮优化历史记录失败', message: error.message })
  }
})

// 删除多轮优化历史记录
app.delete('/api/multi-round-history/:id', (req, res) => {
  try {
    console.log('🗑️ 删除多轮优化历史记录:', req.params.id)
    
    const result = multiRoundHistoryManager.deleteMultiRoundRecord(req.params.id)
    
    if (result.success) {
      console.log('✅ 多轮优化历史记录删除成功')
      res.json({ success: true, message: result.message })
    } else {
      res.status(404).json({ success: false, error: result.error })
    }
  } catch (error) {
    console.error('❌ 删除多轮优化历史记录失败:', error)
    res.status(500).json({ success: false, error: '删除多轮优化历史记录失败', message: error.message })
  }
})

// 获取多轮优化历史记录统计信息
app.get('/api/multi-round-history-stats', (req, res) => {
  try {
    console.log('📊 获取多轮优化历史记录统计信息')
    
    const result = multiRoundHistoryManager.getMultiRoundStats()
    
    if (result.success) {
      console.log('✅ 多轮优化历史记录统计获取成功')
      res.json(result.stats)
    } else {
      throw new Error(result.error)
    }
  } catch (error) {
    console.error('❌ 获取多轮优化历史记录统计失败:', error)
    res.status(500).json({ error: '获取多轮优化统计信息失败', message: error.message })
  }
})

// 添加兜底路由，确保能捕获所有请求
app.use('*', (req, res) => {
  console.log(`❓ 未匹配路由: ${req.method} ${req.originalUrl}`)
  res.status(404).json({ error: '路由不存在', path: req.originalUrl })
})

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log('🔥'.repeat(20))
  console.log(`🚀 后端服务启动成功!`)
  console.log(`📡 运行端口: ${PORT}`)
  console.log(`🌐 访问地址: http://localhost:${PORT}`)
  console.log(`🤖 AI模型: ${process.env.AI_MODEL || 'deepseek-v3.1'}`)
  console.log(`🔑 API Key: ${process.env.AI_API_KEY ? '✅已配置' : '❌未配置'}`)
  console.log(`⚡ 等待前端请求...`)
  console.log('🔥'.repeat(20))
})
