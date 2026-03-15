'use client'

import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }
    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-20 right-5 md:bottom-10 md:right-10 z-[40] p-3.5 bg-black text-white dark:bg-white dark:text-black rounded-full shadow-2xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-all duration-200 flex items-center justify-center active:scale-95 border dark:border-slate-800"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5 stroke-[2.5px]" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
