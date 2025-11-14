import dotenv from 'dotenv'
import fetch from 'node-fetch'

// 加载环境变量
dotenv.config()

console.log('🔍 XHS Content Matrix - 配置检查')
console.log('=====================================')

// 检查环境变量
const apiKey = process.env.AI_API_KEY
const baseUrl = process.env.AI_OPENAI_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1'
const model = process.env.AI_MODEL || 'deepseek-v3.1'

console.log(`✅ AI_API_KEY: ${apiKey ? '已配置' : '❌ 未配置'}`)
console.log(`✅ BASE_URL: ${baseUrl}`)
console.log(`✅ MODEL: ${model}`)

if (!apiKey) {
  console.log('\n❌ 错误: 未配置AI_API_KEY')
  console.log('请在 .env 文件中设置: AI_API_KEY=your_api_key_here')
  process.exit(1)
}

// 测试API连接
console.log('\n🧪 测试AI API连接...')
try {
  const response = await fetch(baseUrl + '/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'user', content: '你好' }
      ],
      max_tokens: 10
    })
  })

  if (response.ok) {
    console.log('✅ AI API连接成功!')
  } else {
    const error = await response.text()
    console.log(`❌ AI API连接失败 (${response.status}): ${error}`)
  }
} catch (error) {
  console.log(`❌ AI API连接错误: ${error.message}`)
}

console.log('\n🎉 配置检查完成!')
