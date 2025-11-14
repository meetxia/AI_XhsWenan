<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
      2. 选择文案角度
    </label>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="o in options"
        :key="o.value"
        :class="btnClass(o.value)"
        @click="select(o.value)"
      >{{ o.label }}</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue'

const props = defineProps({ modelValue: { type: String, default: '' } })
const emit = defineEmits(['update:modelValue'])
const model = ref(props.modelValue)

const options = [
  { value: 'story', label: '故事向' },
  { value: 'review', label: '测评向' },
  { value: 'dry_goods', label: '干货向' },
  { value: 'pain_point', label: '痛点向' },
  { value: 'education', label: '教育向' }
]

function select(v) {
  model.value = v
}

watch(model, v => emit('update:modelValue', v))

function btnClass(v) {
  const isSelected = model.value === v
  return [
    'px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ease-in-out',
    isSelected 
      ? 'bg-primary-light text-white dark:bg-primary-dark dark:text-black' 
      : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200',
    'focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark'
  ]
}
</script>

<style scoped>
</style>
