<template>
  <div class="h-full flex flex-col">
    <!-- 复制按钮 -->
    <div class="flex-shrink-0 mb-4 text-right">
      <button 
        @click="copyAll"
        class="px-4 py-2 text-sm font-medium rounded-md border border-primary-light text-primary-light hover:bg-primary-light hover:text-white dark:border-primary-dark dark:text-primary-dark dark:hover:bg-primary-dark dark:hover:text-black focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark transition-all duration-150"
      >
        {{ copyButtonText }}
      </button>
    </div>
    
    <!-- 标题 -->
    <div class="flex-shrink-0 mb-4">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
        AI 生成标题
      </label>
      <textarea 
        v-model="title"
        rows="2" 
        class="w-full p-3 font-mono text-lg rounded-md shadow-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-primary-light dark:text-primary-dark focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-transparent"
      ></textarea>
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
import { defineProps, ref, watchEffect } from 'vue'

const props = defineProps({ 
  result: { type: Object, default: () => ({}) },
  loading: { type: Boolean, default: false }
})

const title = ref('')
const body = ref('')
const copyButtonText = ref('复制全部内容')

// 监听结果变化
watchEffect(() => {
  if (props.result) {
    title.value = props.result.title || ''
    // 优先使用bodyXHS，如果没有则使用bodyPlain
    body.value = props.result.bodyXHS || props.result.bodyPlain || ''
  }
})

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
