export interface Order {
  id: string
  orderNumber: string
  status: 'AWAITING_PAYMENT' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  subtotal: number
  discount: number
  total: number
  couponCode: string | null
  shippingAddress: string
  notes: string | null
  items: OrderItem[]
  statusHistory: OrderStatusEntry[]
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  variantId: string | null
  productName: string
  variantName: string | null
  productSlug: string | null
  imageUrl: string | null
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface OrderStatusEntry {
  id: string
  fromStatus: string | null
  toStatus: string
  changedBy: string | null
  notes: string | null
  createdAt: string
}

export interface CreateOrderRequest {
  addressId: string
  couponCode?: string
  notes?: string
}

export interface ValidateCouponRequest {
  code: string
  subtotal: number
}

export interface ValidateCouponResponse {
  valid: boolean
  message: string
  discount: number
}
