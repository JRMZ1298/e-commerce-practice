import api from "./client";
import type { Product, ProductListDto } from "@/types/product";
import type { PageResponse } from "@/types/page-response";

export interface ProductsParams {
  page?: number;
  size?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: string;
  brand?: string;
  tag?: string;
  inStock?: boolean;
}

export const productsApi = {
  getProducts: (params?: ProductsParams) =>
    api
      .get<PageResponse<ProductListDto>>("/products", { params })
      .then((r) => r.data),

  getProductBySlug: (slug: string) =>
    api.get<Product>(`/products/${slug}`).then((r) => r.data),

  getCategories: () =>
    api
      .get<
        Array<{
          id: string;
          name: string;
          slug: string;
          description: string | null;
          imageUrl: string | null;
          parentId: string | null;
          children: any[];
        }>
      >("/categories")
      .then((r) => r.data),
};
