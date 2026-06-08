import api from './client'
import type { Order } from '@/types/order'
import type { Product, ProductListDto } from '@/types/product'
import type { DashboardStats, AdminUser } from '@/types/admin'
import type { PageResponse } from '@/types/page-response'

export const adminApi = {
  getDashboardStats: () =>
    api.get<DashboardStats>('/admin/stats').then((r) => r.data),

  getOrders: (params?: { status?: string }) =>
    api.get<Order[]>('/admin/orders', { params }).then((r) => r.data),

  getOrderByNumber: (orderNumber: string) =>
    api.get<Order>(`/admin/orders/${orderNumber}`).then((r) => r.data),

  updateOrderStatus: (orderNumber: string, status: string, notes?: string) =>
    api.put<Order>(`/admin/orders/${orderNumber}/status`, { status, notes }).then((r) => r.data),

  getProducts: (page = 0, size = 20) =>
    api.get<PageResponse<ProductListDto>>('/admin/products', { params: { page, size } }).then((r) => r.data),

  getProductById: (id: string) =>
    api.get<Product>(`/admin/products/${id}`).then((r) => r.data),

  createProduct: (data: Record<string, unknown>) =>
    api.post<Product>('/admin/products', data).then((r) => r.data),

  updateProduct: (id: string, data: Record<string, unknown>) =>
    api.put<Product>(`/admin/products/${id}`, data).then((r) => r.data),

  deleteProduct: (id: string) =>
    api.delete(`/admin/products/${id}`).then((r) => r.data),

  addProductImage: (productId: string, url: string, altText?: string, primary?: boolean) =>
    api.post<Product>(`/admin/products/${productId}/images`, null, {
      params: { url, altText: altText || undefined, primary: primary || undefined },
    }).then((r) => r.data),

  deleteProductImage: (productId: string, imageId: string) =>
    api.delete<Product>(`/admin/products/${productId}/images/${imageId}`).then((r) => r.data),

  setPrimaryImage: (productId: string, imageId: string) =>
    api.put<Product>(`/admin/products/${productId}/images/${imageId}/primary`).then((r) => r.data),

  createCategory: (data: Record<string, unknown>) =>
    api.post('/admin/categories', data).then((r) => r.data),

  getUsers: () =>
    api.get<AdminUser[]>('/admin/users').then((r) => r.data),

  getUserById: (id: string) =>
    api.get<AdminUser>(`/admin/users/${id}`).then((r) => r.data),

  updateUserStatus: (id: string, status: string) =>
    api.patch<AdminUser>(`/admin/users/${id}/status`, status, {
      headers: { 'Content-Type': 'text/plain' },
    }).then((r) => r.data),
}
