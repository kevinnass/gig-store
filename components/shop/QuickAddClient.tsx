'use client'

import { useState } from 'react'
import { ShoppingCart, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/store/cart'
import { useToastStore } from '@/store/toast'

export function QuickAddClient({ product }: { product: any }) {
  const [loading, setLoading] = useState(false)
  const [added, setAdded] = useState(false)
  const addItem = useCart((state) => state.addItem)
  const showToast = useToastStore((state) => state.showToast)

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const variant = product.product_variants?.[0]
    if (!variant) {
      showToast('Aucun variant disponible')
      return
    }

    setLoading(true)
    
    // Simulate a small delay for premium feel
    setTimeout(() => {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.main_image,
        quantity: 1,
        variant_id: variant.id,
        size: variant.size || '',
        color: variant.color || ''
      })
      
      setLoading(false)
      setAdded(true)
      showToast('Ajouté au panier')
      
      setTimeout(() => setAdded(false), 2000)
    }, 500)
  }

  const isOutOfStock = !product.product_variants?.some((v: any) => v.stock_quantity > 0)

  return (
    <Button
      onClick={handleQuickAdd}
      disabled={isOutOfStock || loading}
      className={`w-full h-11 rounded-none font-bold uppercase tracking-[0.2em] text-[10px] transition-all duration-500 shadow-xl ${
        added 
          ? 'bg-green-600 text-white hover:bg-green-600' 
          : 'bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90'
      }`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : added ? (
        <>
          <Check className="w-4 h-4 mr-2" />
          Ajouté
        </>
      ) : isOutOfStock ? (
        'Rupture'
      ) : (
        <>
          <ShoppingCart className="w-4 h-4 mr-2" />
          Ajouter
        </>
      )}
    </Button>
  )
}
