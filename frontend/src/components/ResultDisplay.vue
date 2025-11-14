<template>
  <div class="h-full flex flex-col">
    <!-- 操作栏：复制和评分 -->
    <div class="flex-shrink-0 mb-4 flex justify-between items-center">
      <!-- 真实度评分 -->
      <div class="flex items-center space-x-3">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">文案真实度:</span>
        <div class="flex items-center space-x-1">
          <button 
            v-for="star in 5" 
            :key="star"
            @click="setRating(star)"
            class="text-xl transition-all duration-150 hover:scale-110"
            :class="star <= rating ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600 hover:text-yellow-400'"
          >
            ⭐
          </button>
        </div>
        <span v-if="rating > 0" class="text-sm text-gray-500 dark:text-gray-400">
          {{ getRatingText(rating) }}
        </span>
      </div>

      <!-- 复制按钮 -->
      <button 
        @click="copyAll"
        class="px-4 py-2 text-sm font-medium rounded-md border border-primary-light text-primary-light hover:bg-primary-light hover:text-white dark:border-primary-dark dark:text-primary-dark dark:hover:bg-primary-dark dark:hover:text-black focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark transition-all duration-150"
      >
        {{ copyButtonText }}
      </button>
    </div>
    
    <!-- 标题 -->
    <div class="flex-shrink-0 mb-4">
      <div class="flex items-center justify-between mb-1">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-400">
          AI 生成标题
        </label>
        <!-- 生成模式标识 -->
        <div v-if="props.result.multiRound || props.result.optimization_applied" class="flex items-center space-x-2">
          <span class="text-xs px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
            🤖 多轮优化
          </span>
        </div>
        <div v-else class="flex items-center space-x-2">
          <span class="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
            ⚡ 单轮生成
          </span>
        </div>
      </div>
      <textarea 
        v-model="title"
        rows="2" 
        class="w-full p-3 font-mono text-lg rounded-md shadow-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-primary-light dark:text-primary-dark focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-transparent"
      ></textarea>
    </div>

    <!-- 多轮优化分析报告 -->
    <div v-if="props.result.analysis && (props.result.multiRound || props.result.optimization_applied)" class="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md border border-purple-200 dark:border-purple-800">
      <h4 class="text-sm font-semibold text-purple-800 dark:text-purple-200 mb-2">📊 AI分析报告</h4>
      <div class="grid grid-cols-3 gap-3 text-xs">
        <div class="text-center">
          <div class="text-lg font-bold text-purple-600 dark:text-purple-300">
            {{ props.result.analysis?.analysis?.authenticity?.score || 'N/A' }}/10
          </div>
          <div class="text-gray-600 dark:text-gray-400">真实感</div>
        </div>
        <div class="text-center">
          <div class="text-lg font-bold text-purple-600 dark:text-purple-300">
            {{ props.result.analysis?.analysis?.viralPotential?.score || 'N/A' }}/10
          </div>
          <div class="text-gray-600 dark:text-gray-400">爆款潜力</div>
        </div>
        <div class="text-center">
          <div class="text-lg font-bold text-purple-600 dark:text-purple-300">
            {{ props.result.analysis?.analysis?.platformFit?.score || 'N/A' }}/10
          </div>
          <div class="text-gray-600 dark:text-gray-400">平台适配</div>
        </div>
      </div>
      <div class="mt-2 text-xs text-center text-purple-700 dark:text-purple-300">
        综合评分：{{ props.result.analysis?.overallScore || 'N/A' }}/10
      </div>
    </div>

    <!-- 正文 -->
    <div class="flex-grow flex flex-col">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
        AI 生成正文 (含Tags)
      </label>
      <textarea 
        v-model="body"
        class="w-full h-full flex-grow p-3 font-mono rounded-md shadow-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-primary-light dark:text-primary-dark focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-transparent"
      ></textarea>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watchEffect } from 'vue'

const props = defineProps({ 
  result: { type: Object, default: () => ({}) },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['rating-changed'])

const title = ref('')
const body = ref('')
const copyButtonText = ref('复制全部内容')
const rating = ref(0)

// 监听结果变化
watchEffect(() => {
  if (props.result) {
    title.value = props.result.title || ''
    // 优先使用bodyXHS，如果没有则使用bodyPlain
    body.value = props.result.bodyXHS || props.result.bodyPlain || ''
    // 重置评分当内容变化时
    rating.value = 0
  }
})

// 评分功能
function setRating(stars) {
  rating.value = stars
  console.log(`📊 用户评分: ${stars}星 - ${getRatingText(stars)}`)
  
  // 发送评分数据到后端
  submitRating(stars)
  
  // 通知父组件
  emit('rating-changed', {
    rating: stars,
    historyId: props.result.historyId,
    ratingText: getRatingText(stars)
  })
}

function getRatingText(stars) {
  const ratingTexts = {
    1: '很不真实',
    2: '不太真实', 
    3: '一般真实',
    4: '比较真实',
    5: '非常真实'
  }
  return ratingTexts[stars] || ''
}

// 提交评分到后端
async function submitRating(stars) {
  try {
    if (!props.result.historyId) {
      console.warn('⚠️ 没有historyId，无法保存评分')
      return
    }

    const ratingData = {
      historyId: props.result.historyId,
      rating: stars,
      ratingText: getRatingText(stars),
      timestamp: new Date().toISOString()
    }

    const response = await fetch('http://localhost:3002/api/feedback/rating', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ratingData)
    })

    if (response.ok) {
      console.log('✅ 评分保存成功')
    } else {
      console.error('❌ 评分保存失败:', response.status)
    }
  } catch (error) {
    console.error('❌ 评分提交错误:', error)
  }
}

// 复制功能
function copyAll() {
  const fullText = `标题：${title.value}\n\n${body.value}`
  
  navigator.clipboard.writeText(fullText).then(() => {
    copyButtonText.value = '复制成功!'
    setTimeout(() => {
      copyButtonText.value = '复制全部内容'
    }, 2000)
  }).catch(err => {
    console.error('复制失败: ', err)
    alert('复制失败，请手动复制。')
  })
}
</script>

<style scoped>
</style>
