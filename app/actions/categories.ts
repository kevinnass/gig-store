'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addCategory(name: string, imageUrl?: string | null) {
  if (!name) {
    return { error: 'Le nom de la catégorie est requis' }
  }

  const supabase = await createClient()

  // Création du slug à partir du nom
  const slug = name.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^\w-]+/g, '')

  const { error } = await supabase
    .from('categories')
    .insert([{ 
      name, 
      slug,
      image_url: imageUrl || null
    }])

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/inventory')
  revalidatePath('/')
  return { success: true }
}

export async function updateCategory(id: string, name: string, imageUrl?: string | null) {
  if (!name) {
    return { error: 'Le nom de la catégorie est requis' }
  }

  const supabase = await createClient()

  const slug = name.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^\w-]+/g, '')

  const { error } = await supabase
    .from('categories')
    .update({ 
      name, 
      slug,
      image_url: imageUrl || null
    })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/inventory')
  revalidatePath('/')
  return { success: true }
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()

  const { count } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', id)

  if (count && count > 0) {
    return { error: 'Impossible de supprimer cette catégorie car des produits y sont rattachés.' }
  }

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/inventory')
  revalidatePath('/')
  return { success: true }
}
