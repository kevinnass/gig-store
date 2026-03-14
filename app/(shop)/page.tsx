import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronDown, Sparkles, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/shop/ProductCard'

export default async function HomePage() {
  const supabase = await createClient()
  
  // Récupérer les catégories avec le compte des produits
  // Note: On utilise une sélection spécifique pour contourner les limitations de count dans certains cas
  const { data: categories } = await supabase
    .from('categories')
    .select(`
      *,
      products:products(count)
    `)
    .order('name')

  // Récupérer les 8 derniers produits ajoutés
  const { data: recentProducts } = await supabase
    .from('products')
    .select(`
      *,
      categories (name)
    `)
    .order('created_at', { ascending: false })
    .limit(8)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[95vh] flex items-center justify-center overflow-hidden bg-slate-100 dark:bg-slate-900">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30 z-10" />
          <div className="w-full h-full bg-slate-900 bg-[url('/hero-image.png')] bg-cover bg-center" />
        </div>
        
        <div className="container mx-auto px-4 relative z-20 text-center md:text-left space-y-8">
          <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold tracking-tighter uppercase leading-[0.9] text-white">
            Gig-store <br className="hidden md:block" />
            <span className="text-slate-300 italic font-light">Qualité & Niche.</span>
          </h1>
          <p className="max-w-xl text-lg md:text-xl text-slate-200 font-light mx-auto md:mx-0">
            Bienvenue dans votre boutique de produits de niche et de qualité.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-4">
            <Link href="/shop">
              <Button size="lg" className="px-10 h-14 text-sm font-bold uppercase tracking-[0.2em] rounded-none bg-white text-black hover:bg-slate-200 transition-colors">
                Découvrir la boutique
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center animate-bounce text-white/70">
          <ChevronDown className="w-8 h-8" />
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-slate-500 mb-3">Parcourir</h2>
            <p className="text-3xl md:text-5xl font-bold tracking-tighter uppercase">Nos Catégories</p>
          </div>
          <Link href="/shop" className="text-sm font-bold uppercase tracking-widest border-b-[1.5px] border-slate-900 dark:border-white pb-1 hover:text-slate-500 hover:border-slate-500 transition-all">
            Voir tout
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories?.map((cat: any) => {
            const productCount = cat.products?.[0]?.count || 0
            return (
              <Link key={cat.id} href={`/shop?category=${cat.slug}`} className="group relative aspect-[4/5] overflow-hidden bg-slate-900">
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-500 z-10" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 z-20">
                    <span className="text-[10px] font-bold text-white/60 mb-1 uppercase tracking-[0.2em] transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      {productCount} Produit{productCount > 1 ? 's' : ''}
                    </span>
                    <h3 className="text-xl font-bold text-white uppercase tracking-tighter transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      <span className="mr-2 text-slate-400 font-light">({productCount})</span>
                      {cat.name}
                    </h3>
                    <div className="w-8 h-0.5 bg-white mt-4 opacity-0 group-hover:opacity-100 transform origin-left scale-x-0 group-hover:scale-x-100 transition-all duration-500 delay-100" />
                </div>
                {cat.image_url ? (
                  <div 
                      className="w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-90" 
                      style={{ backgroundImage: `url('${cat.image_url}')` }} 
                  />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center opacity-50">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">{cat.name}</span>
                  </div>
                )}
              </Link>
            )
          })}
          {(!categories || categories.length === 0) && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              Aucune catégorie trouvée.
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-slate-500 mb-3 flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                Nouveautés
              </h2>
              <p className="text-3xl md:text-5xl font-bold tracking-tighter uppercase">Nos Nouveautés</p>
            </div>
            <Link href="/shop?sort=newest" className="text-sm font-bold uppercase tracking-widest border-b-[1.5px] border-slate-900 dark:border-white pb-1 hover:text-slate-500 hover:border-slate-500 transition-all">
              Découvrir tout
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {recentProducts?.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
            {(!recentProducts || recentProducts.length === 0) && (
              <div className="col-span-full py-12 text-center text-muted-foreground bg-white dark:bg-slate-800 rounded-xl border border-dashed">
                Bientôt de nouveaux produits...
              </div>
            )}
          </div>

          <div className="mt-16 text-center">
            <Link href="/shop">
              <Button size="lg" className="px-12 h-14 text-sm font-bold uppercase tracking-[0.2em] rounded-none hover:bg-slate-800 transition-all group">
                Découvrir tous les produits
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
