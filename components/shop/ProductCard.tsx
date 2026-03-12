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

        {/* Badge Nouveauté si featured */}
        {product.is_featured && (
          <span className="absolute top-3 left-3 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 pointer-events-none">
            Nouveau
          </span>
        )}
      </div>

      {/* Info Produit */}
      <Link href={`/product/${product.id}`} className="space-y-1">
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{product.categories?.name}</p>
        <h3 className="text-sm font-bold uppercase tracking-wider">{product.name}</h3>
        <p className="text-sm">{product.price} CFA</p>
      </Link>
    </div>
  )
}

function QuickAddButton({ product }: { product: any }) {
  return <QuickAddClient product={product} />
}
