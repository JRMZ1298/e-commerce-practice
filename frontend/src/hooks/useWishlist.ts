'use client'

import { useState, useCallback } from 'react'

interface WishlistItem {
  id: string
  productId: string
  name: string
  price: number
  imageUrl: string
}

export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([])

  const addItem = useCallback((item: WishlistItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.productId === item.productId)) return prev
      return [...prev, item]
    })
  }, [])

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId))
  }, [])

  const isInWishlist = useCallback(
    (productId: string) => items.some((i) => i.productId === productId),
    [items]
  )

  return { items, addItem, removeItem, isInWishlist }
}
