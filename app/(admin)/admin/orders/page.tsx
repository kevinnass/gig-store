import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { OrderStatusSelector } from '@/components/admin/OrderStatusSelector'
import { OrderItemExpander } from '@/components/admin/OrderItemExpander'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { OrderSearch } from '@/components/admin/OrderSearch'
import { OrderFilters } from '@/components/admin/OrderFilters'
import { Suspense } from 'react'

export const metadata = {
  title: 'Commandes - Administration',
}

export default async function OrdersPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  const search = searchParams?.search as string | undefined
  const statusFilter = searchParams?.status as string | undefined

  const supabase = await createClient()
  
  let query = supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        quantity,
        price_at_purchase,
        product_variants (
          size,
          color,
          products (
            name,
            main_image
          )
        )
      )
    `)
    .order('created_at', { ascending: false })

  if (search) {
    // On cherche dans l'email ou le nom du client (stocké dans JSONB shipping_address)
    query = query.or(`customer_email.ilike.%${search}%,shipping_address->>customer_name.ilike.%${search}%`)
  }

  if (statusFilter) {
    query = query.eq('status', statusFilter)
  }
  
  const { data: orders, error } = await query

  if (error) {
    return <div className="p-8 text-red-500">Erreur lors de la récupération des commandes : {error.message}</div>
  }

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'paid':
      case 'shipped':
      case 'delivered':
        return <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900">Payé</Badge>
      case 'pending': 
        return <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/30">En attente</Badge>
      case 'cancelled': 
        return <Badge variant="destructive">Annulé</Badge>
      default: 
        return <Badge variant="outline">Inconnu</Badge>
    }
  }

  return (
    <div className="p-8 space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Commandes</h1>
          <p className="text-muted-foreground mt-1">
            {orders?.length ?? 0} commande{(orders?.length ?? 0) > 1 ? 's' : ''} trouvée{(orders?.length ?? 0) > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Barre d'outils (Recherche + Filtres) */}
      <div className="flex flex-col sm:flex-row gap-3 bg-card p-4 rounded-xl border shadow-sm">
        <Suspense fallback={<div className="h-9 w-full max-w-sm bg-muted animate-pulse rounded-md" />}>
          <OrderSearch />
        </Suspense>
        <div className="flex-1 flex justify-start sm:justify-end">
          <Suspense fallback={<div className="h-9 w-40 bg-muted animate-pulse rounded-md" />}>
            <OrderFilters />
          </Suspense>
        </div>
      </div>

      {/* Tableau des commandes */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[120px]">ID / Date</TableHead>
              <TableHead>Client & Contact</TableHead>
              <TableHead>Adresse</TableHead>
              <TableHead>Produits</TableHead>
              <TableHead className="text-right">Montant</TableHead>
              <TableHead className="text-center">Paiement</TableHead>
              <TableHead className="text-center">Statut Livraison</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders && orders.length > 0 ? (
              orders.map((order) => {
                const addr = order.shipping_address as any
                return (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-mono text-[10px] text-slate-400">#{order.id.slice(0, 8)}</span>
                        <span className="text-xs mt-1">
                          {format(new Date(order.created_at), 'dd MMM yyyy', { locale: fr })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-sm">
                        <span className="font-bold">{addr?.customer_name || order.customer_email}</span>
                        <span className="text-xs text-muted-foreground font-mono">{order.customer_email}</span>
                        <span className="text-xs text-muted-foreground font-mono">{addr?.customer_phone}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px] text-xs space-y-1">
                        <p className="font-bold uppercase tracking-wider text-[9px]">{addr?.city}</p>
                        <p className="line-clamp-2 text-muted-foreground">{addr?.street}</p>
                        {addr?.details && <p className="text-[10px] italic text-slate-400">{addr.details}</p>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <OrderItemExpander
                        orderId={order.id}
                        items={(order as any).order_items || []}
                      />
                    </TableCell>
                    <TableCell className="text-right font-black">
                      {order.total_amount.toLocaleString()} <span className="text-[10px] opacity-40">CFA</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">{getPaymentBadge(order.status)}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <OrderStatusSelector orderId={order.id} currentStatus={order.status} />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-40 text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-3xl">📝</span>
                    <p className="font-medium">Aucune commande trouvée</p>
                    <p className="text-sm">Essayez de modifier vos filtres ou votre recherche.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
