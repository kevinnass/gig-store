'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface ProductPayload {
  name: string
  description?: string | null
  price: number
  category_id: string
  is_featured: boolean
  main_image?: string | null
  variants: {
    size: string
    color: string
    stock_quantity: number
  }[]
}

export async function createProduct(data: ProductPayload) {
  const supabase = await createClient()

  const { variants, ...productData } = data

  // 1. Insertion du produit principal
  const { data: newProduct, error: productError } = await supabase
    .from('products')
    .insert([{
      ...productData,
      // Génération d'un slug basique
      slug: productData.name.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^\w-]+/g, ''),
      main_image: productData.main_image || null
    }])
    .select('id')
    .single()

  if (productError) {
    return { error: 'Erreur lors de la création du produit: ' + productError.message }
  }

  // 2. Préparation et insertion des variantes
  if (variants && variants.length > 0) {
    const variantsToInsert = variants.map((v) => ({
      product_id: newProduct.id,
      size: v.size,
      color: v.color,
      stock_quantity: v.stock_quantity
    }))

    const { error: variantError } = await supabase
      .from('product_variants')
      .insert(variantsToInsert)

    if (variantError) {
      // Idéalement on supprimerait le produit créé si les variantes plantent
      return { error: 'Erreur lors de la création des variantes: ' + variantError.message }
    }
  }

  revalidatePath('/admin/inventory')
  revalidatePath('/shop')
  
  return { success: true }
}

export async function updateProduct(id: string, data: ProductPayload) {
  const supabase = await createClient()

  const { variants, ...productData } = data

  // 1. Mise à jour du produit principal
  const { error: productError } = await supabase
    .from('products')
    .update({
      ...productData,
      slug: productData.name.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^\w-]+/g, ''),
      main_image: productData.main_image || null
    })
    .eq('id', id)

  if (productError) {
    return { error: 'Erreur lors de la mise à jour: ' + productError.message }
  }

  // 2. Mise à jour des variantes (on simplifie en supprimant tout et en recréant)
  // Une approche plus fine comparerait les IDs, mais ici on repart de zéro pour éviter les désynchronisations de stock complexes dans l'UI.
  await supabase.from('product_variants').delete().eq('product_id', id)

  if (variants && variants.length > 0) {
    const variantsToInsert = variants.map((v) => ({
      product_id: id,
      size: v.size,
      color: v.color,
      stock_quantity: v.stock_quantity
    }))

    const { error: variantError } = await supabase
      .from('product_variants')
      .insert(variantsToInsert)

    if (variantError) {
      return { error: 'Erreur lors de la mise à jour des variantes: ' + variantError.message }
    }
  }

  revalidatePath('/admin/inventory')
  revalidatePath('/shop')
  
  return { success: true }
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()

  // Note: Si une contrainte ON DELETE CASCADE est définie dans la db, 
  // les variantes seront supprimées automatiquement. Sinon il faut les supprimer d'abord.
  const { error: variantError } = await supabase
    .from('product_variants')
    .delete()
    .eq('product_id', id)

  if (variantError) {
    return { error: "Impossible de supprimer les variantes liées: " + variantError.message }
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/inventory')
  revalidatePath('/shop')
  return { success: true }
}
