import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AccountClient } from './AccountClient'

export const metadata = {
  title: 'Mon Compte - Gig-store',
  description: 'Gérez vos informations et consultez vos commandes.',
}

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch Profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch Orders with nested items
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        quantity,
        price_at_purchase,
        product_variants (
          id,
          size,
          color,
          products (
            name,
            main_image
          )
        )
      )
    `)
    .eq('customer_email', user.email)
    .order('created_at', { ascending: false })

  return <AccountClient profile={profile} orders={orders || []} user={user} />
}
