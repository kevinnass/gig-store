'use client'

import { useToastStore } from '@/store/toast'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ToastProvider() {
  const { isOpen, message, type } = useToastStore()

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 shrink-0" />,
    error: <XCircle className="w-5 h-5 shrink-0" />,
    info: <Info className="w-5 h-5 shrink-0" />,
  }

  const styles = {
    success: 'bg-emerald-600 text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-gray-900 dark:bg-gray-100 text-white dark:text-black',
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="fixed bottom-24 lg:bottom-10 right-4 lg:right-10 z-[100]"
        >
          <div className={cn(
            'px-5 py-3.5 flex items-center gap-3 shadow-2xl rounded-xl min-w-[220px] max-w-sm',
            styles[type ?? 'info']
          )}>
            {icons[type ?? 'info']}
            <p className="text-sm font-semibold">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
