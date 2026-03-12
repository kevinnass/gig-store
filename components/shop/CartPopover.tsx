'use client'

import { useCart } from '@/store/cart'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CartPopover() {
  const items = useCart((state) => state.items)
  const removeItem = useCart((state) => state.removeItem)
  const totalPrice = useCart((state) => state.totalPrice())

  if (items.length === 0) {
    return (
      <div className="p-6 text-center w-72">
        <p className="text-sm text-slate-500 font-medium">Votre panier est vide.</p>
      </div>
    )
  }

  return (
    <div className="w-80 p-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xl">
      <div className="max-h-[300px] overflow-y-auto pr-2 no-scrollbar space-y-4 mb-4">
        {items.map((item) => (
          <div key={item.variant_id} className="flex gap-4">
            {/* Image */}
            <div className="w-16 h-20 shrink-0 bg-slate-100 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 relative">
              {item.image ? (
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url('${item.image}')` }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[8px] text-slate-300">Sans image</div>
              )}
            </div>
            
            {/* Infos */}
            <div className="flex-1 flex flex-col justify-start">
              <div className="flex justify-between items-start gap-2">
                <Link href={`/product/${item.id}`} className="text-xs font-bold leading-tight hover:underline">
                  {item.name}
                </Link>
                <button 
                  onClick={() => removeItem(item.variant_id)}
                  className="text-slate-400 hover:text-red-500 transition-colors shrink-0"
                  aria-label="Supprimer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              
              <div className="mt-1 space-y-0.5">
                {(item.color || item.size) && (
                  <p className="text-[10px] text-slate-500">
                    {item.color} {item.color && item.size && '-'} {item.size}
                  </p>
                )}
                <p className="text-[10px] font-medium">
                  {item.quantity} × {item.price} CFA
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Sous-total :</span>
          <span className="text-sm font-bold">{totalPrice} CFA</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Link href="/cart">
            <Button variant="outline" className="w-full h-10 text-[10px] font-bold uppercase tracking-widest rounded-none border-black text-black hover:bg-slate-100 dark:border-white dark:text-white dark:hover:bg-slate-900">
              Voir le panier
            </Button>
          </Link>
          <Link href="/checkout">
            <Button className="w-full h-10 text-[10px] font-bold uppercase tracking-widest rounded-none bg-black text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200">
              Commander
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
