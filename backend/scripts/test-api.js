import fetch from 'node-fetch'

console.log('🧪 测试后端API...\n')

async function testAPI() {
  const baseUrl = 'http://localhost:3002'
  
  try {
    // 测试健康检查
    console.log('1️⃣ 测试健康检查...')
    const healthResponse = await fetch(`${baseUrl}/api/health`)
    const healthData = await healthResponse.json()
    console.log('✅ 健康检查:', healthData)
    
    // 测试产品API
    console.log('\n2️⃣ 测试产品API...')
    const productsResponse = await fetch(`${baseUrl}/api/products`)
    const productsData = await productsResponse.json()
    console.log('📦 产品数据:')
    console.log(`   - 数量: ${productsData.length} 个`)
    console.log('   - 产品列表:')
    productsData.forEach((p, i) => {
      console.log(`     ${i + 1}. ${p.name} (ID: ${p.id})`)
    })
    
    // 测试模板API
    console.log('\n3️⃣ 测试模板API...')
    const templatesResponse = await fetch(`${baseUrl}/api/templates`)
    const templatesData = await templatesResponse.json()
    console.log('📝 模板类型:', templatesData)
    
  } catch (error) {
    console.error('❌ API测试失败:', error.message)
    console.error('请确保后端服务正在运行在', baseUrl)
  }
}

testAPI()
