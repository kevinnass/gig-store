import { createClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/admin/ProductForm'

export const metadata = {
  title: 'Nouveau Produit | Admin Gig-Store',
}

export default async function NewProductPage() {
  const supabase = await createClient()

  // On récupère les catégories existantes pour alimenter le Select du formulaire
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('name', { ascending: true })

  return (
    <div className="p-8">
      <ProductForm categories={categories || []} />
    </div>
  )
}
