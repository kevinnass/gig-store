'use client'

import { useState } from 'react'
import { useCart } from '@/store/cart'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function ProductClient({ product }: { product: any }) {
  const addItem = useCart((state) => state.addItem)
  
  // Extract unique colors and sizes from variants
  const variants = product.product_variants || []
  const availableColors = Array.from(new Set(variants.map((v: any) => v.color).filter(Boolean))) as string[]
  const availableSizes = Array.from(new Set(variants.map((v: any) => v.size).filter(Boolean))) as string[]

  const [selectedColor, setSelectedColor] = useState<string>(availableColors[0] || '')
  const [selectedSize, setSelectedSize] = useState<string>(availableSizes[0] || '')

  // Find the exact variant based on selection
  const selectedVariant = variants.find((v: any) => 
    (availableColors.length === 0 || v.color === selectedColor) &&
    (availableSizes.length === 0 || v.size === selectedSize)
  )

  const isOutOfStock = selectedVariant ? selectedVariant.stock_quantity <= 0 : true

  const handleAddToCart = () => {
    if (!selectedVariant || isOutOfStock) return
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.main_image,
      quantity: 1,
      variant_id: selectedVariant.id,
      size: selectedSize,
      color: selectedColor
    })
    // Alert temporaire simple (un Toast UI serait mieux)
    alert('Produit ajouté au panier !')
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 mt-16 md:mt-24">
      {/* Back Button */}
      <Link href="/shop" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-black dark:hover:text-white transition-colors mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour au catalogue
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-[4/5] relative bg-slate-100 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            {product.main_image ? (
              <div 
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url('${product.main_image}')` }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">Sans image</div>
            )}
            {product.is_featured && (
              <div className="absolute top-4 left-4 bg-white text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1">
                Nouveau
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center space-y-8">
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              {product.categories?.name}
            </p>
            <h1 className="text-3xl lg:text-5xl font-bold tracking-tighter uppercase">{product.name}</h1>
            <p className="text-xl font-medium pt-2">{product.price.toFixed(2)} €</p>
          </div>

          {product.description && (
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
              {product.description}
            </p>
          )}

          <div className="space-y-6 pt-4 border-t dark:border-slate-800">
            {/* Colors */}
            {availableColors.length > 0 && availableColors[0] !== '' && (
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Couleur</span>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border text-[10px] font-bold uppercase tracking-widest transition-colors ${
                        selectedColor === color 
                          ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black' 
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-black dark:hover:border-white'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {availableSizes.length > 0 && availableSizes[0] !== '' && (
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Taille</span>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border text-[10px] font-bold uppercase tracking-widest transition-colors ${
                        selectedSize === size 
                          ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black' 
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-black dark:hover:border-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pt-6 space-y-4">
            <Button 
              onClick={handleAddToCart}
              disabled={!selectedVariant || isOutOfStock}
              className="w-full h-14 rounded-none font-bold uppercase tracking-[0.2em] text-xs bg-black text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200"
            >
              {!selectedVariant 
                ? 'Indisponible dans cette combinaison' 
                : isOutOfStock 
                ? 'Rupture de stock' 
                : 'Ajouter au panier'}
            </Button>
            
            {selectedVariant && !isOutOfStock && selectedVariant.stock_quantity <= 5 && (
              <p className="text-[10px] text-orange-500 font-bold uppercase tracking-widest text-center">
                Plus que {selectedVariant.stock_quantity} en stock !
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
