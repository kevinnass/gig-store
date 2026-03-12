'use client'

import { useToastStore } from '@/store/toast'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'

export function ToastProvider() {
  const { isOpen, message } = useToastStore()

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed bottom-24 lg:bottom-10 right-4 lg:right-10 z-[100]"
        >
          <div className="bg-black dark:bg-white text-white dark:text-black px-6 py-4 flex items-center gap-3 shadow-2xl">
            <ShoppingBag className="w-5 h-5" />
            <p className="text-xs font-bold uppercase tracking-widest">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
