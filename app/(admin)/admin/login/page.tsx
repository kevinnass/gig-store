'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Mail, ArrowRight, ShieldAlert, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw new Error('Identifiants de connexion incorrects.')
      }

      // Si l'utilisateur connecté n'est pas le bon admin
      if (data.user?.email !== 'gigstore.shop@gmail.com') {
        await supabase.auth.signOut()
        throw new Error("Accès refusé. Vous n'êtes pas administrateur.")
      }

      // Succès -> redirection et rafraîchissement
      router.push('/admin')
      router.refresh()
      
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de la connexion.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-md">
        {/* Header Admin */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black dark:bg-white text-white dark:text-black mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter uppercase italic">
            Gig<span className="text-primary">Store</span> Workspace
          </h1>
          <p className="text-sm font-bold tracking-widest uppercase text-slate-500">
            Portail d&apos;Administration
          </p>
        </div>

        {/* Login Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-xl shadow-black/5"
        >
          {error && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs font-medium text-center">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="email" 
                  value={email}
                  placeholder=""
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 pl-10 pr-4 py-3 text-xs font-medium focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Mot de passe d&apos;accès
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 pl-10 pr-4 py-3 text-xs font-medium focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  autoFocus
                />
              </div>
            </div>

            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-none bg-black text-white dark:bg-white dark:text-black font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-slate-800 dark:hover:bg-slate-200 group/btn transition-all mt-4"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
              ) : (
                <>
                  Autoriser l&apos;accès
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-8 text-center border-t border-slate-100 dark:border-slate-800 pt-6">
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 flex items-center justify-center">
              <Lock className="w-3 h-3 mr-2" />
              Accès restreint & surveillé
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
