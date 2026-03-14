'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, ShoppingBag, ArrowRight, Package, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Suspense } from 'react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('id')

  return (
    <div className="max-w-3xl mx-auto space-y-16">
      <div className="space-y-8 text-center md:text-left">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-3 px-4 py-2 bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-400 rounded-full"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Paiement Confirmé</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none"
        >
          Merci<span className="text-slate-200 dark:text-slate-800">.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-500 text-lg md:text-xl max-w-xl leading-relaxed"
        >
          Votre commande a été enregistrée avec succès. Notre équipe s&apos;occupe maintenant de sa préparation.
        </motion.p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="grid md:grid-cols-2 gap-8"
      >
        <div className="bg-white text-black border border-slate-200 dark:bg-slate-900/50 dark:text-white dark:border-slate-800 p-10 space-y-6">
          <div className="flex items-center gap-4 border-b border-slate-100 dark:border-white/10 pb-6">
            <Package className="w-6 h-6 opacity-50" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">Numéro de commande</p>
              <p className="font-mono text-sm tracking-widest">{orderId || 'PROCESS-ID-PENDING'}</p>
            </div>
          </div>
          <p className="text-xs leading-relaxed opacity-70 uppercase tracking-wider">
            Un email récapitulatif a été envoyé à votre adresse. Vous recevrez des mises à jour sur l&apos;expédition.
          </p>
        </div>

        <div className="flex flex-col justify-center gap-4">
          <Link href="/shop" className="group">
            <div className="h-16 border-2 border-black dark:border-white px-8 flex items-center justify-between font-black uppercase tracking-[0.2em] text-[10px] group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all">
              <span>Continuer le Shopping</span>
              <ShoppingBag className="w-4 h-4" />
            </div>
          </Link>
          <Link href="/" className="group">
            <div className="h-16 bg-slate-100 dark:bg-slate-900 px-8 flex items-center justify-between font-black uppercase tracking-[0.2em] text-[10px] hover:bg-slate-200 dark:hover:bg-slate-800 transition-all">
              <span>Retour à l&apos;accueil</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <div className="container mx-auto px-4 pt-12 md:pt-16 pb-24 md:pb-32">
      <Suspense fallback={
        <div className="min-h-[40vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  )
}
