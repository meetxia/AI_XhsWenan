<template>
  <div class="h-full flex flex-col bg-white dark:bg-gray-900">
    <!-- 标题栏 -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          📚 生成历史
        </h2>
        <div class="flex items-center space-x-2">
        <!-- 统计信息 -->
        <span v-if="stats.totalRecords" class="text-sm text-gray-500 dark:text-gray-400">
          {{ stats.totalRecords }}条记录
        </span>
        
        <!-- 刷新按钮 -->
        <button
          @click="refreshHistory"
          :disabled="loading"
          class="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 transition-colors"
          title="刷新"
        >
          <svg class="w-4 h-4" :class="{ 'animate-spin': loading }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        
        <!-- 清空按钮 -->
        <button
          @click="clearAllHistory"
          :disabled="loading || !historyList.length"
          class="p-1.5 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 transition-colors"
          title="清空历史"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
        </div>
      </div>
      
      <!-- 产品筛选器 -->
      <div class="flex items-center space-x-2 mt-3">
        <label class="text-sm text-gray-600 dark:text-gray-400">产品筛选：</label>
        <select 
          v-model="selectedProduct"
          @change="onProductFilterChange"
          class="flex-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">全部产品</option>
          <option v-for="product in productList" :key="product.id" :value="product.id">
            {{ product.name }}
          </option>
        </select>
        <span v-if="selectedProduct" class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
          ({{ filteredHistoryList.length }}条)
        </span>
      </div>
    </div>

    <!-- 历史记录列表 -->
    <div class="flex-1 overflow-y-auto">
      <!-- 加载状态 -->
      <div v-if="loading && historyList.length === 0" class="p-4 text-center text-gray-500 dark:text-gray-400">
        <div class="animate-pulse">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else-if="!loading && filteredHistoryList.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
        <svg class="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <p v-if="selectedProduct" class="text-base font-medium">该产品暂无生成记录</p>
        <p v-else class="text-base font-medium">还没有生成记录</p>
        <p class="text-sm mt-1">生成文案后会自动保存到这里</p>
      </div>

      <!-- 历史记录项 -->
      <div v-else-if="filteredHistoryList.length > 0" class="space-y-3 p-4">
        <div
          v-for="record in filteredHistoryList"
          :key="record.id"
          :class="[
            'bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700',
            'hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors cursor-pointer',
            selectedRecord?.id === record.id ? 'ring-2 ring-blue-500' : ''
          ]"
          @click="selectRecord(record)"
        >
          <!-- 记录头部信息 -->
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-1 line-clamp-2">
                {{ record.result.title }}
              </h3>
              <div class="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                <span class="flex items-center">
                  📦 {{ record.productInfo.name }}
                </span>
                <span>•</span>
                <span>{{ formatTime(record.timestamp) }}</span>
              </div>
            </div>
            
            <!-- 删除按钮 -->
            <button
              @click.stop="deleteRecord(record.id)"
              class="p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="删除记录"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- 预览内容 -->
          <div class="text-xs text-gray-600 dark:text-gray-300 mb-3">
            <p class="line-clamp-2">{{ record.result.bodyPlain }}</p>
          </div>

          <!-- 参数信息 -->
          <div class="flex flex-wrap gap-1">
            <span class="inline-block px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
              {{ record.generationParams.style }}
            </span>
            <span class="inline-block px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded">
              {{ record.generationParams.personality }}
            </span>
            <span v-if="record.generationParams.keywords" class="inline-block px-2 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded">
              🔑 {{ record.generationParams.keywords }}
            </span>
          </div>
        </div>
      </div>

      <!-- 加载更多按钮 -->
      <div v-if="pagination.hasMore" class="p-4">
        <button
          @click="loadMore"
          :disabled="loadingMore"
          class="w-full py-2 text-sm text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {{ loadingMore ? '加载中...' : '加载更多' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, defineEmits } from 'vue'
import { getHistory, deleteHistory, batchDeleteHistory, getHistoryStats, getProducts } from '../api/index.js'

// 定义事件
const emit = defineEmits(['select-record'])

// 状态管理
const loading = ref(false)
const loadingMore = ref(false)
const historyList = ref([])
const selectedRecord = ref(null)
const productList = ref([])
const selectedProduct = ref('')

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0,
  totalPages: 0,
  hasMore: false
})

const stats = reactive({
  totalRecords: 0,
  totalFiles: 0,
  files: []
})

// 筛选后的历史记录列表
const filteredHistoryList = computed(() => {
  if (!selectedProduct.value) {
    return historyList.value
  }
  return historyList.value.filter(record => 
    record.productInfo?.id === selectedProduct.value
  )
})

// 产品筛选变化处理
const onProductFilterChange = () => {
  console.log('📦 产品筛选:', selectedProduct.value || '全部产品')
  // 筛选后自动选择第一条记录（如果有）
  if (filteredHistoryList.value.length > 0) {
    selectRecord(filteredHistoryList.value[0])
  } else {
    selectedRecord.value = null
    emit('select-record', null)
  }
}

// 加载产品列表
const loadProducts = async () => {
  try {
    const response = await getProducts()
    productList.value = response.products || []
    console.log('📦 产品列表加载完成:', productList.value.length, '个产品')
  } catch (error) {
    console.error('❌ 加载产品列表失败:', error)
  }
}

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now - date
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffHours < 1) {
    return '刚刚'
  } else if (diffHours < 24) {
    return `${diffHours}小时前`
  } else if (diffDays < 7) {
    return `${diffDays}天前`
  } else {
    return date.toLocaleDateString('zh-CN', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

// 加载历史记录
const loadHistory = async (reset = false) => {
  try {
    if (reset) {
      loading.value = true
      pagination.page = 1
      historyList.value = []
    } else {
      loadingMore.value = true
    }

    const response = await getHistory(pagination.page, pagination.pageSize)
    
    if (reset) {
      historyList.value = response.records
    } else {
      historyList.value.push(...response.records)
    }

    pagination.total = response.pagination.total
    pagination.totalPages = response.pagination.totalPages
    pagination.hasMore = response.pagination.hasMore

    console.log(`📋 历史记录加载完成: 第${pagination.page}页, ${response.records.length}条`)
  } catch (error) {
    console.error('❌ 加载历史记录失败:', error)
    // 可以在这里添加错误提示
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

// 加载统计信息
const loadStats = async () => {
  try {
    const response = await getHistoryStats()
    Object.assign(stats, response)
  } catch (error) {
    console.error('❌ 加载统计信息失败:', error)
  }
}

// 刷新历史记录
const refreshHistory = () => {
  loadHistory(true)
  loadStats()
}

// 加载更多
const loadMore = () => {
  pagination.page++
  loadHistory(false)
}

// 选择记录
const selectRecord = (record) => {
  selectedRecord.value = record
  emit('select-record', record)
}

// 删除单条记录
const deleteRecord = async (id) => {
  if (!confirm('确定要删除这条记录吗？')) {
    return
  }

  try {
    await deleteHistory(id)
    
    // 从列表中移除记录
    const index = historyList.value.findIndex(r => r.id === id)
    if (index !== -1) {
      historyList.value.splice(index, 1)
    }

    // 如果删除的是当前选中的记录，清空选中状态
    if (selectedRecord.value?.id === id) {
      selectedRecord.value = null
      emit('select-record', null)
    }

    // 更新统计信息
    stats.totalRecords--

    console.log('✅ 记录删除成功')
  } catch (error) {
    console.error('❌ 删除记录失败:', error)
    alert('删除失败，请重试')
  }
}

// 清空所有历史记录
const clearAllHistory = async () => {
  if (!confirm('确定要清空所有历史记录吗？此操作不可恢复！')) {
    return
  }

  try {
    const ids = historyList.value.map(r => r.id)
    if (ids.length === 0) return

    loading.value = true
    await batchDeleteHistory(ids)
    
    // 清空列表和选中状态
    historyList.value = []
    selectedRecord.value = null
    emit('select-record', null)
    
    // 重置分页和统计
    pagination.page = 1
    pagination.total = 0
    pagination.totalPages = 0
    pagination.hasMore = false
    stats.totalRecords = 0

    console.log('✅ 历史记录清空成功')
  } catch (error) {
    console.error('❌ 清空历史记录失败:', error)
    alert('清空失败，请重试')
  } finally {
    loading.value = false
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadProducts()
  refreshHistory()
})

// 暴露方法供父组件调用
defineExpose({
  refreshHistory,
  addNewRecord: (record) => {
    // 新记录插入到列表开头
    historyList.value.unshift(record)
    stats.totalRecords++
  }
})
</script>

<style scoped>
/* 文本截断样式 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
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
