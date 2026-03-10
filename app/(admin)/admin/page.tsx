export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard Admin</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium tracking-tight">Ventes Totales</h3>
            <span className="text-xs text-muted-foreground">+20.1%</span>
          </div>
          <div className="text-2xl font-bold">45.231,89 €</div>
        </div>
        
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium tracking-tight">Commandes</h3>
            <span className="text-xs text-muted-foreground">+180.1%</span>
          </div>
          <div className="text-2xl font-bold">+2350</div>
        </div>
        
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium tracking-tight">Produits</h3>
            <span className="text-xs text-muted-foreground">+12</span>
          </div>
          <div className="text-2xl font-bold">142</div>
        </div>
        
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium tracking-tight">Stock Faible</h3>
            <span className="text-xs text-destructive">8 produits</span>
          </div>
          <div className="text-2xl font-bold">8</div>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-8">
          <div className="col-span-4 rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Aperçu des Ventes</h3>
            <div className="h-[200px] flex items-end space-x-2">
                {[45, 60, 30, 80, 50, 90, 70].map((h, i) => (
                    <div key={i} className="flex-1 bg-primary/20 rounded-t-md hover:bg-primary/40 transition-colors" style={{ height: `${h}%` }}></div>
                ))}
            </div>
          </div>
          <div className="col-span-3 rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Commandes Récentes</h3>
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                        <div>
                            <p className="text-sm font-medium">Invité #ORD-{1200 + i}</p>
                            <p className="text-xs text-muted-foreground">il y a {i}h</p>
                        </div>
                        <div className="text-sm font-semibold">120,00 €</div>
                    </div>
                ))}
            </div>
          </div>
      </div>
    </div>
  )
}
