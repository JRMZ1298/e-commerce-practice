import { create } from 'zustand'

interface AuthStore {
  accessToken: string | null
  user: unknown | null
}

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  user: null,
}))
