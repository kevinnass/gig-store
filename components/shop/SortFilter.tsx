'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown, ArrowUpDown, Check, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'

export function SortFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sort = searchParams.get('sort') || 'newest'
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'newest') params.delete('sort')
    else params.set('sort', value)
    router.push(`?${params.toString()}`)
    setIsOpen(false)
  }

  const sortOptions = [
    { value: 'newest', label: 'Nouveautés' },
    { value: 'price_asc', label: 'Prix croissant' },
    { value: 'price_desc', label: 'Prix décroissant' }
  ]

  const currentOption = sortOptions.find(o => o.value === sort) || sortOptions[0]

  return (
    <>
      {/* Desktop View: Standard Styled Select */}
      <div className="hidden md:flex relative items-center group">
        <select 
          value={sort} 
          onChange={(e) => handleSortChange(e.target.value)}
          className="appearance-none bg-transparent pl-4 pr-10 py-2.5 border border-slate-200 dark:border-slate-800 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] focus:outline-none cursor-pointer hover:border-black dark:hover:border-white transition-all duration-300 w-full sm:w-auto"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>Trier par : {option.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 w-3 h-3 text-slate-400 group-hover:text-black dark:group-hover:text-white transition-colors pointer-events-none" />
      </div>

      {/* Mobile View: Subtle Button with bottom sheet */}
      <div className="md:hidden flex-none">
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-[48px] h-[48px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 hover:border-black dark:hover:border-white transition-all shadow-sm"
        >
          <ArrowUpDown className="w-4.5 h-4.5" />
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
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Bottom Sheet Drawer */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-950 rounded-t-2xl p-6 overflow-hidden shadow-2xl z-10 flex flex-col max-h-[50vh]"
            >
              {/* Top Handle */}
              <div className="mx-auto w-12 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mb-6 cursor-pointer" onClick={() => setIsOpen(false)} />

              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Trier les produits</h3>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Sorting Options */}
              <div className="flex flex-col gap-2">
                {sortOptions.map((option) => {
                  const isActive = sort === option.value
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleSortChange(option.value)}
                      className={`flex items-center justify-between w-full p-4 rounded-xl text-left text-sm transition-all ${
                        isActive 
                          ? 'bg-black text-white dark:bg-white dark:text-black font-bold' 
                          : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="uppercase tracking-wide">{option.label}</span>
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
