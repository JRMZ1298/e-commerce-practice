import api from './client'
import type { Order } from '@/types/order'

interface OrdersResponse {
  data: Order[]
  total: number
  page: number
  limit: number
}

export const ordersApi = {
  getOrders: (page = 1, limit = 10) =>
    api.get<OrdersResponse>('/orders', { params: { page, limit } }).then((r) => r.data),

  getOrderByNumber: (orderNumber: string) =>
    api.get<Order>(`/orders/${orderNumber}`).then((r) => r.data),
}
