'use client'

import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cartApi } from '@/lib/api/cart'
import { useCartStore } from '@/stores/cartStore'
import { useAuth } from './useAuth'
import type { CartItem } from '@/types/cart'

export function useCart() {
  const queryClient = useQueryClient()
  const storeItems = useCartStore((s) => s.items)
  const { isOpen, openCart, closeCart, toggleCart, setItems, clearStore } = useCartStore()
  const { isAuthenticated } = useAuth()

  const { data: cart, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: cartApi.getCart,
    retry: 1,
    staleTime: 1000 * 30,
  })

  useEffect(() => {
    if (cart) {
      setItems(cart.items)
    }
  }, [cart, setItems])

  const addMutation = useMutation({
    mutationFn: ({ variantId, quantity }: { variantId: string; quantity: number }) =>
      cartApi.addItem(variantId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ variantId, quantity }: { variantId: string; quantity: number }) =>
      cartApi.updateItemQuantity(variantId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  const removeMutation = useMutation({
    mutationFn: (variantId: string) => cartApi.removeItem(variantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  const clearMutation = useMutation({
    mutationFn: () => cartApi.clearCart(),
    onSuccess: () => {
      clearStore()
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  const items = cart?.items ?? storeItems
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0)

  const addItem = (item: CartItem) => {
    addMutation.mutate({ variantId: item.variantId, quantity: item.quantity })
    openCart()
  }

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(variantId)
      return
    }
    updateMutation.mutate({ variantId, quantity })
  }

  const removeItem = (variantId: string) => {
    removeMutation.mutate(variantId)
  }

  const clearCart = () => {
    clearMutation.mutate()
  }

  return {
    items,
    totalItems,
    subtotal,
    isOpen,
    isLoading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
  }
}
