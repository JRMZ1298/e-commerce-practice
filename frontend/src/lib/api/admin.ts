import api from './client'
import type { Order } from '@/types/order'

export const adminApi = {
  getDashboardStats: () => api.get('/admin/stats').then((r) => r.data),

  getOrders: (params?: { status?: string }) =>
    api.get<Order[]>('/admin/orders', { params }).then((r) => r.data),

  getOrderByNumber: (orderNumber: string) =>
    api.get<Order>(`/admin/orders/${orderNumber}`).then((r) => r.data),

  updateOrderStatus: (orderNumber: string, status: string, notes?: string) =>
    api.put<Order>(`/admin/orders/${orderNumber}/status`, { status, notes }).then((r) => r.data),
}
