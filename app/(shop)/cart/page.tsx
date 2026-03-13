'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/store/cart'
import Link from 'next/link'
import { ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CartPage() {
  const [mounted, setMounted] = useState(false)
  const items = useCart((state) => state.items)
  const removeItem = useCart((state) => state.removeItem)
  const updateQuantity = useCart((state) => state.updateQuantity)
  const totalPrice = useCart((state) => state.totalPrice())

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="container mx-auto px-4 py-24 md:py-32 min-h-[60vh]" />
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 md:py-32 flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase mb-6 text-center">Votre panier est vide</h1>
        <p className="text-muted-foreground mb-8 text-center max-w-md">
          On dirait que vous n&apos;avez pas encore trouvé votre bonheur. Découvrez nos nouveautés.
        </p>
        <Link href="/shop">
          <Button className="h-14 px-8 rounded-none font-bold uppercase tracking-[0.2em] text-xs bg-black text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200">
            Retourner à la boutique
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 mt-16 md:mt-16">
      <Link href="/shop" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-black dark:hover:text-white transition-colors mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Continuer mes achats
      </Link>

      <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mb-12">Mon Panier</h1>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
        {/* Cart Items List */}
        <div className="flex-1 space-y-8">
          <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            <div className="col-span-6">Produit</div>
            <div className="col-span-3 text-center">Quantité</div>
            <div className="col-span-2 text-right">Total</div>
            <div className="col-span-1 text-right"></div>
          </div>

          <div className="space-y-8 md:space-y-6">
            {items.map((item) => (
              <div key={item.variant_id} className="flex flex-col md:grid md:grid-cols-12 gap-4 md:items-center border-b border-slate-100 dark:border-slate-800/50 pb-8 md:pb-6">
                
                {/* Product Info */}
                <div className="col-span-6 flex gap-6">
                  <div className="w-24 h-32 md:w-20 md:h-28 shrink-0 bg-slate-100 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 relative">
                    {item.image ? (
                      <div 
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url('${item.image}')` }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[8px] text-slate-300">Sans image</div>
                    )}
                  </div>
                  <div className="flex flex-col justify-center space-y-2">
                    <Link href={`/product/${item.id}`} className="font-bold text-sm md:text-base uppercase hover:underline leading-tight">
                      {item.name}
                    </Link>
                    {(item.color || item.size) && (
                      <p className="text-xs text-slate-500">
                        {item.color} {item.color && item.size && '|'} {item.size}
                      </p>
                    )}
                    <p className="text-sm md:hidden font-medium">{item.price} CFA</p>
                  </div>
                </div>

                {/* Quantity */}
                <div className="col-span-3 flex md:justify-center items-center mt-4 md:mt-0">
                  <div className="flex items-center w-28 h-10 border border-slate-200 dark:border-slate-800">
                    <button 
                      onClick={() => updateQuantity(item.variant_id, item.quantity - 1)}
                      className="w-8 h-full flex items-center justify-center text-slate-500 hover:text-black dark:hover:text-white transition-colors"
                      aria-label="Diminuer la quantité"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex-1 flex items-center justify-center text-xs font-bold">
                      {item.quantity}
                    </div>
                    <button 
                      onClick={() => updateQuantity(item.variant_id, item.quantity + 1)}
                      className="w-8 h-full flex items-center justify-center text-slate-500 hover:text-black dark:hover:text-white transition-colors"
                      aria-label="Augmenter la quantité"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Total Price */}
                <div className="col-span-2 hidden md:flex justify-end font-bold text-sm">
                  {(item.price * item.quantity)} CFA
                </div>

                {/* Remove Button */}
                <div className="col-span-1 flex justify-end absolute md:relative right-4 md:right-0 mt-2 md:mt-0">
                  <button 
                    onClick={() => removeItem(item.variant_id)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                    aria-label="Supprimer du panier"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-[400px] shrink-0">
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 space-y-6 sticky top-28">
            <h2 className="text-lg font-bold uppercase tracking-widest border-b border-slate-200 dark:border-slate-800 pb-4">Résumé</h2>
            
            <div className="space-y-4 text-sm border-b border-slate-200 dark:border-slate-800 pb-6">
              <div className="flex justify-between">
                <span className="text-slate-500">Sous-total</span>
                <span className="font-medium">{totalPrice} CFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Livraison</span>
                <span className="font-medium">Calculé à l&apos;étape suivante</span>
              </div>
            </div>

            <div className="flex justify-between items-end pt-2">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Total</span>
              <span className="text-2xl font-bold">{totalPrice} CFA</span>
            </div>

            <Link href="/checkout" className="block pt-4">
              <Button className="w-full h-14 rounded-none font-bold uppercase tracking-[0.2em] text-xs bg-black text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200">
                Procéder au paiement
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
