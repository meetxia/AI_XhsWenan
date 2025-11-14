<template>
  <div class="space-y-3">
    <!-- 标题和切换 -->
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
        🎨 高级参数
      </h3>
      <button
        @click="expanded = !expanded"
        class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <svg :class="['w-5 h-5 transition-transform', expanded ? 'rotate-180' : '']" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>

    <!-- 可折叠内容 -->
    <div v-show="expanded" class="space-y-3 border-t pt-3 border-gray-200 dark:border-gray-700">
      
      <!-- 预设风格选择 - 全宽 -->
      <div>
        <label class="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">
          📱 预设风格
        </label>
        <select 
          v-model="selectedPreset"
          @change="applyPreset"
          class="w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md text-sm focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-gray-100"
        >
          <option value="">自定义设置</option>
          <option value="cautious_education">谨慎教育风格</option>
          <option value="enthusiastic_lifestyle">热情生活风格</option>
          <option value="authentic_review">真实测评风格</option>
          <option value="professional_analysis">专业分析风格</option>
          <option value="bestie_recommendation">闺蜜推荐风格</option>
        </select>
        <p class="text-xs text-gray-500 mt-1">{{ getPresetDescription() }}</p>
      </div>

      <!-- 左右分列布局 -->
      <div class="grid grid-cols-2 gap-3">
        <!-- 左列：个性类型 -->
        <div>
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">
            👤 个性类型
          </label>
          <select 
            v-model="personality"
            class="w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md text-xs focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-gray-100"
          >
            <option value="cautious_rational">谨慎理性型</option>
            <option value="enthusiastic_sharer">热情分享型</option>
            <option value="authentic_experiencer">真实体验型</option>
            <option value="professional_reviewer">专业测评型</option>
            <option value="bestie_chat">闺蜜聊天型</option>
          </select>
        </div>

        <!-- 右列：字数设置 -->
        <div>
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">
            📝 字数设置
          </label>
          <select 
            v-model="wordCount"
            class="w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md text-xs focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-gray-100"
          >
            <option value="short">简短 (200-400字)</option>
            <option value="medium">中等 (400-800字)</option>
            <option value="long">详细 (800-1200字)</option>
            <option value="extra_long">超长 (1200-1600字)</option>
            <option value="ultra_long">超级长 (1600-2000字)</option>
          </select>
        </div>
      </div>

      <!-- 情感参数滑块组 -->
      <div class="space-y-2">
        <h4 class="text-xs font-medium text-gray-700 dark:text-gray-400">🌡️ 情感调节</h4>
        
        <!-- 情感温度 -->
        <div>
          <div class="flex justify-between items-center mb-1">
            <label class="text-xs text-gray-600 dark:text-gray-500">情感温度</label>
            <span class="text-xs px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200">
              {{ warmth }}/10 {{ getWarmthLabel(warmth) }}
            </span>
          </div>
          <input 
            v-model.number="warmth"
            type="range" 
            min="1" 
            max="10"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 range-orange"
          />
          <div class="flex justify-between text-xs text-gray-400 mt-1">
            <span>冷静</span>
            <span>热情</span>
          </div>
        </div>

        <!-- 真实度 -->
        <div>
          <div class="flex justify-between items-center mb-1">
            <label class="text-xs text-gray-600 dark:text-gray-500">真实度</label>
            <span class="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              {{ vulnerability }}/10 {{ getVulnerabilityLabel(vulnerability) }}
            </span>
          </div>
          <input 
            v-model.number="vulnerability"
            type="range" 
            min="1" 
            max="10"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 range-blue"
          />
          <div class="flex justify-between text-xs text-gray-400 mt-1">
            <span>完美</span>
            <span>坦诚</span>
          </div>
        </div>

        <!-- 兴奋度 -->
        <div>
          <div class="flex justify-between items-center mb-1">
            <label class="text-xs text-gray-600 dark:text-gray-500">兴奋度</label>
            <span class="text-xs px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
              {{ excitement }}/10 {{ getExcitementLabel(excitement) }}
            </span>
          </div>
          <input 
            v-model.number="excitement"
            type="range" 
            min="1" 
            max="10"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 range-purple"
          />
          <div class="flex justify-between text-xs text-gray-400 mt-1">
            <span>平静</span>
            <span>激动</span>
          </div>
        </div>
      </div>

      <!-- 目标受众和内容目标 - 左右分列 -->
      <div class="grid grid-cols-2 gap-3">
        <!-- 左列：目标受众 -->
        <div>
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">
            🎯 目标受众
          </label>
          <div class="grid grid-cols-1 gap-1">
            <button
              v-for="age in audienceOptions"
              :key="age.value"
              @click="audienceAge = age.value"
              :class="[
                'p-1.5 text-xs rounded-md border transition-all',
                audienceAge === age.value 
                  ? 'bg-green-500 text-white border-green-500' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              ]"
            >
              {{ age.label }}
            </button>
          </div>
        </div>

        <!-- 右列：内容目标 -->
        <div>
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">
            🚀 内容目标
          </label>
          <div class="grid grid-cols-1 gap-1">
            <button
              v-for="goal in goalOptions"
              :key="goal.value"
              @click="contentGoal = goal.value"
              :class="[
                'p-1.5 text-xs rounded-md border transition-all',
                contentGoal === goal.value 
                  ? 'bg-blue-500 text-white border-blue-500' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              ]"
            >
              {{ goal.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- 重置按钮 -->
      <div class="pt-2 border-t border-gray-200 dark:border-gray-700">
        <button
          @click="resetToDefaults"
          class="w-full py-2 px-3 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 border border-dashed border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          🔄 重置默认
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// Props
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

// Emits
const emit = defineEmits(['update:modelValue'])

// 响应式数据
const expanded = ref(true)
const selectedPreset = ref('')

// 参数数据
const personality = ref('authentic_experiencer')
const warmth = ref(7)
const vulnerability = ref(6)
const excitement = ref(6)
const audienceAge = ref('26-35')
const contentGoal = ref('engagement')
const wordCount = ref('short')

// 选项数据
const audienceOptions = [
  { value: '18-25', label: '年轻群体' },
  { value: '26-35', label: '主力群体' },
  { value: '36+', label: '成熟群体' }
]

const goalOptions = [
  { value: 'engagement', label: '互动参与' },
  { value: 'trust_building', label: '建立信任' },
  { value: 'conversion', label: '转化行动' }
]

// 预设配置
const presets = {
  cautious_education: {
    personality: 'cautious_rational',
    warmth: 5,
    vulnerability: 4,
    excitement: 4,
    audienceAge: '26-35',
    contentGoal: 'trust_building',
    description: '适合教育类产品，理性客观'
  },
  enthusiastic_lifestyle: {
    personality: 'enthusiastic_sharer',
    warmth: 8,
    vulnerability: 7,
    excitement: 8,
    audienceAge: '18-25',
    contentGoal: 'engagement',
    description: '适合生活类产品，热情分享'
  },
  authentic_review: {
    personality: 'authentic_experiencer',
    warmth: 7,
    vulnerability: 8,
    excitement: 6,
    audienceAge: '26-35',
    contentGoal: 'trust_building',
    description: '适合产品测评，真实可信'
  },
  professional_analysis: {
    personality: 'professional_reviewer',
    warmth: 4,
    vulnerability: 3,
    excitement: 4,
    audienceAge: '36+',
    contentGoal: 'conversion',
    description: '适合专业产品，客观分析'
  },
  bestie_recommendation: {
    personality: 'bestie_chat',
    warmth: 9,
    vulnerability: 8,
    excitement: 9,
    audienceAge: '18-25',
    contentGoal: 'engagement',
    description: '适合个人推荐，亲密自然'
  }
}

// 计算属性
const currentParams = computed(() => ({
  personality: personality.value,
  warmth: warmth.value,
  vulnerability: vulnerability.value,
  excitement: excitement.value,
  audienceAge: audienceAge.value,
  contentGoal: contentGoal.value,
  wordCount: wordCount.value
}))

// 监听参数变化，向父组件发送更新
watch(currentParams, (newParams) => {
  emit('update:modelValue', newParams)
}, { deep: true, immediate: true })

// 方法
function getPresetDescription() {
  if (!selectedPreset.value) return '手动调节各项参数'
  return presets[selectedPreset.value]?.description || ''
}

function applyPreset() {
  if (!selectedPreset.value) return
  
  const preset = presets[selectedPreset.value]
  if (preset) {
    personality.value = preset.personality
    warmth.value = preset.warmth
    vulnerability.value = preset.vulnerability
    excitement.value = preset.excitement
    audienceAge.value = preset.audienceAge
    contentGoal.value = preset.contentGoal
  }
}

function getWarmthLabel(value) {
  if (value <= 3) return '冷静'
  if (value <= 6) return '友好'
  if (value <= 8) return '热情'
  return '狂热'
}

function getVulnerabilityLabel(value) {
  if (value <= 3) return '完美'
  if (value <= 6) return '小瑕疵'
  if (value <= 8) return '坦诚'
  return '脆弱'
}

function getExcitementLabel(value) {
  if (value <= 3) return '平静'
  if (value <= 6) return '愉快'
  if (value <= 8) return '激动'
  return '狂欢'
}

function resetToDefaults() {
  selectedPreset.value = ''
  personality.value = 'authentic_experiencer'
  warmth.value = 7
  vulnerability.value = 6
  excitement.value = 6
  audienceAge.value = '26-35'
  contentGoal.value = 'engagement'
  wordCount.value = 'short'
}

// 初始化从props加载数据
if (props.modelValue) {
  const { personality: p, warmth: w, vulnerability: v, excitement: e, audienceAge: a, contentGoal: c, wordCount: wc } = props.modelValue
  if (p) personality.value = p
  if (w) warmth.value = w
  if (v) vulnerability.value = v
  if (e) excitement.value = e
  if (a) audienceAge.value = a
  if (c) contentGoal.value = c
  if (wc) wordCount.value = wc
}
</script>

<style scoped>
/* 滑块样式 */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

/* 滑块轨道 */
input[type="range"]::-webkit-slider-track {
  height: 8px;
  border-radius: 4px;
}

/* 滑块滑块 */
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  border: 2px solid white;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Firefox 滑块 */
input[type="range"]::-moz-range-track {
  height: 8px;
  border-radius: 4px;
  border: none;
}

input[type="range"]::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  border: 2px solid white;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* 橙色滑块（温度） */
.range-orange::-webkit-slider-track {
  background: linear-gradient(to right, #fed7aa 0%, #fb923c 50%, #ea580c 100%);
}

.range-orange::-webkit-slider-thumb {
  background: #fb923c;
}

.range-orange::-moz-range-track {
  background: linear-gradient(to right, #fed7aa 0%, #fb923c 50%, #ea580c 100%);
}

.range-orange::-moz-range-thumb {
  background: #fb923c;
}

/* 蓝色滑块（真实度） */
.range-blue::-webkit-slider-track {
  background: linear-gradient(to right, #dbeafe 0%, #60a5fa 50%, #2563eb 100%);
}

.range-blue::-webkit-slider-thumb {
  background: #60a5fa;
}

.range-blue::-moz-range-track {
  background: linear-gradient(to right, #dbeafe 0%, #60a5fa 50%, #2563eb 100%);
}

.range-blue::-moz-range-thumb {
  background: #60a5fa;
}

/* 紫色滑块（兴奋度） */
.range-purple::-webkit-slider-track {
  background: linear-gradient(to right, #e9d5ff 0%, #a855f7 50%, #7c3aed 100%);
}

.range-purple::-webkit-slider-thumb {
  background: #a855f7;
}

.range-purple::-moz-range-track {
  background: linear-gradient(to right, #e9d5ff 0%, #a855f7 50%, #7c3aed 100%);
}

.range-purple::-moz-range-thumb {
  background: #a855f7;
}

/* 深色主题适配 */
@media (prefers-color-scheme: dark) {
  input[type="range"]::-webkit-slider-thumb {
    border-color: #374151;
  }
  
  input[type="range"]::-moz-range-thumb {
    border-color: #374151;
  }
}
</style>
