import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import fetch from 'node-fetch'
import dotenv from 'dotenv'
import { buildEnhancedPrompt } from './generate.js'

// 加载环境变量
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()
app.use(express.json())
app.use(cors())

// 添加请求日志中间件
app.use((req, res, next) => {
  console.log(`🌐 ${new Date().toLocaleTimeString()} ${req.method} ${req.path}`)
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('📦 请求体:', req.body)
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

app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

app.get('/api/products', (req, res) => {
  const list = PRODUCTS.map(p => ({ id: p.id, name: p.name, tagsDefault: p.tagsDefault || [] }))
  res.json(list)
})

// 模板接口已删除，改用AI动态生成

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
      contentGoal = 'engagement'
    } = req.body || {}
    
    console.log('🔍 参数验证:')
    console.log('- productId:', productId)
    console.log('- style:', style)
    console.log('- personality:', personality)
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
    
    // 🎯 直接构建简单的AI提示词
    const systemPrompt = `你是小红书文案专家。请为产品生成真诚、有温度的小红书文案。

风格特点：
- 个性类型：${personality} 
- 情感温度：${warmth}/10
- 真实度：${vulnerability}/10
- 兴奋度：${excitement}/10

输出格式：
标题：[标题内容]

正文：[正文内容，包含emoji和hashtags]`

    const userPrompt = `请为以下产品生成小红书文案：

产品：${product.name}
描述：${product.summary || '无'}
卖点：${(product.sellingPoints || []).join('、')}
角度：${style}
关键词：${keywords || '无'}`

    console.log('📝 AI提示词准备完成')
    console.log('System prompt length:', systemPrompt.length)
    console.log('User prompt length:', userPrompt.length)
    
    // 调用AI
    console.log('🤖 开始调用AI...')
    const startTime = Date.now()
    
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
        ]
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
