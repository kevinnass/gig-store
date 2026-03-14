import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Euro, ShoppingBag, PackageX, Package, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // 1. Récupérer les statistiques des commandes
  const { data: orders } = await supabase
    .from('orders')
    .select('total_amount, created_at, status')

  const totalOrders = orders?.length || 0
  const totalRevenue = orders?.reduce((acc, order) => acc + Number(order.total_amount), 0) || 0

  // 2. Produits en rupture de stock
  const { count: outOfStockCount } = await supabase
    .from('product_variants')
    .select('*', { count: 'exact', head: true })
    .lte('stock_quantity', 0)

  // 3. Total des produits
  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })

  // 4. Commandes récentes (Top 5)
  const { data: recentOrders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white uppercase">Vue d&apos;ensemble</h1>
        <p className="text-muted-foreground mt-2">Bienvenue sur votre espace d&apos;administration Gig-Store.</p>
      </div>
      
      {/* Statistiques (Cards) */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Chiffre d'affaires */}
        <Card className="border-none shadow-sm bg-black text-white dark:bg-white dark:text-black">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Chiffre d&apos;affaires</CardTitle>
            <TrendingUp className="h-4 w-4 opacity-40" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tighter">
              {totalRevenue.toLocaleString()} <span className="text-xs opacity-40 font-bold ml-1">CFA</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Commandes */}
        <Card className="border-none shadow-sm bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Commandes Totales</CardTitle>
            <ShoppingBag className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tighter">+{totalOrders}</div>
          </CardContent>
        </Card>
        
        {/* Total Produits */}
        <Card className="border-none shadow-sm bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Produits en base</CardTitle>
            <Package className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tighter">{totalProducts || 0}</div>
          </CardContent>
        </Card>
        
        {/* Alerte Rupture de Stock */}
        <Card className={`border-none shadow-sm ${outOfStockCount && outOfStockCount > 0 ? "bg-red-50 dark:bg-red-950/20" : "bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800"}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Ruptures de stock</CardTitle>
            <PackageX className={`h-4 w-4 ${outOfStockCount && outOfStockCount > 0 ? "text-red-500" : "text-slate-400"}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-black tracking-tighter ${outOfStockCount && outOfStockCount > 0 ? "text-red-600" : ""}`}>
              {outOfStockCount || 0}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tableaux (Section inférieure) */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-8">
          <div className="col-span-4 rounded-xl border bg-white dark:bg-black/20 p-8 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 border-b pb-4">Commandes Récentes</h3>
            
            {recentOrders && recentOrders.length > 0 ? (
              <div className="space-y-6">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center font-bold text-[10px] text-slate-400 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all">
                        {order.id.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-bold leading-tight uppercase">{order.customer_email}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {format(new Date(order.created_at), 'dd MMMM yyyy', { locale: fr })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black tracking-tighter">{order.total_amount.toLocaleString()} CFA</p>
                      <Badge variant="outline" className="text-[8px] font-bold uppercase tracking-widest mt-1 opacity-60">
                        {order.status === 'paid' ? 'Payé' : order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
                <ShoppingBag className="w-10 h-10 text-slate-200" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Aucune commande pour le moment.</p>
              </div>
            )}
          </div>

          <div className="col-span-3 rounded-xl border bg-white dark:bg-black/20 p-8 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 border-b pb-4">Actions Rapides</h3>
            <div className="space-y-4">
              <a href="/admin/inventory/new" className="block p-4 border border-dashed border-slate-200 hover:border-black dark:border-slate-800 dark:hover:border-white transition-all group">
                <p className="text-[10px] font-bold uppercase tracking-widest">Ajouter un produit</p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase">Mettre à jour l&apos;inventaire</p>
              </a>
              <a href="/admin/orders" className="block p-4 border border-dashed border-slate-200 hover:border-black dark:border-slate-800 dark:hover:border-white transition-all group">
                <p className="text-[10px] font-bold uppercase tracking-widest">Gérer les commandes</p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase">Suivi des livraisons</p>
              </a>
            </div>
          </div>
      </div>
    </div>
  )
}
