import api from './client'
import type { Product } from '@/types/product'

interface ProductsResponse {
  data: Product[]
  total: number
  page: number
  limit: number
}

interface ProductsParams {
  page?: number
  limit?: number
  category?: string
  search?: string
  sort?: string
}

export const productsApi = {
  getProducts: (params?: ProductsParams) =>
    api.get<ProductsResponse>('/products', { params }).then((r) => r.data),

  getProductBySlug: (slug: string) =>
    api.get<Product>(`/products/${slug}`).then((r) => r.data),

  getCategories: () =>
    api
      .get<Array<{ id: string; name: string; slug: string }>>('/categories')
      .then((r) => r.data),
}
