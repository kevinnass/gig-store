'use client'

import { useState } from 'react'
import { useCart } from '@/store/cart'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Minus, Plus, Maximize, X } from 'lucide-react'
import { useToastStore } from '@/store/toast'
import { SafeImage } from '@/components/shop/SafeImage'

export default function ProductClient({ product }: { product: any }) {
  const addItem = useCart((state) => state.addItem)
  const showToast = useToastStore((state) => state.showToast)
  
  // Extract unique colors and sizes from variants
  const variants = product.product_variants || []
  const availableColors = Array.from(new Set(variants.map((v: any) => v.color).filter(Boolean))) as string[]
  const availableSizes = Array.from(new Set(variants.map((v: any) => v.size).filter(Boolean))) as string[]

  const [selectedColor, setSelectedColor] = useState<string>(availableColors[0] || '')
  const [selectedSize, setSelectedSize] = useState<string>(availableSizes[0] || '')
  const [quantity, setQuantity] = useState<number>(1)

  const allImages = Array.isArray(product.gallery) && product.gallery.length > 0 
    ? Array.from(new Set([product.main_image, ...product.gallery].filter(Boolean))) as string[]
    : [product.main_image].filter(Boolean) as string[]

  const [activeImage, setActiveImage] = useState<string>(allImages[0] || '')
  const [isFullscreen, setIsFullscreen] = useState(false)

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
      quantity: quantity,
      variant_id: selectedVariant.id,
      size: selectedSize,
      color: selectedColor
    })
    showToast('Produit ajouté au panier')
  }

  const incrementQuantity = () => {
    if (selectedVariant && quantity < selectedVariant.stock_quantity) {
      setQuantity(q => q + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1)
    }
  }

  return (
    <>
      {/* Fullscreen Image Modal */}
      {isFullscreen && activeImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="fixed top-4 right-4 text-white hover:bg-white/20 rounded-full z-[110]"
            onClick={() => setIsFullscreen(false)}
          >
            <X className="w-8 h-8" />
          </Button>
          <div className="relative w-full h-full max-w-5xl max-h-[90vh]">
            <SafeImage
              src={activeImage}
              alt={product.name}
              fill
              unoptimized
              className="object-contain"
            />
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-20">
      {/* Back Button */}
      <Link href="/shop" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-black dark:hover:text-white transition-colors mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour au catalogue
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        {/* Images Component */}
        <div className="flex flex-col-reverse lg:flex-row gap-4 lg:gap-6 min-h-[500px]">
          {/* Thumbnails (Left on Desktop, Bottom on Mobile) */}
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto no-scrollbar lg:w-24 shrink-0 px-1 py-1">
              {allImages.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-24 lg:w-full lg:aspect-[4/5] lg:h-auto shrink-0 border-2 transition-all duration-300 ${activeImage === img ? 'border-slate-900 dark:border-white ring-2 ring-slate-100 dark:ring-slate-800' : 'border-transparent hover:border-slate-300 dark:hover:border-slate-700'}`}
                >
                  <SafeImage src={img} alt={`${product.name} thumbnail ${idx + 1}`} fill unoptimized className="object-cover" />
                </button>
              ))}
            </div>
          
          {/* Main Selected Image */}
          <div className="relative aspect-[4/5] w-full bg-slate-100 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 group overflow-hidden">
            {activeImage ? (
              <SafeImage 
                src={activeImage}
                alt={product.name}
                fill
                unoptimized
                className="object-cover object-center w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">Sans image</div>
            )}
            
            {/* Fullscreen Button overlays */}
            <Button
              variant="secondary"
              size="icon"
              className="absolute bottom-4 right-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-md bg-white/90 hover:bg-white text-black"
              onClick={() => setIsFullscreen(true)}
            >
              <Maximize className="w-4 h-4" />
            </Button>

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
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="text-3xl lg:text-5xl font-bold tracking-tighter uppercase flex-1">{product.name}</h1>
              {isOutOfStock && (
                <span className="inline-flex items-center px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-bold uppercase tracking-widest self-start sm:self-center">
                  Rupture de stock
                </span>
              )}
              {!isOutOfStock && selectedVariant && selectedVariant.stock_quantity <= 5 && (
                <span className="inline-flex items-center px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-[10px] font-bold uppercase tracking-widest self-start sm:self-center">
                  Stock Faible ({selectedVariant.stock_quantity})
                </span>
              )}
            </div>
            <p className="text-xl font-medium pt-2">{product.price} CFA</p>
          </div>

          {product.description && (
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
              {product.description}
            </p>
          )}

          <div className="space-y-8 pt-6 border-t dark:border-slate-800">
            {/* Colors */}
            {availableColors.length > 0 && availableColors[0] !== '' && (
              <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Couleurs disponibles</span>
                <div className="flex flex-wrap gap-3">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-5 py-2.5 border text-[10px] font-bold uppercase tracking-widest transition-all ${
                        selectedColor === color 
                          ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black shadow-sm' 
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white'
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
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Sélectionner une taille</span>
                  <button className="text-[10px] font-medium text-slate-400 hover:text-black dark:hover:text-white underline underline-offset-4">Guide des tailles</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-14 h-14 border flex items-center justify-center text-xs font-bold uppercase transition-all ${
                        selectedSize === size 
                          ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black shadow-sm' 
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quantity */}
            <div className="space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Quantité</span>
              <div className="flex items-center w-32 h-12 border border-slate-200 dark:border-slate-800">
                <button 
                  onClick={decrementQuantity}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="w-10 h-full flex items-center justify-center text-slate-500 hover:text-black dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors disabled:opacity-50"
                  aria-label="Diminuer la quantité"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="flex-1 flex items-center justify-center text-sm font-bold">
                  {quantity}
                </div>
                <button 
                  onClick={incrementQuantity}
                  disabled={isOutOfStock || (selectedVariant && quantity >= selectedVariant.stock_quantity)}
                  className="w-10 h-full flex items-center justify-center text-slate-500 hover:text-black dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors disabled:opacity-50"
                  aria-label="Augmenter la quantité"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 space-y-4">
            <Button 
              onClick={handleAddToCart}
              disabled={!selectedVariant || isOutOfStock}
              className="w-full h-16 rounded-none font-bold uppercase tracking-[0.2em] text-xs bg-black text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200 transition-all shadow-md"
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
    </>
  )
}
