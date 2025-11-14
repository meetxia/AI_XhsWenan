import fetch from 'node-fetch'

async function testPrompt() {
  console.log('🧪 开始测试提示词预览...\n')
  
  try {
    // 测试不同产品的提示词
    const testCases = [
      {
        name: '社恐测评系统',
        productId: 'p0',
        style: '真实体验',
        personality: 'social',
        vulnerability: 9
      },
      {
        name: '托福真题资料',
        productId: 'p1', 
        style: '学习分享',
        personality: 'cautious',
        vulnerability: 8
      },
      {
        name: 'PPT模板',
        productId: 'p2',
        style: '效果展示', 
        personality: 'analytical',
        vulnerability: 6
      }
    ]
    
    for (const testCase of testCases) {
      console.log(`\n📋 测试案例: ${testCase.name}`)
      console.log('=' * 50)
      
      const response = await fetch('http://localhost:3002/api/test-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testCase)
      })
      
      const result = await response.json()
      
      if (result.success) {
        console.log('✅ 测试成功！')
        console.log('📊 参数配置:', result.data.parameters)
        console.log('🤖 AI配置:', result.data.aiConfig)
        console.log('\n💡 提示：详细的提示词内容请查看后端控制台输出')
      } else {
        console.log('❌ 测试失败:', result.error)
      }
      
      // 等待1秒再测试下一个
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
  } catch (error) {
    console.error('❌ 测试过程出错:', error.message)
  }
}

// 运行测试
console.log('🚀 启动提示词测试工具')
console.log('📡 目标服务器: http://localhost:3002')
console.log('⚠️  请确保后端服务器已启动\n')

testPrompt()
