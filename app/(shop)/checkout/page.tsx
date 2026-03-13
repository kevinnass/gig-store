'use client'

import CheckoutForm from '@/components/shop/CheckoutForm'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-24 md:py-32">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 space-y-4"
        >
          <Link 
            href="/cart" 
            className="group inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
            Retour au panier
          </Link>
        </motion.div>
        <CheckoutForm />
      </div>
    </div>
  )
}
