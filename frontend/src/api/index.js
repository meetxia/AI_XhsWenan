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

export default api
