'use client'

import { useSearch } from '@/store/search'

export default function SearchResultsText({ query }: { query: string }) {
  const openSearch = useSearch((state) => state.open)

  return (
    <p 
      className="text-sm text-slate-500 mb-8 -mt-4 cursor-pointer hover:text-black dark:hover:text-white transition-colors group inline-block"
      onClick={openSearch}
    >
      Résultats pour la recherche &quot;<span className="text-black dark:text-white font-bold group-hover:underline">{query}</span>&quot;
    </p>
  )
}
