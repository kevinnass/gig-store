import Link from 'next/link'
import { SafeImage } from '@/components/shop/SafeImage'
import { QuickAddClient } from '@/components/shop/QuickAddClient'

export function ProductCard({ product }: { product: any }) {
  return (
    <div className="group cursor-pointer flex flex-col gap-4">
      {/* Container d'image avec ratio */}
      <div className="relative aspect-[3/4] bg-slate-100 dark:bg-slate-900 overflow-hidden">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          {Array.isArray(product.gallery) && product.gallery.length > 1 ? (
            <>
              {/* Image Principale */}
              <SafeImage
                src={product.main_image || '/placeholder-shoes.jpg'}
                alt={product.name}
                fill
                unoptimized
                className="object-cover object-center transition-opacity duration-300 group-hover:opacity-0"
              />
              {/* Image Secondaire */}
              <SafeImage
                src={product.gallery[1]}
                alt={`${product.name} vue 2`}
                fill
                unoptimized
                className="object-cover object-center absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:scale-105"
              />
            </>
          ) : (
            <SafeImage
              src={product.main_image || '/placeholder-shoes.jpg'}
              alt={product.name}
              fill
              unoptimized
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
          )}
        </Link>

        {/* Action Buttons (Quick Add) */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
          <QuickAddButton product={product} />
        </div>

        {/* Badges container */}
        <div className="absolute top-3 left-3 right-3 flex flex-col items-start gap-1 pointer-events-none">
          {/* Badge Nouveauté si featured */}
          {product.is_featured && (
            <span className="bg-black text-white text-[10px] font-semibold uppercase tracking-widest px-2 py-1 flex items-center h-5">
              Nouveau
            </span>
          )}

          {/* Badge Stock */}
          {(() => {
            const variants = product.product_variants || []
            const totalStock = variants.reduce((acc: number, v: any) => acc + (v.stock_quantity || 0), 0)
            
            if (totalStock > 0 && totalStock <= 5) {
              return (
                <span className="bg-orange-500 text-white text-[10px] font-semibold uppercase tracking-widest px-2 py-1 shadow-sm flex items-center h-5">
                  Bientôt épuisé
                </span>
              )
            } else if (variants.length > 0 && totalStock <= 0) {
              return (
                <span className="bg-red-600 text-white text-[10px] font-semibold uppercase tracking-widest px-2 py-1 shadow-sm flex items-center h-5">
                  Rupture
                </span>
              )
            }
            return null
          })()}
        </div>
      </div>

      {/* Info Produit */}
      <Link href={`/product/${product.id}`} className="space-y-1">
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{product.categories?.name}</p>
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-sm font-bold uppercase tracking-wider flex-1">{product.name}</h3>
          {(() => {
            const variants = product.product_variants || []
            const totalStock = variants.reduce((acc: number, v: any) => acc + (v.stock_quantity || 0), 0)
            if (variants.length > 0 && totalStock <= 0) {
              return <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider shrink-0 mt-1">Épuisé</span>
            } else if (totalStock > 0 && totalStock <= 5) {
              return <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider shrink-0 mt-1">({totalStock} restants)</span>
            }
            return null
          })()}
        </div>
        <p className="text-sm">{product.price} CFA</p>
      </Link>
    </div>
  )
}

function QuickAddButton({ product }: { product: any }) {
  return <QuickAddClient product={product} />
}
