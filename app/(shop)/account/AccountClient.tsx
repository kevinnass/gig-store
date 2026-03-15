'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Phone, Package, LogOut, RefreshCw, MapPin, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface AccountClientProps {
  profile: any
  orders: any[]
  user: any
}

export function AccountClient({ profile, orders, user }: AccountClientProps) {
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [phoneNumber, setPhoneNumber] = useState(profile?.phone_number || '')
  const [city, setCity] = useState(profile?.city || '')
  const [street, setStreet] = useState(profile?.street || '')
  const [details, setDetails] = useState(profile?.details || '')
  
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const supabase = createClient()
  const router = useRouter()

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName.trim().toUpperCase(),
          phone_number: phoneNumber.trim(),
          city: city.trim(),
          street: street.trim(),
          details: details.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) throw error

      setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' })
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Une erreur est survenue.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 px-4 py-24">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-100 dark:border-slate-800 pb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight uppercase">Mon Espace</h1>
            <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleSignOut}
            className="rounded-none border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-950/20 w-fit font-bold uppercase tracking-widest text-[10px] h-10"
          >
            <LogOut className="w-3.5 h-3.5 mr-2" />
            Se déconnecter
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Section Profil */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Mes Informations</h2>
            
            <form onSubmit={handleUpdateProfile} className="bg-slate-50 dark:bg-slate-900/50 p-6 border border-slate-100 dark:border-slate-800 space-y-4">
              {message && (
                <div className={`p-3 text-xs font-semibold ${message.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-600 dark:bg-red-900/20'}`}>
                  {message.text}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Nom complet</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="JOHN DOE"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 pl-10 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:border-black dark:focus:border-white transition-colors uppercase tracking-widest"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="tel" 
                    placeholder="EX: 229XXXXXXXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 pl-10 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:border-black dark:focus:border-white transition-colors uppercase tracking-widest"
                  />
                </div>
              </div>

              {/* Adresse */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Adresse de livraison
                </label>
                
                <div className="space-y-2">
                  <input 
                    type="text" 
                    placeholder="Ville"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  />
                  <input 
                    type="text" 
                    placeholder="Rue / Quartier"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  />
                  <textarea 
                    placeholder="Détails (Porte, repères...)"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    rows={2}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-black dark:focus:border-white transition-colors resize-none"
                  />
                </div>
              </div>

              <Button 
                disabled={isLoading} 
                type="submit"
                className="w-full h-11 rounded-none bg-black text-white dark:bg-white dark:text-black font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-slate-800 dark:hover:bg-slate-200 transition-all"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Enregistrer'}
              </Button>
            </form>
          </div>

          {/* Section Commandes */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Historique des Commandes ({orders.length})</h2>
            
            {orders.length === 0 ? (
              <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800">
                <Package className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
                <p className="text-sm text-slate-500">Aucune commande trouvée sous cet e-mail.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order: any) => {
                  const isExpanded = expandedOrder === order.id;

                  return (
                    <div 
                      key={order.id}
                      className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 overflow-hidden"
                    >
                      {/* Header Commande */}
                      <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold font-mono tracking-wider">#{order.id.slice(0,8).toUpperCase()}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider ${
                              order.status === 'paid' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                              order.status === 'pending' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' :
                              'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            }`}>
                              {order.status === 'paid' ? 'Payé' : order.status === 'pending' ? 'En attente' : order.status}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400">
                            {new Date(order.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </p>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                          <div className="text-right">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total</p>
                            <p className="text-sm font-bold">{order.total_amount} CFA</p>
                          </div>
                          <Button 
                            variant="outline" 
                            onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                            className="h-9 rounded-none border-slate-200 dark:border-slate-800 font-bold uppercase tracking-widest text-[9px] flex items-center gap-1"
                          >
                            Détails {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </Button>
                        </div>
                      </div>

                      {/* Expandable items section */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50"
                          >
                            <div className="p-5 space-y-4">
                              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Produits commandés</h4>
                              
                              {order.order_items?.map((item: any) => {
                                const products = item.product_variants?.products;
                                const variant = item.product_variants;

                                return (
                                  <div key={item.id} className="flex items-center justify-between border-b last:border-b-0 border-slate-100 dark:border-slate-800/50 py-3">
                                    <div className="flex items-center gap-3">
                                      {products?.main_image ? (
                                        <div className="relative w-12 h-12 bg-gray-100 flex-shrink-0">
                                          <img 
                                            src={products.main_image} 
                                            alt={products.name} 
                                            className="absolute inset-0 w-full h-full object-cover" 
                                          />
                                        </div>
                                      ) : (
                                        <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                                          <Package className="w-5 h-5 text-slate-400" />
                                        </div>
                                      )}
                                      
                                      <div>
                                        <p className="text-xs font-bold uppercase tracking-wide">{products?.name || 'Produit inconnu'}</p>
                                        <p className="text-[10px] text-slate-400">
                                          {variant?.size && `Taille: ${variant.size}`}
                                          {variant?.size && variant?.color && ' | '}
                                          {variant?.color && `Style: ${variant.color}`}
                                        </p>
                                        <p className="text-[10px] text-slate-500 mt-0.5">Qté: {item.quantity}</p>
                                      </div>
                                    </div>
                                    
                                    <div className="text-right">
                                      <p className="text-xs font-bold">{item.price_at_purchase} CFA</p>
                                      {item.quantity > 1 && (
                                        <p className="text-[9px] text-slate-400 mt-0.5">{(item.price_at_purchase * item.quantity)} total</p>
                                      )}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
