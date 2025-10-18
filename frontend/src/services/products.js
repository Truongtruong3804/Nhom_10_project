import { USE_MOCKS, api } from './apiClient'
import { mockProducts } from '../mocks/data'

export async function listProducts(params) {
  if (USE_MOCKS) {
    await new Promise((r) => setTimeout(r, 300))
    return mockProducts
  }
  return api.get('/api/products')
}

export async function getProductById(id) {
  if (USE_MOCKS) {
    await new Promise((r) => setTimeout(r, 150))
    return mockProducts.find((p) => p.id === id)
  }
  return api.get(`/api/products/${id}`)
}

export async function createProduct(payload) {
  if (USE_MOCKS) {
    await new Promise((r) => setTimeout(r, 400))
    const created = { ...payload, id: 'p' + Math.random().toString(36).slice(2), images: payload.images?.filter(Boolean) || [] }
    mockProducts.unshift(created)
    return created
  }
  return api.post('/api/products', payload)
}
