<template>
  <div class="flex flex-col items-center justify-center p-8 space-y-6 bg-white dark:bg-gray-900">
    <!-- 标题 -->
    <div class="text-center">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {{ isMultiRound ? '🤖 多轮AI优化生成中' : '🤖 AI智能生成中' }}
      </h2>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        {{ isMultiRound ? '正在进行三轮AI协作优化，请稍候...' : '正在调用AI生成内容，请稍候...' }}
      </p>
    </div>

    <!-- 多轮优化步骤展示 -->
    <div v-if="isMultiRound" class="w-full max-w-2xl space-y-4">
      <!-- 第一步：生成初始内容 -->
      <div class="flex items-start space-x-4 p-4 rounded-lg transition-all duration-300"
           :class="currentStep >= 1 ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700' : 'bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700'">
        <div class="flex-shrink-0 mt-1">
          <div v-if="currentStep > 1" class="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div v-else-if="currentStep === 1" class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div v-else class="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
            <span class="text-white font-bold">1</span>
          </div>
        </div>
        <div class="flex-1">
          <h3 class="text-base font-semibold mb-1"
              :class="currentStep >= 1 ? 'text-blue-900 dark:text-blue-200' : 'text-gray-500 dark:text-gray-400'">
            🎨 第一轮：生成初始文案
          </h3>
          <p class="text-sm"
             :class="currentStep >= 1 ? 'text-blue-700 dark:text-blue-300' : 'text-gray-400 dark:text-gray-500'">
            {{ currentStep === 1 ? 'AI正在根据产品信息和风格要求生成初始文案...' : currentStep > 1 ? '✓ 初始文案生成完成' : '等待开始' }}
          </p>
          <div v-if="currentStep === 1" class="mt-2 flex items-center space-x-2 text-xs text-blue-600 dark:text-blue-400">
            <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>预计耗时 3-5 秒</span>
          </div>
        </div>
      </div>

      <!-- 第二步：质量分析 -->
      <div class="flex items-start space-x-4 p-4 rounded-lg transition-all duration-300"
           :class="currentStep >= 2 ? 'bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-700' : 'bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700'">
        <div class="flex-shrink-0 mt-1">
          <div v-if="currentStep > 2" class="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div v-else-if="currentStep === 2" class="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
            <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div v-else class="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
            <span class="text-white font-bold">2</span>
          </div>
        </div>
        <div class="flex-1">
          <h3 class="text-base font-semibold mb-1"
              :class="currentStep >= 2 ? 'text-orange-900 dark:text-orange-200' : 'text-gray-500 dark:text-gray-400'">
            🔍 第二轮：质量分析
          </h3>
          <p class="text-sm"
             :class="currentStep >= 2 ? 'text-orange-700 dark:text-orange-300' : 'text-gray-400 dark:text-gray-500'">
            {{ currentStep === 2 ? 'AI正在分析文案的真实感、爆款潜力和平台适配性...' : currentStep > 2 ? '✓ 质量分析完成，已识别改进点' : '等待开始' }}
          </p>
          <div v-if="currentStep === 2" class="mt-2 flex items-center space-x-2 text-xs text-orange-600 dark:text-orange-400">
            <div class="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span>预计耗时 2-4 秒</span>
          </div>
        </div>
      </div>

      <!-- 第三步：内容优化 -->
      <div class="flex items-start space-x-4 p-4 rounded-lg transition-all duration-300"
           :class="currentStep >= 3 ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700' : 'bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700'">
        <div class="flex-shrink-0 mt-1">
          <div v-if="currentStep > 3" class="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div v-else-if="currentStep === 3" class="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div v-else class="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
            <span class="text-white font-bold">3</span>
          </div>
        </div>
        <div class="flex-1">
          <h3 class="text-base font-semibold mb-1"
              :class="currentStep >= 3 ? 'text-green-900 dark:text-green-200' : 'text-gray-500 dark:text-gray-400'">
            ✨ 第三轮：内容优化
          </h3>
          <p class="text-sm"
             :class="currentStep >= 3 ? 'text-green-700 dark:text-green-300' : 'text-gray-400 dark:text-gray-500'">
            {{ currentStep === 3 ? 'AI正在根据分析建议优化文案，提升质量...' : currentStep > 3 ? '✓ 优化完成！最终文案已生成' : '等待开始' }}
          </p>
          <div v-if="currentStep === 3" class="mt-2 flex items-center space-x-2 text-xs text-green-600 dark:text-green-400">
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>预计耗时 3-5 秒</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 单轮生成的简单加载动画 -->
    <div v-else class="flex flex-col items-center space-y-4">
      <div class="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 border-t-blue-500 rounded-full animate-spin"></div>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        AI正在创作中，预计耗时 3-8 秒...
      </p>
    </div>

    <!-- 总进度条 -->
    <div class="w-full max-w-2xl">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-medium text-gray-700 dark:text-gray-300">
          {{ isMultiRound ? `总进度：${Math.round(progress)}%` : `进度：${Math.round(progress)}%` }}
        </span>
        <span class="text-xs text-gray-500 dark:text-gray-400">
          {{ elapsedTime }}s / {{ estimatedTime }}s
        </span>
      </div>
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <div 
          class="h-full rounded-full transition-all duration-500 ease-out"
          :class="isMultiRound ? 'bg-gradient-to-r from-blue-500 via-orange-500 to-green-500' : 'bg-blue-500'"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
    </div>

    <!-- 提示文字 -->
    <div class="text-center space-y-2">
      <p class="text-xs text-gray-500 dark:text-gray-400">
        💡 提示：{{ isMultiRound ? '多轮优化能显著提升文案质量' : '首次生成可能需要稍长时间' }}
      </p>
      <p class="text-xs text-gray-400 dark:text-gray-500">
        请保持页面打开，生成完成后会自动显示结果
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  isMultiRound: {
    type: Boolean,
    default: false
  }
})

// 当前步骤 (1: 生成, 2: 分析, 3: 优化, 4: 完成)
const currentStep = ref(0)
// 进度百分比
const progress = ref(0)
// 已用时间（秒）
const elapsedTime = ref(0)
// 预估总时间（秒）
const estimatedTime = computed(() => props.isMultiRound ? 15 : 8)

let timer = null
let stepTimer = null

// 模拟步骤进度
const simulateProgress = () => {
  // 如果是多轮优化，模拟三个步骤
  if (props.isMultiRound) {
    // 第一步：生成（0-4秒，进度0-33%）
    setTimeout(() => {
      currentStep.value = 1
    }, 300)
    
    // 第二步：分析（4-7秒，进度33-66%）
    setTimeout(() => {
      currentStep.value = 2
    }, 4000)
    
    // 第三步：优化（7-12秒，进度66-100%）
    setTimeout(() => {
      currentStep.value = 3
    }, 7000)
  } else {
    // 单轮生成，直接显示加载中
    currentStep.value = 1
  }
}

// 平滑增加进度
const updateProgress = () => {
  timer = setInterval(() => {
    elapsedTime.value++
    
    // 根据当前步骤更新进度，但保持在95%以下，避免到100%但还没完成
    if (props.isMultiRound) {
      if (currentStep.value === 1) {
        // 第一步：0-33%
        progress.value = Math.min(33, (elapsedTime.value / 4) * 33)
      } else if (currentStep.value === 2) {
        // 第二步：33-66%
        progress.value = Math.min(66, 33 + ((elapsedTime.value - 4) / 3) * 33)
      } else if (currentStep.value === 3) {
        // 第三步：66-95%
        progress.value = Math.min(95, 66 + ((elapsedTime.value - 7) / 8) * 29)
      }
    } else {
      // 单轮生成：渐进到95%
      progress.value = Math.min(95, (elapsedTime.value / estimatedTime.value) * 95)
    }
  }, 1000)
}

// 完成进度（由父组件调用）
const complete = () => {
  currentStep.value = 4
  progress.value = 100
  
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  if (stepTimer) {
    clearTimeout(stepTimer)
    stepTimer = null
  }
}

onMounted(() => {
  simulateProgress()
  updateProgress()
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
  if (stepTimer) {
    clearTimeout(stepTimer)
  }
})

// 暴露方法供父组件调用
defineExpose({
  complete
})
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
