'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { sendOrderEmail } from '@/lib/mail'

export type OrderData = {
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: {
    city: string
    street: string
    details?: string
  }
  total_amount: number
  items: {
    variant_id: string
    quantity: number
    price_at_purchase: number
  }[]
}

export async function createOrder(data: OrderData) {
  const supabase = await createClient()

  console.log('Creating order with data:', data)

  // 1. Créer la commande
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_email: data.customer_email,
      total_amount: data.total_amount,
      status: 'paid', // On assume payé si on appelle cette action après succès KKiaPay
      shipping_address: {
        ...data.shipping_address,
        customer_name: data.customer_name,
        customer_phone: data.customer_phone
      }
    })
    .select()
    .single()

  if (orderError) {
    console.error('Error creating order in Supabase:', orderError)
    return { error: orderError.message }
  }
  
  console.log('Order created successfully:', order)

  // 2. Créer les articles de la commande
  const orderItems = data.items.map(item => ({
    order_id: order.id,
    variant_id: item.variant_id,
    quantity: item.quantity,
    price_at_purchase: item.price_at_purchase
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) {
    console.error('Error creating order items:', itemsError)
    // Idéalement on devrait rollback ici, mais Supabase REST ne le permet pas facilement sans RPC
    return { error: itemsError.message }
  }

  // 3. Mettre à jour les stocks (Optionnel pour l'instant, mais recommandé)
  for (const item of data.items) {
    // Note: Dans une app réelle, utilisez une fonction RPC pour décrémenter atomiquement
    const { data: variant } = await supabase
      .from('product_variants')
      .select('stock_quantity')
      .eq('id', item.variant_id)
      .single()

    if (variant) {
      await supabase
        .from('product_variants')
        .update({ stock_quantity: Math.max(0, variant.stock_quantity - item.quantity) })
        .eq('id', item.variant_id)
    }
  }

  // 4. Récupérer les détails pour l'email
  const { data: fullItems } = await supabase
    .from('order_items')
    .select(`
      quantity,
      price_at_purchase,
      product_variants (
        size,
        color,
        products (
          name
        )
      )
    `)
    .eq('order_id', order.id)

  const emailItems = (fullItems || []).map((item: any) => ({
    name: item.product_variants?.products?.name || 'Produit',
    quantity: item.quantity,
    price: item.price_at_purchase,
    variantInfo: [item.product_variants?.size, item.product_variants?.color].filter(Boolean).join(' / ')
  }))

  // 5. Envoyer l'email de confirmation
  try {
    await sendOrderEmail({
      orderId: order.id,
      customerEmail: order.customer_email,
      status: order.status,
      customerName: data.customer_name,
      totalAmount: order.total_amount,
      items: emailItems
    })
  } catch (err) {
    console.error('Failed to send confirmation email:', err)
  }

  revalidatePath('/admin/orders')
  revalidatePath('/admin')
  
  return { success: true, orderId: order.id }
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await createClient()

  // 1. Mettre à jour le statut
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)

  if (error) {
    console.error('Error updating order status:', error)
    return { success: false, error: error.message }
  }

  // 2. Récupérer les infos pour l'email
  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single()

  if (order) {
    const addr = order.shipping_address as any
    
    // Récupérer les articles
    const { data: fullItems } = await supabase
      .from('order_items')
      .select(`
        quantity,
        price_at_purchase,
        product_variants (
          size,
          color,
          products (
            name
          )
        )
      `)
      .eq('order_id', orderId)

    const emailItems = (fullItems || []).map((item: any) => ({
      name: item.product_variants?.products?.name || 'Produit',
      quantity: item.quantity,
      price: item.price_at_purchase,
      variantInfo: [item.product_variants?.size, item.product_variants?.color].filter(Boolean).join(' / ')
    }))

    try {
      await sendOrderEmail({
        orderId: order.id,
        customerEmail: order.customer_email,
        status: order.status,
        customerName: addr?.customer_name || 'Client',
        totalAmount: order.total_amount,
        items: emailItems
      })
    } catch (err) {
      console.error('Failed to send status update email:', err)
    }
  }

  revalidatePath('/admin/orders')
  revalidatePath('/admin')
  
  return { success: true }
}
