<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
      1. 选择产品 ({{products.length}}个)
    </label>
    <div class="relative">
      <select 
        v-model="model"
        class="w-full p-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-transparent text-gray-900 dark:text-gray-100 appearance-none cursor-pointer pr-10 transition-all duration-150"
      >
        <option disabled value="" class="text-gray-500 dark:text-gray-400">请选择一个产品...</option>
        <option 
          v-for="p in products" 
          :key="p.id" 
          :value="p.id"
          class="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 py-2 px-3 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          {{ p.name }}
        </option>
      </select>
      <!-- 自定义下拉箭头 -->
      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg class="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, defineProps, defineEmits } from 'vue'
import { getProducts } from '../api/index.js'

const props = defineProps({ modelValue: { type: String, default: '' } })
const emit = defineEmits(['update:modelValue'])
const products = ref([])
const model = ref(props.modelValue)

watch(model, v => emit('update:modelValue', v))

onMounted(async () => {
  try {
    console.log('🔄 正在加载产品数据...')
    const data = await getProducts()
    console.log('📦 产品数据:', data)
    console.log('📊 产品数量:', data?.length || 0)
    
    if (!data || !Array.isArray(data)) {
      console.error('❌ 产品数据格式错误:', data)
      products.value = []
      return
    }
    
    products.value = data
    console.log('✅ 产品加载完成:', products.value.length, '个产品')
  } catch (error) {
    console.error('❌ 产品加载失败:', error)
    console.error('错误详情:', error.message)
    console.error('请检查后端服务是否正常运行在 http://localhost:3002')
    products.value = []
  }
})
</script>

<style scoped>
/* 优化下拉框选项样式 */
select option {
  padding: 8px 12px;
  background-color: white;
  color: #1f2937;
}

/* 暗黑模式下的选项样式 */
:global(.dark) select option {
  background-color: #1f2937;
  color: #f3f4f6;
}

/* 选中状态的选项 */
select option:checked {
  background-color: #047857;
  color: white;
}

:global(.dark) select option:checked {
  background-color: #10b981;
  color: #000000;
}

/* 悬停状态 */
select option:hover {
  background-color: #f9fafb;
}

:global(.dark) select option:hover {
  background-color: #374151;
}

/* 禁用状态的选项 */
select option:disabled {
  color: #9ca3af;
  background-color: #f3f4f6;
}

:global(.dark) select option:disabled {
  color: #6b7280;
  background-color: #1f2937;
}
</style>
