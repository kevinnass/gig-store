'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, User, ArrowRight, Github, Chrome, Phone, RefreshCw, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const supabase = createClient()

export default function LoginPage() {
  const [step, setStep] = useState<'request' | 'verify'>('request')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
 
  // Form Fields
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
 
  const router = useRouter()
 
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
 
    try {
      if (!email) throw new Error("L'adresse e-mail est obligatoire.")
 
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
      })
 
      if (signInError) throw signInError
 
      setStep('verify')
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de l'envoi du code.")
    } finally {
      setIsLoading(false)
    }
  }
 
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
 
    try {
      if (!otp) throw new Error("Le code OTP est obligatoire.")
 
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: otp.trim(),
        type: 'email',
      })
 
      if (verifyError) {
        console.error("Détails de l'erreur verifyOtp:", verifyError)
        throw verifyError
      }
 
      // Redirect to Account page (where they can fill info and see orders)
      router.push('/account')
    } catch (err: any) {
      setError(err.message || "Code incorrect ou expiré.")
    } finally {
      setIsLoading(false)
    }
  }
 
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24 bg-white dark:bg-slate-950">
      <div className="w-full max-w-[400px] space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight uppercase">
            {step === 'verify' ? 'Vérifier le code' : 'Connexion'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {step === 'verify' 
              ? `Un code a été envoyé à : ${email}`
              : 'Accédez à votre espace pour gérer vos commandes et informations.'}
          </p>
        </div>
 
        {/* Form Container */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-8 border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
 
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-semibold px-4">
              {error}
            </div>
          )}
 
          <AnimatePresence mode="wait">
            {step === 'request' ? (
              <motion.form 
                key="request-form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-5 relative z-10" 
                onSubmit={handleSendOtp}
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="email" 
                      placeholder="EMAIL@EXAMPLE.COM"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 pl-10 pr-4 py-3 text-xs font-medium focus:outline-none focus:border-black dark:focus:border-white transition-colors uppercase tracking-widest"
                    />
                  </div>
                </div>
 
                <Button 
                  disabled={isLoading} 
                  type="submit"
                  className="w-full h-12 rounded-none bg-black text-white dark:bg-white dark:text-black font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-slate-800 dark:hover:bg-slate-200 group/btn transition-all"
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Recevoir le code par e-mail'}
                  {!isLoading && <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />}
                </Button>
              </motion.form>
            ) : (
              <motion.form 
                key="verify-form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-5 relative z-10" 
                onSubmit={handleVerifyOtp}
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Code de vérification</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="XXXXXXXX"
                      required
                      maxLength={8}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 pl-10 pr-4 py-3 text-xs font-medium focus:outline-none focus:border-black dark:focus:border-white transition-colors tracking-[0.4em] text-center"
                    />
                  </div>
                </div>
 
                <Button 
                  disabled={isLoading} 
                  type="submit"
                  className="w-full h-12 rounded-none bg-black text-white dark:bg-white dark:text-black font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-slate-800 dark:hover:bg-slate-200 group/btn transition-all"
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Se connecter'}
                  {!isLoading && <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />}
                </Button>
 
                <button 
                  type="button" 
                  onClick={() => setStep('request')} 
                  className="w-full text-center text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:text-black dark:hover:text-white mt-2"
                >
                  ← Retour / Corriger l'email
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
 
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
