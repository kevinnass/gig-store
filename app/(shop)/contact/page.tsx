'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToastStore } from '@/store/toast'
import { Loader2 } from 'lucide-react'

export default function ContactPage() {
  const showToast = useToastStore((state) => state.showToast)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: 'Question sur un produit',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        })
      })

      if (response.ok) {
        showToast('Message envoyé avec succès !')
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          subject: 'Question sur un produit',
          message: ''
        })
      } else {
        const error = await response.json()
        showToast(error.error || 'Une erreur est survenue.')
      }
    } catch (err) {
       showToast('Une erreur est survenue.')
    } finally {
       setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 mt-16 md:mt-24 max-w-4xl">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase">Contactez-nous</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Une question sur une commande, un produit ou notre politique de retour ? Notre équipe est à votre disposition.
        </p>
      </div>

      <div className="max-w-lg mx-auto">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 p-8">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Prénom</label>
                <input 
                  type="text" 
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full bg-white dark:bg-slate-950 border dark:border-slate-800 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Nom</label>
                <input 
                  type="text" 
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full bg-white dark:bg-slate-950 border dark:border-slate-800 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all" 
                  required 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Email</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white dark:bg-slate-950 border dark:border-slate-800 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all" 
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Sujet</label>
              <select 
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full bg-white dark:bg-slate-950 border dark:border-slate-800 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all appearance-none rounded-none"
              >
                <option>Question sur un produit</option>
                <option>Suivi de commande</option>
                <option>Retours et remboursements</option>
                <option>Demande d'informations</option>
                <option>Autre demande</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Message</label>
              <textarea 
                rows={5} 
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-white dark:bg-slate-950 border dark:border-slate-800 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all resize-none" 
                required
              ></textarea>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full h-12 rounded-none font-bold uppercase tracking-widest text-xs bg-black text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Envoyer le message'}
          </Button>
        </form>
      </div>
    </div>
  )
}
