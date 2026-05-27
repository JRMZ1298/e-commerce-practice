import api from './client'

export const adminApi = {
  getDashboardStats: () => api.get('/admin/stats').then((r) => r.data),

  getOrders: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get('/admin/orders', { params }).then((r) => r.data),

  getOrderById: (id: string) => api.get(`/admin/orders/${id}`).then((r) => r.data),

  updateOrderStatus: (id: string, status: string) =>
    api.patch(`/admin/orders/${id}/status`, { status }).then((r) => r.data),

  getProducts: (params?: { page?: number; limit?: number }) =>
    api.get('/admin/products', { params }).then((r) => r.data),

  createProduct: (data: unknown) =>
    api.post('/admin/products', data).then((r) => r.data),

  updateProduct: (id: string, data: unknown) =>
    api.patch(`/admin/products/${id}`, data).then((r) => r.data),

  deleteProduct: (id: string) =>
    api.delete(`/admin/products/${id}`).then((r) => r.data),

  getUsers: (params?: { page?: number; limit?: number }) =>
    api.get('/admin/users', { params }).then((r) => r.data),
}
