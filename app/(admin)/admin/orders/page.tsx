import { createClient } from '@/lib/supabase/server'
import { Search, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export const metadata = {
  title: 'Commandes - Administration',
}

export default async function OrdersPage() {
  // const supabase = await createClient() // Uncomment quand la table orders existera

  // TODO: Remplacer par un vrai fetch quand la table `orders` existera.
  // Pour le moment on mocke les données pour avoir le rendu visuel.
  const mockOrders = [
    { id: 'ORD-7392', customer: 'jean.dupont@email.com', date: '12 Mars 2026', total: 154.00, payment: 'success', status: 'processing' },
    { id: 'ORD-7391', customer: 'marie.curie@email.com', date: '11 Mars 2026', total: 89.50, payment: 'success', status: 'shipped' },
    { id: 'ORD-7390', customer: 'alan.turing@email.com', date: '11 Mars 2026', total: 299.99, payment: 'pending', status: 'pending' },
    { id: 'ORD-7389', customer: 'ada.lovelace@email.com', date: '10 Mars 2026', total: 45.00, payment: 'failed', status: 'cancelled' },
    { id: 'ORD-7388', customer: 'grace.hopper@email.com', date: '09 Mars 2026', total: 120.00, payment: 'success', status: 'delivered' },
  ]

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'success': return <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900">Payé</Badge>
      case 'pending': return <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/30">En attente</Badge>
      case 'failed': return <Badge variant="destructive">Échec</Badge>
      default: return <Badge variant="outline">Inconnu</Badge>
    }
  }

  const getDeliveryBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="secondary">En attente</Badge>
      case 'processing': return <Badge variant="outline" className="border-blue-200 text-blue-600 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30">En préparation</Badge>
      case 'shipped': return <Badge variant="outline" className="border-indigo-200 text-indigo-600 bg-indigo-50 dark:border-indigo-900 dark:bg-indigo-950/30">Expédié</Badge>
      case 'delivered': return <Badge variant="outline" className="border-emerald-200 text-emerald-600 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30">Livré</Badge>
      case 'cancelled': return <Badge variant="secondary" className="bg-slate-100 text-slate-500">Annulé</Badge>
      default: return <Badge variant="outline">Inconnu</Badge>
    }
  }

  return (
    <div className="p-8 space-y-8">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Commandes</h1>
          <p className="text-muted-foreground mt-2">Suivez et gérez l&apos;expédition de vos ventes.</p>
        </div>
      </div>

      {/* Barre d'outils */}
      <div className="flex items-center gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher une commande (ID, Email)..." 
            className="pl-9 bg-background"
          />
        </div>
        <div className="flex gap-2">
          {/* Placeholders pour filtres Paiement / Statut */}
          <Button variant="outline" size="sm" className="hidden sm:flex">Filtrer</Button>
        </div>
      </div>

      {/* Tableau des commandes */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[120px]">ID Commande</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Montant</TableHead>
              <TableHead className="text-center">Paiement</TableHead>
              <TableHead className="text-center">Livraison</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell className="text-muted-foreground">{order.date}</TableCell>
                <TableCell className="text-right font-medium">{order.total.toFixed(2)} CFA</TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">{getPaymentBadge(order.payment)}</div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">{getDeliveryBadge(order.status)}</div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                      <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
