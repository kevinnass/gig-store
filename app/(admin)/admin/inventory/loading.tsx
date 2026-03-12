export default function InventoryLoading() {
  return (
    <div className="p-8 space-y-8">
      {/* En-tête skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <div className="h-9 w-48 bg-muted animate-pulse rounded-lg" />
          <div className="h-4 w-72 bg-muted animate-pulse rounded" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-40 bg-muted animate-pulse rounded-lg" />
          <div className="h-10 w-40 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>

      {/* Barre de recherche skeleton */}
      <div className="flex gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <div className="h-10 w-full max-w-md bg-muted animate-pulse rounded-md" />
        <div className="h-10 w-36 bg-muted animate-pulse rounded-md" />
      </div>

      {/* Tableau skeleton */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-muted/50">
          <div className="grid grid-cols-6 gap-4">
            {['w-16', 'w-32', 'w-24', 'w-20', 'w-16', 'w-16'].map((w, i) => (
              <div key={i} className={`h-4 ${w} bg-muted animate-pulse rounded`} />
            ))}
          </div>
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-4 border-b last:border-0 grid grid-cols-6 gap-4 items-center">
            <div className="w-12 h-16 bg-muted animate-pulse rounded" />
            <div className="h-4 w-full bg-muted animate-pulse rounded" />
            <div className="h-6 w-20 bg-muted animate-pulse rounded-full" />
            <div className="h-4 w-20 bg-muted animate-pulse rounded ml-auto" />
            <div className="h-6 w-16 bg-muted animate-pulse rounded-full mx-auto" />
            <div className="flex gap-2 justify-end">
              <div className="h-8 w-8 bg-muted animate-pulse rounded" />
              <div className="h-8 w-8 bg-muted animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
