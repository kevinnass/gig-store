'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X, Loader2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { SafeImage } from './SafeImage'
import { useSearch } from '@/store/search'

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isOpen, close, open } = useSearch()
  const [query, setQuery] = useState(searchParams.get('search') || '')
  const [mounted, setMounted] = useState(false)
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
  }, [])
  
  const resetSuggestions = () => setSuggestions([])

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      resetSuggestions()
      return
    }

    const fetchSuggestions = async () => {
      setLoading(true)
      const { data } = await supabase
        .from('products')
        .select('id, name, main_image, price')
        .ilike('name', `%${query}%`)
        .limit(5)
      
      setSuggestions(data || [])
      setLoading(false)
    }

    const timer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(timer)
  }, [query, supabase])

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    
    if (!query.trim()) {
      params.delete('search')
    } else {
      params.set('search', query)
    }
    
    router.push(`/shop?${params.toString()}`)
    close()
  }

  const handleClear = () => {
    setQuery('')
    const params = new URLSearchParams(searchParams.toString())
    if (params.has('search')) {
      params.delete('search')
      router.push(`/shop?${params.toString()}`)
    }
  }

  const hasActiveSearch = searchParams.has('search')

  return (
    <>
      <div className="relative">
        <Button variant="ghost" size="icon" onClick={() => useSearch.getState().open()}>
          <Search className="h-5 w-5" />
        </Button>
        {hasActiveSearch && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-black dark:bg-white rounded-full border-2 border-white dark:border-slate-950" />
        )}
      </div>

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop sombre */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => close()}
          />
          
          {/* Contenu Modal */}
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-950 rounded-2xl p-0 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 sm:p-6 border-b dark:border-slate-800">
              <form onSubmit={handleSearch} className="flex items-center gap-3">
                <Search className="w-6 h-6 text-slate-400" />
                <input 
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Recherche..."
                  className="flex-1 bg-transparent border-none outline-none text-xl font-medium focus:ring-0 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  autoFocus
                />
                
                {query && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={handleClear}
                  >
                    <X className="w-6 h-6 text-slate-400" />
                  </Button>
                )}
                
                {!query && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={() => close()}
                  >
                    <X className="w-6 h-6 text-slate-400" />
                  </Button>
                )}
              </form>
            </div>

            {/* Suggestions */}
            {(loading || suggestions.length > 0) && (
              <div className="p-2 max-h-[60vh] overflow-y-auto">
                {loading && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
                  </div>
                )}
                
                {!loading && suggestions.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    onClick={() => close()}
                    className="flex justify-between items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden">
                        <SafeImage src={product.main_image} alt={product.name} fill className="object-cover" unoptimized />
                      </div>
                      <div>
                        <p className="text-sm font-bold uppercase tracking-wide">{product.name}</p>
                        <p className="text-[11px] text-slate-500">{product.price} CFA</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </Link>
                ))}
                
                {!loading && suggestions.length > 0 && (
                  <div className="p-3 pt-0">
                    <Button 
                      onClick={() => handleSearch()}
                      variant="secondary"
                      className="w-full rounded-xl py-6 border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 group/btn"
                    >
                      Voir tous les résultats pour &quot;{query}&quot;
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </div>
                )}
              </div>
            )}
            
            {!loading && query.length >= 2 && suggestions.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-sm text-slate-400">Aucun produit ne correspond à votre recherche.</p>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
