'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown, Check, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'

export function CategoryFilterClient({ categories, categorySlug }: { categories: any[] | null, categorySlug?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCategoryChange = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (slug === 'all') {
      params.delete('category')
    } else {
      params.set('category', slug)
    }
    params.delete('page')
    router.push(`?${params.toString()}`)
    setIsOpen(false)
  }

  const currentCategory = categories?.find(c => c.slug === categorySlug)
  const currentLabel = currentCategory ? currentCategory.name : 'Toutes les catégories'

  const activeClasses = "bg-black text-white dark:bg-white dark:text-black font-bold"
  const inactiveClasses = "bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"

  return (
    <>
      <div className="flex-1 md:hidden">
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-between w-full px-5 py-3.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm hover:border-black dark:hover:border-white transition-all duration-300"
        >
          <span>
            {currentLabel}
          </span>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isOpen && mounted && createPortal(
        <AnimatePresence>
          <div className="fixed inset-0 z-[100] flex items-end justify-center">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Bottom Sheet Drawer */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-950 rounded-t-2xl p-6 overflow-hidden shadow-2xl z-10 flex flex-col max-h-[80vh]"
            >
              {/* Top Handle bar */}
              <div className="mx-auto w-12 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mb-6 cursor-pointer" onClick={() => setIsOpen(false)} />

              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Filtrer par catégorie</h3>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Lists of Categories */}
              <div className="flex flex-col gap-2 overflow-y-auto no-scrollbar pb-4">
                <button
                  onClick={() => handleCategoryChange('all')}
                  className={`flex items-center justify-between w-full p-4 rounded-xl text-left text-sm transition-all ${!categorySlug ? activeClasses : inactiveClasses}`}
                >
                  <span className="uppercase tracking-wide">Toutes les catégories</span>
                  {!categorySlug && <Check className="w-4 h-4 text-white dark:text-black" />}
                </button>

                {categories?.map((cat) => {
                  const isActive = categorySlug === cat.slug
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.slug)}
                      className={`flex items-center justify-between w-full p-4 rounded-xl text-left text-sm transition-all ${isActive ? activeClasses : inactiveClasses}`}
                    >
                      <span className="uppercase tracking-wide">{cat.name}</span>
                      {isActive && <Check className="w-4 h-4 text-white dark:text-black" />}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}
