import EnhancedPromptBuilder from './enhanced-generator.js'

// 本地模板生成的辅助函数已删除，改用AI生成

// 构建增强版AI提示词
export function buildEnhancedPrompt(product, options = {}) {
  const promptBuilder = new EnhancedPromptBuilder()
  return promptBuilder.buildEnhancedPrompt(product, options)
}

// 本地模板生成函数已删除，改用AI动态生成
