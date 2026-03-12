export default function AdminLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center p-16">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-4 border-muted" />
          <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
        <p className="text-sm text-muted-foreground animate-pulse">Chargement...</p>
      </div>
    </div>
  )
}
