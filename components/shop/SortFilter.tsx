'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Filter } from 'lucide-react'

export function SortFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sort = searchParams.get('sort') || 'newest'

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString())
    if (e.target.value === 'newest') params.delete('sort')
    else params.set('sort', e.target.value)
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex items-center space-x-2 border border-slate-200 dark:border-slate-800 px-4 py-2 hover:border-black dark:hover:border-white transition-colors shrink-0">
      <Filter className="w-3.5 h-3.5 text-slate-500" />
      <select 
        value={sort} 
        onChange={handleSortChange}
        className="bg-transparent text-xs font-bold uppercase tracking-widest focus:outline-none cursor-pointer appearance-none pr-2"
      >
        <option value="newest" className="text-black bg-white">Nouveautés</option>
        <option value="price_asc" className="text-black bg-white">Prix croissant</option>
        <option value="price_desc" className="text-black bg-white">Prix décroissant</option>
      </select>
    </div>
  )
}
