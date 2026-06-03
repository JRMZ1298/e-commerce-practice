'use client'

import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/authStore'
import { useCallback } from 'react'

export function useAuth() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user, isAuthenticated, isLoading, login, register, logout: storeLogout } =
    useAuthStore()

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      await login(email, password)
    },
    [login]
  )

  const handleRegister = useCallback(
    async (data: {
      email: string
      password: string
      firstName: string
      lastName: string
    }) => {
      await register(data)
    },
    [register]
  )

  const handleLogout = useCallback(() => {
    storeLogout()
    queryClient.clear()
    router.replace('/')
  }, [storeLogout, queryClient, router])

  return {
    user,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  }
}
