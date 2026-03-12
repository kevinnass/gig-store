import { create } from 'zustand'

interface ToastState {
  isOpen: boolean
  message: string
  showToast: (message: string) => void
  hideToast: () => void
}

export const useToastStore = create<ToastState>((set) => ({
  isOpen: false,
  message: '',
  showToast: (message) => {
    set({ isOpen: true, message })
    setTimeout(() => {
      set({ isOpen: false })
    }, 2000)
  },
  hideToast: () => set({ isOpen: false }),
}))
