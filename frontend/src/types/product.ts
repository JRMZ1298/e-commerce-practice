export interface ProductImage {
  id: string
  url: string
  altText: string
  sortOrder: number
  isPrimary: boolean
}

export interface VariantOptionValue {
  id: string
  value: string
  sortOrder: number
}

export interface VariantOptionType {
  id: string
  name: string
  sortOrder: number
  values: VariantOptionValue[]
}

export interface ProductVariant {
  id: string
  sku: string
  name: string
  price: number
  comparePrice: number | null
  stock: number
  stockReserved: number
  isActive: boolean
  sortOrder: number
  optionValues: VariantOptionValue[]
}

export interface ProductListDto {
  id: string
  name: string
  slug: string
  brand: string | null
  basePrice: number
  comparePrice: number | null
  stock: number
  isFeatured: boolean
  primaryImage: string | null
  categoryName: string | null
  genero: string | null
  createdAt: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  shortDescription: string
  sku: string
  brand: string | null
  basePrice: number
  comparePrice: number | null
  stock: number
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED'
  isFeatured: boolean
  genero: string | null
  images: ProductImage[]
  category: { id: string; name: string; slug: string } | null
  variants: ProductVariant[]
  optionTypes: VariantOptionType[]
  createdAt: string
}
