import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:3002' })

export async function getProducts() {
  const r = await api.get('/api/products')
  return r.data
}

// 只保留AI增强版生成
export async function generateEnhanced(body) {
  console.log('🚀 前端调用AI增强版:', 'http://localhost:3002/api/generate/enhanced')
  console.log('🚀 发送数据:', body)
  const r = await api.post('/api/generate/enhanced', body)
  console.log('🚀 收到AI响应:', r.data)
  return r.data
}

// ================= 历史记录相关API =================

// 获取历史记录列表
export async function getHistory(page = 1, pageSize = 20) {
  console.log('📋 获取历史记录列表:', { page, pageSize })
  const r = await api.get(`/api/history?page=${page}&pageSize=${pageSize}`)
  console.log('📋 历史记录响应:', r.data)
  return r.data
}

// 根据ID获取单条历史记录
export async function getHistoryById(id) {
  console.log('🔍 获取单条历史记录:', id)
  const r = await api.get(`/api/history/${id}`)
  console.log('🔍 历史记录详情:', r.data)
  return r.data
}

// 删除历史记录
export async function deleteHistory(id) {
  console.log('🗑️ 删除历史记录:', id)
  const r = await api.delete(`/api/history/${id}`)
  console.log('🗑️ 删除结果:', r.data)
  return r.data
}

// 获取历史记录统计信息
export async function getHistoryStats() {
  console.log('📊 获取历史记录统计')
  const r = await api.get('/api/history-stats')
  console.log('📊 统计信息:', r.data)
  return r.data
}

// 批量删除历史记录
export async function batchDeleteHistory(ids) {
  console.log('🗑️ 批量删除历史记录:', ids)
  const r = await api.post('/api/history/batch-delete', { ids })
  console.log('🗑️ 批量删除结果:', r.data)
  return r.data
}

// ================= 多轮优化历史记录相关API =================

// 获取多轮优化历史记录列表
export async function getMultiRoundHistory(page = 1, pageSize = 20) {
  console.log('📋 获取多轮优化历史记录列表:', { page, pageSize })
  const r = await api.get(`/api/multi-round-history?page=${page}&pageSize=${pageSize}`)
  console.log('📋 多轮优化历史记录响应:', r.data)
  return r.data
}

// 根据ID获取单条多轮优化历史记录
export async function getMultiRoundHistoryById(id) {
  console.log('🔍 获取单条多轮优化历史记录:', id)
  const r = await api.get(`/api/multi-round-history/${id}`)
  console.log('🔍 多轮优化历史记录详情:', r.data)
  return r.data
}

// 删除多轮优化历史记录
export async function deleteMultiRoundHistory(id) {
  console.log('🗑️ 删除多轮优化历史记录:', id)
  const r = await api.delete(`/api/multi-round-history/${id}`)
  console.log('🗑️ 多轮优化删除结果:', r.data)
  return r.data
}

// 获取多轮优化历史记录统计信息
export async function getMultiRoundHistoryStats() {
  console.log('📊 获取多轮优化历史记录统计')
  const r = await api.get('/api/multi-round-history-stats')
  console.log('📊 多轮优化统计信息:', r.data)
  return r.data
}

export default api
