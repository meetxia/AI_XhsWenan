<template>
  <div class="h-full flex flex-col bg-white dark:bg-gray-900">
    <!-- 无记录状态 -->
    <div v-if="!record" class="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
      <div class="text-center">
        <svg class="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <p class="text-base font-medium">选择多轮优化记录查看详情</p>
        <p class="text-sm mt-1">从左侧列表选择一条多轮优化记录</p>
      </div>
    </div>

    <!-- 记录详情 -->
    <div v-else-if="compatibleRecord" class="h-full flex flex-col">
      <!-- 标题栏 -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          🚀 多轮优化详情
        </h2>
        <div class="flex items-center space-x-2">
          <!-- 重新生成按钮 -->
          <button
            @click="regenerateWithParams"
            class="px-3 py-1.5 text-sm bg-purple-500 hover:bg-purple-600 text-white rounded-md transition-colors"
            title="使用相同参数重新生成"
          >
            🔄 重新优化生成
          </button>
          
          <!-- 复制按钮 -->
          <button
            @click="copyContent"
            class="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            title="复制最终内容"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- 详情内容 -->
      <div class="flex-1 overflow-y-auto p-6 space-y-6">
        
        <!-- 优化结果对比 -->
        <div class="space-y-4">
          <h3 class="text-base font-semibold text-gray-900 dark:text-white flex items-center">
            <span class="mr-2">✨</span>
            优化结果对比
          </h3>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <!-- 原始内容 -->
            <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
              <h4 class="text-sm font-medium text-red-800 dark:text-red-200 mb-2">📝 初始生成</h4>
              <div class="space-y-2">
                <div>
                  <label class="text-xs text-red-600 dark:text-red-300">标题</label>
                  <p class="text-sm text-gray-900 dark:text-white">{{ compatibleRecord.originalContent?.title }}</p>
                </div>
                <div>
                  <label class="text-xs text-red-600 dark:text-red-300">正文</label>
                  <p class="text-xs text-gray-700 dark:text-gray-300 line-clamp-3">{{ compatibleRecord.originalContent?.bodyPlain }}</p>
                </div>
              </div>
            </div>

            <!-- 优化后内容 -->
            <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
              <h4 class="text-sm font-medium text-green-800 dark:text-green-200 mb-2">🚀 优化后</h4>
              <div class="space-y-2">
                <div>
                  <label class="text-xs text-green-600 dark:text-green-300">标题</label>
                  <p class="text-sm text-gray-900 dark:text-white">{{ compatibleRecord.optimizedContent?.title }}</p>
                </div>
                <div>
                  <label class="text-xs text-green-600 dark:text-green-300">正文</label>
                  <p class="text-xs text-gray-700 dark:text-gray-300 line-clamp-3">{{ compatibleRecord.optimizedContent?.bodyPlain }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 质量分析评分 -->
          <div v-if="compatibleRecord.qualityAnalysis" class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <h4 class="text-sm font-medium text-blue-800 dark:text-blue-200 mb-3">📊 质量分析评分</h4>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div class="text-center">
                <div class="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {{ compatibleRecord.qualityAnalysis.overallScore || 'N/A' }}
                </div>
                <div class="text-xs text-blue-800 dark:text-blue-200">综合评分</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-bold text-green-600 dark:text-green-400">
                  {{ compatibleRecord.qualityAnalysis.analysis?.authenticity?.score || 'N/A' }}
                </div>
                <div class="text-xs text-green-800 dark:text-green-200">真实感</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {{ compatibleRecord.qualityAnalysis.analysis?.viralPotential?.score || 'N/A' }}
                </div>
                <div class="text-xs text-purple-800 dark:text-purple-200">爆款潜力</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-bold text-orange-600 dark:text-orange-400">
                  {{ compatibleRecord.qualityAnalysis.analysis?.platformFit?.score || 'N/A' }}
                </div>
                <div class="text-xs text-orange-800 dark:text-orange-200">平台适配</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 三轮AI生成详细内容 -->
        <div class="space-y-6">
          <h3 class="text-base font-semibold text-gray-900 dark:text-white flex items-center">
            <span class="mr-2">💬</span>
            三轮AI生成详细内容
          </h3>
          
          <div class="space-y-6">
            <!-- 第一轮：初始文案生成 -->
            <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-lg font-semibold text-blue-800 dark:text-blue-200 flex items-center">
                  <span class="mr-2">🎨</span>
                  第一轮：初始文案生成
                </h4>
                <div class="text-right">
                  <div class="text-xs text-blue-600 dark:text-blue-300">
                    {{ formatDateTime(compatibleRecord.rounds?.round1?.timestamp) }}
                  </div>
                  <div class="text-xs text-blue-500 dark:text-blue-400">
                    耗时: {{ compatibleRecord.rounds?.round1?.output?.generation_time }}ms
                  </div>
                </div>
              </div>

              <!-- AI生成的初始内容 -->
              <div class="space-y-4">
                <div>
                  <h5 class="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">📝 AI生成的标题</h5>
                  <div class="bg-white dark:bg-gray-900 rounded-lg p-3 border border-blue-300 dark:border-blue-700">
                    <p class="text-sm text-gray-900 dark:text-white font-medium">
                      {{ compatibleRecord.rounds?.round1?.output?.title || compatibleRecord.originalContent?.title }}
                    </p>
                  </div>
                </div>

                <div>
                  <h5 class="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">📄 AI生成的正文内容</h5>
                  <div class="bg-white dark:bg-gray-900 rounded-lg p-3 border border-blue-300 dark:border-blue-700 max-h-48 overflow-y-auto">
                    <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {{ compatibleRecord.rounds?.round1?.output?.bodyPlain || compatibleRecord.originalContent?.bodyPlain }}
                    </p>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h6 class="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">生成参数</h6>
                    <div class="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                      <div>温度: {{ compatibleRecord.rounds?.round1?.input?.parameters?.temperature }}</div>
                      <div>最大tokens: {{ compatibleRecord.rounds?.round1?.input?.parameters?.max_tokens }}</div>
                      <div>Top-p: {{ compatibleRecord.rounds?.round1?.input?.parameters?.top_p }}</div>
                    </div>
                  </div>
                  <div>
                    <h6 class="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">生成标签</h6>
                    <div class="flex flex-wrap gap-1">
                      <span v-for="tag in compatibleRecord.rounds?.round1?.output?.tags || compatibleRecord.originalContent?.tags" 
                            :key="tag" 
                            class="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs rounded">
                        {{ tag }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 第二轮：质量分析 -->
            <div class="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6 border border-orange-200 dark:border-orange-800">
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-lg font-semibold text-orange-800 dark:text-orange-200 flex items-center">
                  <span class="mr-2">🔍</span>
                  第二轮：质量分析
                </h4>
                <div class="text-right">
                  <div class="text-xs text-orange-600 dark:text-orange-300">
                    {{ formatDateTime(compatibleRecord.rounds?.round2?.timestamp) }}
                  </div>
                  <div class="text-xs text-orange-500 dark:text-orange-400">
                    耗时: {{ compatibleRecord.rounds?.round2?.output?.analysis_time }}ms
                  </div>
                </div>
              </div>

              <!-- AI分析结果 -->
              <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div class="text-center p-3 bg-white dark:bg-gray-900 rounded-lg border border-orange-300 dark:border-orange-700">
                    <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {{ compatibleRecord.rounds?.round2?.output?.overallScore || compatibleRecord.qualityAnalysis?.overallScore || 'N/A' }}
                    </div>
                    <div class="text-xs text-orange-800 dark:text-orange-200">综合评分</div>
                  </div>
                  <div class="text-center p-3 bg-white dark:bg-gray-900 rounded-lg border border-orange-300 dark:border-orange-700">
                    <div class="text-2xl font-bold text-green-600 dark:text-green-400">
                      {{ compatibleRecord.rounds?.round2?.output?.analysis?.authenticity?.score || compatibleRecord.qualityAnalysis?.analysis?.authenticity?.score || 'N/A' }}
                    </div>
                    <div class="text-xs text-orange-800 dark:text-orange-200">真实感</div>
                  </div>
                  <div class="text-center p-3 bg-white dark:bg-gray-900 rounded-lg border border-orange-300 dark:border-orange-700">
                    <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {{ compatibleRecord.rounds?.round2?.output?.analysis?.viralPotential?.score || compatibleRecord.qualityAnalysis?.analysis?.viralPotential?.score || 'N/A' }}
                    </div>
                    <div class="text-xs text-orange-800 dark:text-orange-200">爆款潜力</div>
                  </div>
                  <div class="text-center p-3 bg-white dark:bg-gray-900 rounded-lg border border-orange-300 dark:border-orange-700">
                    <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {{ compatibleRecord.rounds?.round2?.output?.analysis?.platformFit?.score || compatibleRecord.qualityAnalysis?.analysis?.platformFit?.score || 'N/A' }}
                    </div>
                    <div class="text-xs text-orange-800 dark:text-orange-200">平台适配</div>
                  </div>
                </div>

                <div v-if="compatibleRecord.rounds?.round2?.output?.improvements || compatibleRecord.qualityAnalysis?.improvements">
                  <h5 class="text-sm font-medium text-orange-700 dark:text-orange-300 mb-2">🎯 AI分析建议</h5>
                  <div class="bg-white dark:bg-gray-900 rounded-lg p-3 border border-orange-300 dark:border-orange-700 max-h-32 overflow-y-auto">
                    <div class="space-y-2">
                      <div v-for="(improvement, index) in (compatibleRecord.rounds?.round2?.output?.improvements || compatibleRecord.qualityAnalysis?.improvements)" 
                           :key="index" 
                           class="text-sm">
                        <div class="flex items-start space-x-2">
                          <span class="inline-block w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                          <div>
                            <div class="text-gray-900 dark:text-white font-medium">{{ improvement.issue }}</div>
                            <div class="text-gray-600 dark:text-gray-400 text-xs">{{ improvement.suggestion }}</div>
                            <div v-if="improvement.example" class="text-gray-500 dark:text-gray-500 text-xs italic">
                              示例: {{ improvement.example }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h6 class="text-xs font-medium text-orange-600 dark:text-orange-400 mb-1">分析参数</h6>
                  <div class="text-xs text-orange-700 dark:text-orange-300 space-y-1">
                    <div>温度: {{ compatibleRecord.rounds?.round2?.input?.parameters?.temperature }}</div>
                    <div>Top-p: {{ compatibleRecord.rounds?.round2?.input?.parameters?.top_p }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 第三轮：内容优化 -->
            <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-lg font-semibold text-green-800 dark:text-green-200 flex items-center">
                  <span class="mr-2">✨</span>
                  第三轮：内容优化
                </h4>
                <div class="text-right">
                  <div class="text-xs text-green-600 dark:text-green-300">
                    {{ formatDateTime(compatibleRecord.rounds?.round3?.timestamp) }}
                  </div>
                  <div class="text-xs text-green-500 dark:text-green-400">
                    耗时: {{ compatibleRecord.rounds?.round3?.output?.optimization_time }}ms
                  </div>
                </div>
              </div>

              <!-- AI优化后的内容 -->
              <div class="space-y-4">
                <div>
                  <h5 class="text-sm font-medium text-green-700 dark:text-green-300 mb-2">🚀 AI优化后的标题</h5>
                  <div class="bg-white dark:bg-gray-900 rounded-lg p-3 border border-green-300 dark:border-green-700">
                    <p class="text-sm text-gray-900 dark:text-white font-medium">
                      {{ compatibleRecord.rounds?.round3?.output?.title || compatibleRecord.optimizedContent?.title }}
                    </p>
                  </div>
                </div>

                <div>
                  <h5 class="text-sm font-medium text-green-700 dark:text-green-300 mb-2">📝 AI优化后的正文内容</h5>
                  <div class="bg-white dark:bg-gray-900 rounded-lg p-3 border border-green-300 dark:border-green-700 max-h-48 overflow-y-auto">
                    <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {{ compatibleRecord.rounds?.round3?.output?.bodyPlain || compatibleRecord.optimizedContent?.bodyPlain }}
                    </p>
                  </div>
                </div>

                <div v-if="compatibleRecord.improvement?.keyChanges" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h6 class="text-xs font-medium text-green-600 dark:text-green-400 mb-2">🔄 主要改动</h6>
                    <div class="space-y-2">
                      <div v-for="change in compatibleRecord.improvement.keyChanges" :key="change.type" 
                           class="text-xs p-2 bg-white dark:bg-gray-900 rounded border border-green-300 dark:border-green-700">
                        <div class="font-medium text-green-800 dark:text-green-200">{{ change.description }}</div>
                        <div v-if="change.lengthChange" class="text-green-600 dark:text-green-400">
                          内容长度变化: {{ change.lengthChange > 0 ? '+' : '' }}{{ change.lengthChange }}字符
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h6 class="text-xs font-medium text-green-600 dark:text-green-400 mb-1">优化参数</h6>
                    <div class="text-xs text-green-700 dark:text-green-300 space-y-1">
                      <div>温度: {{ compatibleRecord.rounds?.round3?.input?.parameters?.temperature }}</div>
                      <div>Top-p: {{ compatibleRecord.rounds?.round3?.input?.parameters?.top_p }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 生成参数 -->
        <div class="space-y-4">
          <h3 class="text-base font-semibold text-gray-900 dark:text-white flex items-center">
            <span class="mr-2">⚙️</span>
            生成参数
          </h3>
          
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- 基础参数 -->
              <div>
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">基础设置</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">产品</span>
                    <span class="text-gray-900 dark:text-white">{{ compatibleRecord.generationParams?.productName }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">角度</span>
                    <span class="text-gray-900 dark:text-white">{{ compatibleRecord.generationParams?.style }}</span>
                  </div>
                  <div v-if="compatibleRecord.generationParams?.keywords" class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">关键词</span>
                    <span class="text-gray-900 dark:text-white">{{ compatibleRecord.generationParams.keywords }}</span>
                  </div>
                </div>
              </div>

              <!-- 高级参数 -->
              <div>
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">个性化设置</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">个性类型</span>
                    <span class="text-gray-900 dark:text-white">{{ compatibleRecord.generationParams?.personality }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">情感温度</span>
                    <span class="text-gray-900 dark:text-white">{{ compatibleRecord.generationParams?.warmth }}/10</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">真实度</span>
                    <span class="text-gray-900 dark:text-white">{{ compatibleRecord.generationParams?.vulnerability }}/10</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">兴奋度</span>
                    <span class="text-gray-900 dark:text-white">{{ compatibleRecord.generationParams?.excitement }}/10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 生成信息 -->
        <div class="space-y-4">
          <h3 class="text-base font-semibold text-gray-900 dark:text-white flex items-center">
            <span class="mr-2">📊</span>
            生成信息
          </h3>
          
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">生成时间</span>
                <span class="text-gray-900 dark:text-white">{{ formatDateTime(compatibleRecord.timestamp) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">AI模型</span>
                <span class="text-gray-900 dark:text-white">{{ compatibleRecord.metadata?.ai_model }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">总耗时</span>
                <span class="text-gray-900 dark:text-white">{{ compatibleRecord.metadata?.total_generation_time }}ms</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">处理步骤</span>
                <span class="text-gray-900 dark:text-white">{{ compatibleRecord.metadata?.processSteps?.join(' → ') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'

// 定义 props
const props = defineProps({
  record: {
    type: Object,
    default: null
  }
})

// 定义事件
const emit = defineEmits(['regenerate'])

// 数据兼容处理：支持新旧两种数据格式
const compatibleRecord = computed(() => {
  if (!props.record) return null
  
  const record = props.record
  
  // 如果已经是新格式（有rounds对象），直接返回
  if (record.rounds?.round1) {
    return record
  }
  
  // 如果是旧格式（有conversationRounds数组），转换为新格式
  if (record.conversationRounds && Array.isArray(record.conversationRounds)) {
    return {
      ...record,
      rounds: {
        round1: record.conversationRounds[0],
        round2: record.conversationRounds[1],
        round3: record.conversationRounds[2]
      },
      originalContent: record.comparison?.originalContent || record.conversationRounds[0]?.output,
      optimizedContent: record.comparison?.optimizedContent || record.conversationRounds[2]?.output,
      qualityAnalysis: record.comparison?.qualityAnalysis || record.conversationRounds[1]?.output
    }
  }
  
  return record
})

// 格式化完整时间
const formatDateTime = (timestamp) => {
  if (!timestamp) return 'N/A'
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 复制内容到剪贴板
const copyContent = async () => {
  if (!compatibleRecord.value) return

  const content = `${compatibleRecord.value.optimizedContent?.title}\n\n${compatibleRecord.value.optimizedContent?.bodyPlain}`
  
  try {
    await navigator.clipboard.writeText(content)
    console.log('✅ 多轮优化内容已复制到剪贴板')
    
    // 简单的视觉反馈
    const button = event.target.closest('button')
    if (button) {
      const originalTitle = button.title
      button.title = '已复制!'
      setTimeout(() => {
        button.title = originalTitle
      }, 1000)
    }
  } catch (error) {
    console.error('❌ 复制失败:', error)
    // 降级方案
    const textarea = document.createElement('textarea')
    textarea.value = content
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }
}

// 使用相同参数重新生成
const regenerateWithParams = () => {
  if (!compatibleRecord.value) return
  
  const params = {
    productId: compatibleRecord.value.generationParams?.productId,
    style: compatibleRecord.value.generationParams?.style,
    keywords: compatibleRecord.value.generationParams?.keywords,
    personality: compatibleRecord.value.generationParams?.personality,
    warmth: compatibleRecord.value.generationParams?.warmth,
    vulnerability: compatibleRecord.value.generationParams?.vulnerability,
    excitement: compatibleRecord.value.generationParams?.excitement,
    audienceAge: compatibleRecord.value.generationParams?.audienceAge,
    contentGoal: compatibleRecord.value.generationParams?.contentGoal,
    enableMultiRound: true // 启用多轮优化
  }
  
  emit('regenerate', params)
}
</script>

<style scoped>
/* 文本截断样式 */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}
.dark ::-webkit-scrollbar-thumb {
  background: #4a5568;
}
.dark ::-webkit-scrollbar-thumb:hover {
  background: #2d3748;
}
</style>
