'use client'

import { useCartStore } from '@/stores/cartStore'
import { useCallback } from 'react'
import type { CartItem } from '@/types/cart'

export function useCart() {
  const { items, isOpen, addItem, removeItem, updateQuantity, clearCart, openCart, closeCart, toggleCart } =
    useCartStore()

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0)

  const handleAdd = useCallback(
    (item: CartItem) => {
      addItem(item)
      openCart()
    },
    [addItem, openCart]
  )

  const handleRemove = useCallback(
    (id: string) => {
      removeItem(id)
    },
    [removeItem]
  )

  const handleUpdateQuantity = useCallback(
    (id: string, quantity: number) => {
      if (quantity < 1) {
        removeItem(id)
        return
      }
      updateQuantity(id, quantity)
    },
    [updateQuantity, removeItem]
  )

  return {
    items,
    totalItems,
    subtotal,
    isOpen,
    addItem: handleAdd,
    removeItem: handleRemove,
    updateQuantity: handleUpdateQuantity,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
  }
}
