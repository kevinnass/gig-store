import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ProductClient from './ProductClient'

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

  return <ProductClient product={product} />
}
