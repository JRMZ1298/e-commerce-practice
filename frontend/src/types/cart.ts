export interface CartItem {
  id: string
  variantId: string
  productName: string
  variantName: string
  quantity: number
  unitPrice: number
  totalPrice: number
  imageUrl: string
}

export interface Cart {
  id: string
  items: CartItem[]
  subtotal: number
  total: number
}
