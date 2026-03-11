import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { SortFilter } from '@/components/shop/SortFilter'

export const metadata = {
  title: 'Catalogue - Gig-store',
  description: 'Découvrez tous nos produits premium.',
}

export default async function ShopPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  const categorySlug = searchParams?.category as string | undefined
  const sort = searchParams?.sort as string | undefined

  const supabase = await createClient()

  // Fetch categories
  const { data: categories } = await supabase.from('categories').select('*').order('name')
  
  // Fetch products
  let query = supabase.from('products').select(`
    *,
    categories!inner ( name, slug )
  `)

  if (categorySlug) {
    query = query.eq('categories.slug', categorySlug)
  }

  if (sort === 'price_asc') {
    query = query.order('price', { ascending: true })
  } else if (sort === 'price_desc') {
    query = query.order('price', { ascending: false })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const { data: products } = await query

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 mt-16 md:mt-24">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase">Le Catalogue</h1>
          <p className="text-muted-foreground mt-2">Découvrez notre collection complète.</p>
        </div>
      </div>

      {/* Categories Filter & sorting */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12 border-b dark:border-slate-800 pb-4">
        <div className="flex overflow-x-auto gap-4 no-scrollbar w-full md:w-auto">
          <Link href={`/shop${sort ? `?sort=${sort}` : ''}`} className={`px-6 py-2 border ${!categorySlug ? 'bg-black text-white dark:bg-white dark:text-black' : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-black dark:hover:border-white'} text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors`}>
            Tout
          </Link>
          {categories?.map((cat) => (
            <Link key={cat.id} href={`/shop?category=${cat.slug}${sort ? `&sort=${sort}` : ''}`} className={`px-6 py-2 border ${categorySlug === cat.slug ? 'bg-black text-white dark:bg-white dark:text-black' : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-black dark:hover:border-white'} text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors`}>
              {cat.name}
            </Link>
          ))}
        </div>
        <SortFilter />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products?.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`} className="group relative border border-transparent hover:border-slate-200 dark:hover:border-slate-800 p-3 transition-colors">
            <div className="aspect-[4/5] relative overflow-hidden bg-slate-100 dark:bg-slate-900 mb-4">
              {product.main_image ? (
                <div 
                  className="w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
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
            <div className="space-y-1">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{product.categories?.name}</p>
              <h3 className="text-sm font-bold uppercase tracking-wider">{product.name}</h3>
              <p className="text-sm">{product.price.toFixed(2)} €</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
