'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, ArrowRight, Github, Chrome } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24 bg-white dark:bg-slate-950">
      <div className="w-full max-w-[400px] space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight uppercase">
            {mode === 'login' ? 'Connexion' : 'Créer un compte'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {mode === 'login' 
              ? 'Accédez à vos commandes, adresses et informations personnelles.' 
              : 'Gérez vos futurs achats de manière simplifiée.'}
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-8 border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
          {/* Subtle animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <form className="space-y-5 relative z-10" onSubmit={(e) => e.preventDefault()}>
            <AnimatePresence mode="wait">
              {mode === 'register' && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-2"
                >
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Nom complet</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="JOHN DOE"
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 pl-10 pr-4 py-3 text-xs font-medium focus:outline-none focus:border-black dark:focus:border-white transition-colors uppercase tracking-widest"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="email" 
                  placeholder="EMAIL@EXAMPLE.COM"
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 pl-10 pr-4 py-3 text-xs font-medium focus:outline-none focus:border-black dark:focus:border-white transition-colors uppercase tracking-widest"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Mot de passe</label>
                {mode === 'login' && (
                  <button type="button" className="text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:text-black dark:hover:text-white transition-colors">
                    Oublié ?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 pl-10 pr-4 py-3 text-xs font-medium focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                />
              </div>
            </div>

            <Button className="w-full h-12 rounded-none bg-black text-white dark:bg-white dark:text-black font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-slate-800 dark:hover:bg-slate-200 group/btn transition-all">
              {mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200 dark:border-slate-800"></span>
            </div>
            <div className="relative flex justify-center text-[9px] font-bold uppercase tracking-[0.3em]">
              <span className="bg-slate-50 dark:bg-slate-900 px-4 text-slate-400">Ou continuer avec</span>
            </div>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 h-10 border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-950 transition-all group/social">
              <Chrome className="w-4 h-4 text-slate-400 group-hover/social:text-black dark:group-hover/social:text-white transition-colors" />
              <span className="text-[9px] font-bold uppercase tracking-widest">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 h-10 border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-950 transition-all group/social">
              <Github className="w-4 h-4 text-slate-400 group-hover/social:text-black dark:group-hover/social:text-white transition-colors" />
              <span className="text-[9px] font-bold uppercase tracking-widest">Github</span>
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
          {mode === 'login' ? "Nouveau client ?" : "Déjà un compte ?"}
          <button 
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="ml-2 text-black dark:text-white hover:underline underline-offset-4 decoration-2"
          >
            {mode === 'login' ? "Créer un compte" : "Se connecter"}
          </button>
        </p>

        {/* Back Link */}
        <div className="text-center">
          <Link href="/" className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-black dark:hover:text-white transition-colors">
            ← Retour à la boutique
          </Link>
        </div>
      </div>
    </div>
  )
}
