import api from './client'
import type { Order, CreateOrderRequest, ValidateCouponRequest, ValidateCouponResponse } from '@/types/order'

export const ordersApi = {
  createOrder: (data: CreateOrderRequest) =>
    api.post<Order>('/orders', data).then((r) => r.data),

  getOrders: () =>
    api.get<Order[]>('/orders').then((r) => r.data),

  getOrderByNumber: (orderNumber: string) =>
    api.get<Order>(`/orders/${orderNumber}`).then((r) => r.data),

  cancelOrder: (orderNumber: string) =>
    api.post(`/orders/${orderNumber}/cancel`).then((r) => r.data),

  validateCoupon: (data: ValidateCouponRequest) =>
    api.post<ValidateCouponResponse>('/orders/validate-coupon', data).then((r) => r.data),
}
