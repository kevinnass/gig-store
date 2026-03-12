import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm z-[200] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-black dark:text-white" />
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] animate-pulse">Gig Store</p>
      </div>
    </div>
  )
}
