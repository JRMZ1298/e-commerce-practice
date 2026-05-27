import { create } from 'zustand'

interface UIStore {
  sidebarOpen: boolean
  mobileMenuOpen: boolean
  setSidebarOpen: (open: boolean) => void
  setMobileMenuOpen: (open: boolean) => void
  toggleMobileMenu: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: false,
  mobileMenuOpen: false,

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
}))
