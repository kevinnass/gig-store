import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ProductForm } from '@/components/admin/ProductForm'

export const metadata = {
  title: 'Modifier le produit | Admin Gig-Store',
}

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // 1. Récupérer le produit et ses variantes
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      product_variants (*)
    `)
    .eq('id', id)
    .single()

  if (error || !product) {
    notFound()
  }

  // 2. Récupérer toutes les catégories pour le sélecteur
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('name', { ascending: true })

  // 3. Adapter les données pour le formulaire initialData
  const initialData = {
    name: product.name,
    description: product.description,
    price: product.price,
    category_id: product.category_id,
    is_featured: product.is_featured,
    main_image: product.main_image || '',
    variants: product.product_variants.map((v: { size: string, color: string, stock_quantity: number }) => ({
      size: v.size,
      color: v.color,
      stock_quantity: v.stock_quantity
    }))
  }

  return (
    <div className="p-8">
      <ProductForm 
        categories={categories || []} 
        productId={id}
        initialData={initialData}
      />
    </div>
  )
}
