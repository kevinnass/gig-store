import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { SortFilter } from '@/components/shop/SortFilter'
import SearchResultsText from '@/components/shop/SearchResultsText'
import { ProductCard } from '@/components/shop/ProductCard'

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
  const searchQuery = searchParams?.search as string | undefined
  const page = Number(searchParams?.page) || 1
  const ITEMS_PER_PAGE = 8
  const offset = (page - 1) * ITEMS_PER_PAGE

  const supabase = await createClient()

  // Fetch categories
  const { data: categories } = await supabase.from('categories').select('*').order('name')
  
  // Fetch products
  let query = supabase.from('products').select(`
    *,
    categories!inner ( name, slug ),
    product_variants ( id, stock_quantity, color, size )
  `, { count: 'exact' })

  if (categorySlug) {
    query = query.eq('categories.slug', categorySlug)
  }

  if (searchQuery) {
    query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
  }

  if (sort === 'price_asc') {
    query = query.order('price', { ascending: true })
  } else if (sort === 'price_desc') {
    query = query.order('price', { ascending: false })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const { data: products, count } = await query
    .range(offset, offset + ITEMS_PER_PAGE - 1)

  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE)

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 mt-16 md:mt-24">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase">Le Catalogue</h1>
          <p className="text-muted-foreground mt-2">Découvrez nos produits et nos catégories.</p>
        </div>
      </div>

      {/* Categories Filter & sorting */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12 border-b dark:border-slate-800 pb-4">
        <div className="flex overflow-x-auto gap-3 no-scrollbar w-full md:w-auto py-1">
          <Link 
            href={`/shop${sort ? `?sort=${sort}` : ''}${searchQuery ? `${sort ? '&' : '?'}search=${searchQuery}` : ''}`} 
            className={`px-8 py-2.5 rounded-full border transition-all duration-300 text-[11px] font-bold uppercase tracking-[0.15em] whitespace-nowrap ${
              !categorySlug 
                ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-lg shadow-black/10' 
                : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white'
            }`}
          >
            Tout
          </Link>
          {categories?.map((cat) => (
            <Link 
              key={cat.id} 
              href={`/shop?category=${cat.slug}${sort ? `&sort=${sort}` : ''}${searchQuery ? `&search=${searchQuery}` : ''}`} 
              className={`px-8 py-2.5 rounded-full border transition-all duration-300 text-[11px] font-bold uppercase tracking-[0.15em] whitespace-nowrap ${
                categorySlug === cat.slug 
                  ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-lg shadow-black/10' 
                  : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
        <Suspense fallback={<div className="h-10 w-32" />}>
          <SortFilter />
        </Suspense>
      </div>

      {searchQuery && (
        <SearchResultsText query={searchQuery} />
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 border-t dark:border-slate-800 pt-12">
          {page > 1 && (
            <Link 
              href={`/shop?${new URLSearchParams({
                ...(categorySlug && { category: categorySlug }),
                ...(sort && { sort }),
                ...(searchQuery && { search: searchQuery }),
                page: (page - 1).toString()
              }).toString()}`}
              className="px-6 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
            >
              Précédent
            </Link>
          )}
          
          <div className="flex items-center gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <Link
                key={i}
                href={`/shop?${new URLSearchParams({
                  ...(categorySlug && { category: categorySlug }),
                  ...(sort && { sort }),
                  ...(searchQuery && { search: searchQuery }),
                  page: (i + 1).toString()
                }).toString()}`}
                className={`w-10 h-10 flex items-center justify-center text-[10px] font-bold border transition-all ${
                  page === i + 1 
                    ? 'bg-black text-white border-black dark:bg-white dark:text-black' 
                    : 'border-transparent text-slate-400 hover:border-slate-200 dark:hover:border-slate-800'
                }`}
              >
                {i + 1}
              </Link>
            ))}
          </div>

          {page < totalPages && (
            <Link 
              href={`/shop?${new URLSearchParams({
                ...(categorySlug && { category: categorySlug }),
                ...(sort && { sort }),
                ...(searchQuery && { search: searchQuery }),
                page: (page + 1).toString()
              }).toString()}`}
              className="px-6 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
            >
              Suivant
            </Link>
          )}
        </div>
      )}
    </div>
  )
}



