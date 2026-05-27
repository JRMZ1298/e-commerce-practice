import { create } from 'zustand'
import type { User } from '@/types/user'
import { authApi } from '@/lib/api/auth'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>
  logout: () => void
  refreshTokenAction: () => Promise<void>
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true })
    try {
      const res = await authApi.login({ email, password })
      set({
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        user: res.user,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch {
      set({ isLoading: false })
      throw new Error('Credenciales inválidas')
    }
  },

  register: async (data) => {
    set({ isLoading: true })
    try {
      const res = await authApi.register(data)
      set({
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        user: res.user,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch {
      set({ isLoading: false })
      throw new Error('Error al registrar')
    }
  },

  logout: () => {
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    })
  },

  refreshTokenAction: async () => {
    const { refreshToken } = get()
    if (!refreshToken) return
    try {
      const res = await authApi.refresh(refreshToken)
      set({
        accessToken: res.accessToken,
        refreshToken: res.refreshToken ?? refreshToken,
      })
    } catch {
      get().logout()
    }
  },

  setUser: (user: User) => set({ user }),
}))
