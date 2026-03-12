'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown } from 'lucide-react'

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
    <div className="relative flex items-center group">
      <select 
        value={sort} 
        onChange={handleSortChange}
        className="appearance-none bg-transparent pl-4 pr-10 py-2.5 border border-slate-200 dark:border-slate-800 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] focus:outline-none cursor-pointer hover:border-black dark:hover:border-white transition-all duration-300 w-full sm:w-auto"
      >
        <option value="newest">Trier par : Nouveautés</option>
        <option value="price_asc">Trier par : Prix croissant</option>
        <option value="price_desc">Trier par : Prix décroissant</option>
      </select>
      <ChevronDown className="absolute right-4 w-3 h-3 text-slate-400 group-hover:text-black dark:group-hover:text-white transition-colors pointer-events-none" />
    </div>
  )
}
