'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, ChevronUp, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface OrderItemExpanderProps {
  orderId: string
  items: any[]
}

export function OrderItemExpander({ orderId, items }: OrderItemExpanderProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="h-8 rounded-none border-slate-200 dark:border-slate-700 font-bold uppercase tracking-widest text-[9px] flex items-center gap-1 whitespace-nowrap"
      >
        {items.length} article{items.length > 1 ? 's' : ''}
        {isExpanded ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
      </Button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            key={orderId + '-items'}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-2 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 divide-y divide-slate-100 dark:divide-slate-800">
              {items.map((item: any) => {
                const product = item.product_variants?.products
                const variant = item.product_variants

                return (
                  <div key={item.id} className="flex items-center gap-3 p-3">
                    {/* Image */}
                    {product?.main_image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.main_image}
                        alt={product.name}
                        className="w-10 h-10 object-cover bg-slate-100 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                        <Package className="w-4 h-4 text-slate-400" />
                      </div>
                    )}

                    {/* Info produit */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold uppercase tracking-wide truncate">
                        {product?.name || 'Produit inconnu'}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {[
                          variant?.size && `Taille: ${variant.size}`,
                          variant?.color && `Style: ${variant.color}`,
                          `Qté: ${item.quantity}`
                        ].filter(Boolean).join(' · ')}
                      </p>
                    </div>

                    {/* Prix */}
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold">
                        {(item.price_at_purchase * item.quantity).toLocaleString()} CFA
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-[9px] text-slate-400">{item.price_at_purchase} × {item.quantity}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
