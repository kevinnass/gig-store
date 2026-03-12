import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] w-full py-20 gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-black dark:text-white" />
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] animate-pulse">Gig Store</p>
    </div>
  )
}
