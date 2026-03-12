import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Euro, ShoppingBag, PackageX, Package } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // 1. Récupérer le nombre de commandes et le total (simulation en attendant la table orders)
  // TODO: Remplacer par la vraie table orders quand elle existera
  const totalOrders = 0
  const totalRevenue = 0

  // 2. Produits en rupture de stock
  const { count: outOfStockCount } = await supabase
    .from('product_variants')
    .select('*', { count: 'exact', head: true })
    .lte('stock_quantity', 0)

  // 3. Total des produits
  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })


  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vue d'ensemble</h1>
        <p className="text-muted-foreground mt-2">Bienvenue sur votre espace d'administration Gig-Store.</p>
      </div>
      
      {/* Statistiques (Cards) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Chiffre d'affaires */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chiffre d'affaires</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue.toFixed(2)} CFA</div>
            <p className="text-xs text-muted-foreground">sur toutes les commandes</p>
          </CardContent>
        </Card>
        
        {/* Commandes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commandes Totales</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalOrders}</div>
            <p className="text-xs text-muted-foreground">commandes enregistrées</p>
          </CardContent>
        </Card>
        
        {/* Total Produits */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produits en base</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts || 0}</div>
            <p className="text-xs text-muted-foreground">modèles de produits</p>
          </CardContent>
        </Card>
        
        {/* Alerte Rupture de Stock */}
        <Card className={outOfStockCount && outOfStockCount > 0 ? "border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ruptures de stock</CardTitle>
            <PackageX className={`h-4 w-4 ${outOfStockCount && outOfStockCount > 0 ? "text-red-500" : "text-muted-foreground"}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${outOfStockCount && outOfStockCount > 0 ? "text-red-600 dark:text-red-400" : ""}`}>
              {outOfStockCount || 0}
            </div>
            <p className="text-xs text-muted-foreground">variantes épuisées</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Tableaux (Section inférieure) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-8">
          <div className="col-span-4 rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Commandes Récentes</h3>
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
              <ShoppingBag className="w-10 h-10 text-slate-300" />
              <p className="text-sm text-slate-500">Aucune commande pour le moment.</p>
              <p className="text-xs text-slate-400">Vos futures ventes apparaîtront ici.</p>
            </div>
          </div>

          <div className="col-span-3 rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Actions Rapides</h3>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                 <p className="text-sm text-muted-foreground">Gérez votre catalogue rapidement depuis ces raccourcis.</p>
                 {/* À venir : liens vers ajout produit */}
              </div>
            </div>
          </div>
      </div>
    </div>
  )
}
