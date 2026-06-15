import { create } from 'zustand'

interface UIStore {
  sidebarOpen: boolean
  mobileMenuOpen: boolean
  isDark: boolean
  setSidebarOpen: (open: boolean) => void
  setMobileMenuOpen: (open: boolean) => void
  toggleMobileMenu: () => void
  toggleDark: () => void
}

function getInitialDark(): boolean {
  if (typeof window === 'undefined') return false
  const stored = localStorage.getItem('theme')
  if (stored) return stored === 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: false,
  mobileMenuOpen: false,
  isDark: getInitialDark(),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),

  toggleDark: () => set((state) => {
    const next = !state.isDark
    localStorage.setItem('theme', next ? 'dark' : 'light')
    return { isDark: next }
  }),
}))
