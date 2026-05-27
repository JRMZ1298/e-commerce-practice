'use client'

import { useAuthStore } from '@/stores/authStore'
import { useCallback } from 'react'

export function useAuth() {
  const { user, isAuthenticated, isLoading, login, register, logout } =
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
    logout()
  }, [logout])

  return {
    user,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  }
}
