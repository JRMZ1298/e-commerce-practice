import api from './client'
import type { Cart } from '@/types/cart'

export const cartApi = {
  getCart: () => api.get<Cart>('/v1/cart').then((r) => r.data),

  addItem: (variantId: string, quantity: number) =>
    api.post<Cart>('/v1/cart/items', { variantId, quantity }).then((r) => r.data),

  updateItemQuantity: (variantId: string, quantity: number) =>
    api.patch<Cart>(`/v1/cart/items/${variantId}`, null, { params: { quantity } }).then((r) => r.data),

  removeItem: (variantId: string) =>
    api.delete<Cart>(`/v1/cart/items/${variantId}`).then((r) => r.data),

  clearCart: () => api.delete<void>('/v1/cart').then((r) => r.data),
}
