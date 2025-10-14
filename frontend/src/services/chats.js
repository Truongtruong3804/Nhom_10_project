import { USE_MOCKS, api } from './apiClient'
import { mockChats } from '../mocks/data'

export async function listChats() {
  if (USE_MOCKS) {
    await new Promise((r) => setTimeout(r, 200))
    return mockChats
  }
  return api.get('/api/chats')
}

export async function getChatById(id) {
  if (USE_MOCKS) {
    await new Promise((r) => setTimeout(r, 150))
    return mockChats.find((c) => c.id === id)
  }
  return api.get(`/api/chats/${id}`)
}

export async function sendMessage(chatId, text) {
  if (USE_MOCKS) {
    const chat = mockChats.find((c) => c.id === chatId)
    chat.messages.push({ me: true, text, at: Date.now() })
    return {
      ...chat,
      lastMessage: text,
    }
  }
  return api.post(`/api/chats/${chatId}/messages`, { text })
}
