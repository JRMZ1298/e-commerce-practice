import api from './client'
import type { ProductListDto } from '@/types/product'
import type { PageResponse } from '@/types/page-response'

export interface SearchParams {
  q?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  brand?: string
  inStock?: boolean
  sort?: string
  page?: number
  size?: number
}

export const searchApi = {
  search: (params?: SearchParams) =>
    api.get<PageResponse<ProductListDto>>('/v1/search', { params }).then((r) => r.data),
}
