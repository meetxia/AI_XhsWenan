import EnhancedGenerator from '../src/enhanced-generator.js'
import { generateEnhancedCopy } from '../src/generate.js'

console.log('Testing enhanced modules...')

try {
  // Test module imports
  console.log('✅ EnhancedGenerator imported successfully')
  const generator = new EnhancedGenerator()
  console.log('✅ EnhancedGenerator instantiated successfully')

  // Test generateEnhancedCopy function
  console.log('✅ generateEnhancedCopy imported successfully')

  // Test with sample product
  const testProduct = {
    id: 'test',
    name: '测试产品',
    summary: '这是一个测试产品',
    sellingPoints: ['测试卖点1', '测试卖点2'],
    tagsDefault: ['测试', '产品']
  }

  const result = generateEnhancedCopy(testProduct, {
    personality: 'authentic_experiencer',
    warmth: 7,
    vulnerability: 6,
    excitement: 6
  })

  console.log('✅ Enhanced copy generation successful:')
  console.log('Title:', result.content.title)
  console.log('Tags:', result.content.tags)
  console.log('Body length:', result.content.body.length)

} catch (error) {
  console.error('❌ Error:', error.message)
  console.error('Stack:', error.stack)
}
