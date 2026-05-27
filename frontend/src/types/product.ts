export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  images: ProductImage[]
  variants: ProductVariant[]
}

export interface ProductImage {
  id: string
  url: string
  altText: string
  isPrimary: boolean
}

export interface ProductVariant {
  id: string
  sku: string
  name: string
  price: number
  stock: number
}
