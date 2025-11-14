<template>
  <button
    @click="toggle"
    class="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 ring-primary-light dark:ring-primary-dark transition-all duration-150"
  >
    <!-- 太阳图标 (浅色模式时显示) -->
    <svg 
      v-if="!isDark"
      class="h-6 w-6" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      stroke-width="2"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
    <!-- 月亮图标 (暗黑模式时显示) -->
    <svg 
      v-else
      class="h-6 w-6" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      stroke-width="2"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  </button>
</template>

<script setup>
import { ref } from 'vue'

const isDark = ref(false)

function apply(theme) {
  const html = document.documentElement
  if (theme === 'dark') html.classList.add('dark')
  else html.classList.remove('dark')
}

function init() {
  // 默认使用浅色模式，符合PRD规范
  const t = localStorage.getItem('theme') || 'light'
  isDark.value = t === 'dark'
  apply(t)
}

function toggle() {
  isDark.value = !isDark.value
  const t = isDark.value ? 'dark' : 'light'
  localStorage.setItem('theme', t)
  apply(t)
}

init()
</script>

<style scoped>
</style>
