import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  variant_id: string
  size?: string
  color?: string
}

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (variantId: string) => void
  updateQuantity: (variantId: string, quantity: number) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const items = get().items
        const existingItem = items.find((i) => i.variant_id === item.variant_id)

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.variant_id === item.variant_id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          })
        } else {
          set({ items: [...items, item] })
        }
      },
      removeItem: (variantId) => {
        set({
          items: get().items.filter((i) => i.variant_id !== variantId),
        })
      },
      updateQuantity: (variantId, quantity) => {
        set({
          items: get().items.map((i) =>
            i.variant_id === variantId ? { ...i, quantity } : i
          ),
        })
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      totalPrice: () => get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    }),
    {
      name: 'gig-store-cart',
    }
  )
)
