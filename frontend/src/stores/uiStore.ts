import { create } from 'zustand'

interface UIStore {
  sidebarOpen: boolean
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: false,
}))
