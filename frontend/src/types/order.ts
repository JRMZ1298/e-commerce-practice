export interface Order {
  id: string
  orderNumber: string
  status: string
  total: number
  items: OrderItem[]
  createdAt: string
}

export interface OrderItem {
  id: string
  productName: string
  variantName: string
  quantity: number
  unitPrice: number
  totalPrice: number
}
