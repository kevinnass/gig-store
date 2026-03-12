import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ProductClient from './ProductClient'
import { ProductCard } from '@/components/shop/ProductCard'
export async function generateMetadata(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const supabase = await createClient()
  const { data: product } = await supabase.from('products').select('name, description').eq('id', id).single()

  return {
    title: `${product?.name || 'Produit'} - Gig-store`,
    description: product?.description || 'Découvrez ce produit premium.',
  }
}

export default async function ProductPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select(`
      *,
      categories (name),
      product_variants (*)
    `)
    .eq('id', id)
    .single()

  if (!product) {
    notFound()
  }

  // Fetch recommendations
  const { data: recommendations } = await supabase
    .from('products')
    .select(`
      *,
      categories!inner (name),
      product_variants (*)
    `)
    .eq('category_id', product.category_id)
    .neq('id', product.id)
    .gte('price', Math.floor(product.price * 0.8)) // Prix similaire ou supérieur (-20% marge)
    .order('price', { ascending: true })
    .limit(4)

  return (
    <>
      <ProductClient product={product} />

      {recommendations && recommendations.length > 0 && (
        <section className="container mx-auto px-4 py-16 border-t dark:border-slate-800">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tighter uppercase mb-8">
            Vous aimerez aussi
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {recommendations.map((rec: any) => (
              <ProductCard key={rec.id} product={rec} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
