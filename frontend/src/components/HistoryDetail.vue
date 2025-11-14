<template>
  <div class="h-full flex flex-col bg-white dark:bg-gray-900">
    <!-- 无记录状态 -->
    <div v-if="!record" class="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
      <div class="text-center">
        <svg class="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <p class="text-base font-medium">选择历史记录查看详情</p>
        <p class="text-sm mt-1">从左侧列表选择一条记录</p>
      </div>
    </div>

    <!-- 记录详情 -->
    <div v-else class="h-full flex flex-col">
      <!-- 标题栏 -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          📄 记录详情
        </h2>
        <div class="flex items-center space-x-2">
          <!-- 重新生成按钮 -->
          <button
            @click="regenerateWithParams"
            class="px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
            title="使用相同参数重新生成"
          >
            🔄 重新生成
          </button>
          
          <!-- 复制按钮 -->
          <button
            @click="copyContent"
            class="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            title="复制内容"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- 详情内容 -->
      <div class="flex-1 overflow-y-auto p-6 space-y-6">
        <!-- 生成结果 -->
        <div class="space-y-4">
          <h3 class="text-base font-semibold text-gray-900 dark:text-white flex items-center">
            <span class="mr-2">✨</span>
            生成结果
          </h3>
          
          <!-- 标题 -->
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">标题</label>
            <p class="text-gray-900 dark:text-white font-medium">{{ record.result.title }}</p>
          </div>

          <!-- 正文内容 -->
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">正文</label>
            <div class="text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed">{{ record.result.bodyPlain }}</div>
          </div>

          <!-- 标签 -->
          <div v-if="record.result.tags && record.result.tags.length" class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">标签</label>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in record.result.tags"
                :key="tag"
                class="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded"
              >
                {{ tag }}
              </span>
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
                    <span class="text-gray-900 dark:text-white">{{ record.productInfo.name }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">角度</span>
                    <span class="text-gray-900 dark:text-white">{{ record.generationParams.style }}</span>
                  </div>
                  <div v-if="record.generationParams.keywords" class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">关键词</span>
                    <span class="text-gray-900 dark:text-white">{{ record.generationParams.keywords }}</span>
                  </div>
                </div>
              </div>

              <!-- 高级参数 -->
              <div>
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">个性化设置</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">个性类型</span>
                    <span class="text-gray-900 dark:text-white">{{ record.generationParams.personality }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">情感温度</span>
                    <span class="text-gray-900 dark:text-white">{{ record.generationParams.warmth }}/10</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">真实度</span>
                    <span class="text-gray-900 dark:text-white">{{ record.generationParams.vulnerability }}/10</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">兴奋度</span>
                    <span class="text-gray-900 dark:text-white">{{ record.generationParams.excitement }}/10</span>
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
                <span class="text-gray-900 dark:text-white">{{ formatDateTime(record.timestamp) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">AI模型</span>
                <span class="text-gray-900 dark:text-white">{{ record.metadata.ai_model }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">耗时</span>
                <span class="text-gray-900 dark:text-white">{{ record.metadata.generation_time }}ms</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">记录ID</span>
                <span class="text-gray-900 dark:text-white font-mono text-xs">{{ record.id }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

// 定义 props
const props = defineProps({
  record: {
    type: Object,
    default: null
  }
})

// 定义事件
const emit = defineEmits(['regenerate'])

// 格式化完整时间
const formatDateTime = (timestamp) => {
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
  if (!props.record) return

  const content = `${props.record.result.title}\n\n${props.record.result.bodyPlain}`
  
  try {
    await navigator.clipboard.writeText(content)
    // 这里可以添加复制成功的提示
    console.log('✅ 内容已复制到剪贴板')
    
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
    // 降级方案：使用老式的复制方法
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
  if (!props.record) return
  
  const params = {
    productId: props.record.productInfo.id,
    style: props.record.generationParams.style,
    keywords: props.record.generationParams.keywords,
    personality: props.record.generationParams.personality,
    warmth: props.record.generationParams.warmth,
    vulnerability: props.record.generationParams.vulnerability,
    excitement: props.record.generationParams.excitement,
    audienceAge: props.record.generationParams.audienceAge,
    contentGoal: props.record.generationParams.contentGoal
  }
  
  emit('regenerate', params)
}
</script>

<style scoped>
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
