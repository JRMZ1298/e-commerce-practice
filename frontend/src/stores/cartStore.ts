import { create } from 'zustand'

interface CartStore {
  items: unknown[]
  coupon: unknown | null
  isOpen: boolean
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  coupon: null,
  isOpen: false,
}))
