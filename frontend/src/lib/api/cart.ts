import api from './client'
import type { Cart } from '@/types/cart'

interface AddItemPayload {
  variantId: string
  quantity: number
}

interface UpdateQuantityPayload {
  quantity: number
}

export const cartApi = {
  getCart: () => api.get<Cart>('/cart').then((r) => r.data),

  addItem: (data: AddItemPayload) =>
    api.post<Cart>('/cart/items', data).then((r) => r.data),

  updateQuantity: (itemId: string, data: UpdateQuantityPayload) =>
    api.patch<Cart>(`/cart/items/${itemId}`, data).then((r) => r.data),

  removeItem: (itemId: string) =>
    api.delete<Cart>(`/cart/items/${itemId}`).then((r) => r.data),
}
