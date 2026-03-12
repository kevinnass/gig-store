import { create } from 'zustand'

interface SearchStore {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  open: () => void
  close: () => void
}

export const useSearch = create<SearchStore>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}))
