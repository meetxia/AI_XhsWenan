<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-all duration-200 xl:py-8">
    <!-- 外层容器：电脑端居中，响应式宽度，iPad和移动端全宽 -->
    <div 
      :style="containerStyle" 
      class="mx-auto shadow-2xl bg-white dark:bg-gray-900 rounded-lg overflow-hidden transition-all duration-300 ease-out"
    >
      <!-- 双栏布局 -->
      <div class="flex flex-col md:flex-row min-h-screen xl:min-h-[90vh]">
      
        <!-- 左栏：控制台 (Control Panel) -->
        <aside class="w-full md:w-2/5 lg:w-1/3 flex-shrink-0 flex flex-col bg-white dark:bg-gray-900 border-b md:border-b-0 md:border-r border-gray-300 dark:border-gray-700 shadow-lg md:h-screen xl:h-[90vh] relative">
          
          <!-- 顶部：标题和主题切换 -->
          <div class="flex items-center justify-between p-4 flex-shrink-0 border-b border-gray-200 dark:border-gray-700">
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">
              XHS Content Matrix
            </h1>
            <ThemeToggle />
          </div>
          
          <!-- 滚动配置区域 -->
          <div class="flex-1 overflow-y-auto p-4 pb-20">
            <!-- 产品选择 -->
            <ProductSelector v-model="productId" class="mb-3" />
            
            <!-- 角度选择 -->
            <AngleSelector v-model="style" class="mb-3" />
            
            <!-- 关键词输入 -->
            <div class="mb-3">
              <label class="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">
                3. 关键词（可选，逗号分隔）
              </label>
              <input 
                v-model="keywords" 
                placeholder="如：效率,稳健" 
                class="w-full p-2 text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-transparent text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <!-- 高级参数控制 -->
            <AdvancedControls v-model="advancedParams" class="mb-3" />
          </div>
          
          <!-- 固定在底部的生成按钮 -->
          <div class="absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <button 
              @click="onGenerate"
              :disabled="disabled"
              class="w-full text-base font-bold py-3 px-4 rounded-md shadow-lg transition-all duration-150 ease-in-out bg-primary-light hover:bg-green-600 text-white dark:bg-primary-dark dark:hover:bg-green-400 dark:text-black focus:outline-none focus:ring-4 focus:ring-primary-light dark:focus:ring-primary-dark disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              <span :class="loading ? 'animate-pulse-green-light dark:animate-pulse-green-dark' : ''">
                {{ generateButtonText }}
              </span>
            </button>
          </div>
        </aside>
        
        <!-- 右栏：结果展示 (Generation Zone) -->
        <main class="w-full md:w-3/5 lg:w-2/3 flex flex-col p-6 md:p-10 bg-gray-50 dark:bg-gray-800 md:h-screen xl:h-[90vh] overflow-y-auto">
          
          <!-- 占位符 -->
          <div v-if="!result.title && !loading" class="m-auto text-center text-gray-500 dark:text-gray-400">
            <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 class="mt-2 text-lg font-medium">// 等待生成</h2>
            <p class="mt-1 text-sm">在左侧选择产品和角度后点击生成...</p>
          </div>
          
          <!-- 结果展示区 -->
          <div v-if="result.title" class="h-full flex flex-col">
            <ResultDisplay :result="result" :loading="loading" />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ThemeToggle from './components/ThemeToggle.vue'
import ProductSelector from './components/ProductSelector.vue'
import AngleSelector from './components/AngleSelector.vue'
import AdvancedControls from './components/AdvancedControls.vue'
import ResultDisplay from './components/ResultDisplay.vue'
import { generateEnhanced } from './api/index.js'

// 响应式数据
const productId = ref('')
const style = ref('')
const keywords = ref('')
const loading = ref(false)
const result = ref({})
const advancedParams = ref({
  personality: 'authentic_experiencer',
  warmth: 7,
  vulnerability: 6,
  excitement: 6,
  audienceAge: '26-35',
  contentGoal: 'engagement',
  wordCount: 'short'
})

// 窗口宽度响应式计算
const windowWidth = ref(window.innerWidth)

// 更新窗口宽度
const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth
}

// 计算容器宽度
const containerStyle = computed(() => {
  const width = windowWidth.value
  let containerWidth = '100%'
  
  if (width >= 1920) {
    // 超大屏幕：70%
    containerWidth = '70%'
  } else if (width >= 1200) {
    // 1200px-1920px：线性插值 100% -> 70%
    const progress = (width - 1200) / (1920 - 1200) // 0 to 1
    const widthPercent = 100 - (progress * 30) // 100% -> 70%
    containerWidth = `${widthPercent}%`
  } else {
    // 小屏幕：100%
    containerWidth = '100%'
  }
  
  return {
    width: containerWidth
  }
})

// 生命周期
onMounted(() => {
  window.addEventListener('resize', updateWindowWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowWidth)
})

// 计算属性
const disabled = computed(() => !productId.value || !style.value || loading.value)

const isEnhancedMode = computed(() => {
  return advancedParams.value && Object.keys(advancedParams.value).length > 0
})

const generateButtonText = computed(() => {
  if (loading.value) return '🤖 AI 生成中...'
  return '🎨 AI 智能生成'
})

// AI生成文案函数 - 完全重写确保只走AI路径
async function onGenerate() {
  if (disabled.value) return
  
  loading.value = true
  result.value = {} // 清空上次结果
  
  try {
    // 🚨 强制只能走AI生成 - 无其他路径
    console.log('='.repeat(50))
    console.log('🚀 开始AI生成流程')
    console.log('🚀 时间:', new Date().toLocaleString())
    console.log('='.repeat(50))
    
    // 🔍 先检查后端是否可达
    console.log('🔍 检查后端连接...')
    try {
      const healthResponse = await fetch('http://localhost:3002/api/health')
      console.log('💚 健康检查响应状态:', healthResponse.status)
      if (healthResponse.ok) {
        console.log('✅ 后端连接正常')
      } else {
        throw new Error(`后端健康检查失败: ${healthResponse.status}`)
      }
    } catch (healthError) {
      console.error('❌ 后端连接失败:', healthError)
      throw new Error('无法连接到后端服务，请检查后端是否启动')
    }
    
    const aiPayload = {
      productId: productId.value, 
      style: style.value, 
      keywords: keywords.value,
      personality: advancedParams.value.personality,
      warmth: advancedParams.value.warmth,
      vulnerability: advancedParams.value.vulnerability,
      excitement: advancedParams.value.excitement,
      audienceAge: advancedParams.value.audienceAge,
      contentGoal: advancedParams.value.contentGoal,
      wordCount: advancedParams.value.wordCount
    }
    
    console.log('📤 AI请求参数:', JSON.stringify(aiPayload, null, 2))
    console.log('📡 调用接口: POST /api/generate/enhanced')
    
    // 🎯 直接调用AI接口 - 无备用方案
    const startTime = Date.now()
    const aiResponse = await fetch('http://localhost:3002/api/generate/enhanced', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(aiPayload)
    })
    
    const responseTime = Date.now() - startTime
    console.log(`⏱️ AI响应时间: ${responseTime}ms`)
    
    if (!aiResponse.ok) {
      throw new Error(`AI服务响应错误: ${aiResponse.status} ${aiResponse.statusText}`)
    }
    
    const aiData = await aiResponse.json()
    console.log('📥 AI响应数据:', JSON.stringify(aiData, null, 2))
    
    // 验证AI响应
    if (!aiData.title && !aiData.bodyPlain) {
      throw new Error('AI响应数据无效')
    }
    
    console.log('✅ AI生成成功!')
    result.value = aiData
    
  } catch (error) {
    console.error('❌ AI生成失败:', error)
    console.log('❌ 错误类型:', error.name)
    console.log('❌ 错误消息:', error.message)
    console.log('❌ 错误堆栈:', error.stack)
    console.log('='.repeat(50))
    
    // 显示具体错误信息给用户
    alert(`❌ 生成失败: ${error.message}\n\n请检查：\n1. 后端服务是否启动\n2. 端口3002是否正确\n3. 网络连接是否正常`)
    
    // 失败时显示空白 - 绝不显示模板内容
    result.value = { 
      title: '', 
      bodyPlain: '', 
      bodyXHS: '', 
      tags: [],
      error: true,
      errorMessage: error.message
    }
  } finally {
    loading.value = false
    console.log('🏁 生成流程结束')
    console.log('='.repeat(50))
  }
}
</script>

<style>
/* 全局样式优化 */
* {
  transition: background-color 0.2s ease-out, color 0.2s ease-out, border-color 0.2s ease-out;
}

body {
  font-family: 'Inter', 'PingFang SC', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}


/* 滚动条样式 */
::-webkit-scrollbar { 
  width: 4px; 
}
::-webkit-scrollbar-thumb { 
  background: #888; 
  border-radius: 4px; 
}
::-webkit-scrollbar-thumb:hover { 
  background: #555; 
}
</style>
