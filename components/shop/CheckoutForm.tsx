'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useKKiaPay } from 'kkiapay-react'
import { useCart } from '@/store/cart'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, ShieldCheck, Truck, ArrowLeft, ChevronRight } from 'lucide-react'
import { useToastStore } from '@/store/toast'
import { createOrder, OrderData } from '@/app/actions/orders'
import Link from 'next/link'

const CustomInput = ({ id, label, type = 'text', placeholder, required, value, onChange }: any) => (
  <div className="group relative w-full space-y-2">
    <label htmlFor={id} className="text-[10px] font-bold uppercase tracking-widest text-slate-500 group-focus-within:text-black dark:group-focus-within:text-white transition-colors">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent border-b-2 border-slate-200 dark:border-slate-800 py-3 outline-none focus:border-black dark:focus:border-white transition-all text-sm font-medium placeholder:text-slate-300 dark:placeholder:text-slate-700"
      />
      <div className="absolute bottom-0 left-0 h-0.5 bg-black dark:bg-white w-0 group-focus-within:w-full transition-all duration-300" />
    </div>
  </div>
)

export default function CheckoutForm() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const { items, totalPrice, clearCart } = useCart()
  const { showToast } = useToastStore()
  const [isProcessing, setIsProcessing] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    street: '',
    details: ''
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const { openKkiapayWidget, addSuccessListener, addKkiapayCloseListener } = useKKiaPay()

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) return
    setIsProcessing(true)

    addSuccessListener(async (response: any) => {
      const orderData: OrderData = {
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        total_amount: totalPrice(),
        shipping_address: {
          city: formData.city,
          street: formData.street,
          details: formData.details
        },
        items: items.map(item => ({
          variant_id: item.variant_id,
          quantity: item.quantity,
          price_at_purchase: item.price
        }))
      }

      const res = await createOrder(orderData)
      if (res.success) {
        showToast('Commande réussie !', 'success')
        clearCart()
        router.push(`/checkout/success?id=${res.orderId}`)
      } else {
        showToast('Erreur lors de la création de la commande: ' + res.error, 'error')
        setIsProcessing(false)
      }
    })

    addKkiapayCloseListener(() => {
      setIsProcessing(false)
    })

    openKkiapayWidget({
      amount: totalPrice(),
      api_key: process.env.NEXT_PUBLIC_KKIAPAY_PUBLIC_KEY as string,
      sandbox: true,
      phone: formData.phone,
      name: formData.name,
      email: formData.email,
      reason: 'Achat sur Gig Store'
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }))
  }

  if (!mounted) return <div className="min-h-[600px] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>

  return (
    <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 relative">
      {/* Formulaire Section */}
      <div className="lg:col-span-7 space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-12"
        >
          {/* Section Header */}
          <div className="space-y-4">
            <p className="text-slate-500 text-2xl max-w-m leading-relaxed">
              Veuillez renseigner vos informations pour le suivi et la livraison de votre commande.
            </p>
          </div>

          <form id="checkout-form" onSubmit={handlePayment} className="grid md:grid-cols-2 gap-x-10 gap-y-10">
            <CustomInput 
              id="name" 
              label="Nom Complet" 
              placeholder="Ex: Jean Dupont" 
              required 
              value={formData.name} 
              onChange={handleChange} 
            />
            <CustomInput 
              id="email" 
              type="email" 
              label="Email" 
              placeholder="Ex: jean@email.com" 
              required 
              value={formData.email} 
              onChange={handleChange} 
            />
            <div className="md:col-span-2">
              <CustomInput 
                id="phone" 
                type="tel" 
                label="Téléphone (KKiaPay Mobile Money)" 
                placeholder="Ex: 229XXXXXXXX" 
                required 
                value={formData.phone} 
                onChange={handleChange} 
              />
            </div>
            <CustomInput 
              id="city" 
              label="Ville" 
              placeholder="Ex: Cotonou" 
              required 
              value={formData.city} 
              onChange={handleChange} 
            />
            <CustomInput 
              id="street" 
              label="Quartier / Adresse" 
              placeholder="Ex: Haie Vive" 
              required 
              value={formData.street} 
              onChange={handleChange} 
            />
            <div className="md:col-span-2">
              <CustomInput 
                id="details" 
                label="Complément d'adresse (Optionnel)" 
                placeholder="N° appartement, étage, repères..." 
                value={formData.details} 
                onChange={handleChange} 
              />
            </div>
          </form>

          <div className="pt-8 flex items-center gap-4 text-[10px] text-slate-500 bg-slate-50 dark:bg-slate-900/50 p-6 border-l-2 border-black dark:border-white">
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <p className="uppercase tracking-widest leading-relaxed">
              Paiement 100% sécurisé via <span className="font-bold border-b border-slate-300">KKiaPay</span>. <br />
              Vos données sont chiffrées et protégées.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Résumé Section */}
      <div className="lg:col-span-5 relative">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:sticky lg:top-32 space-y-10 bg- border border-black dark:border-white text-black dark:bg-black dark:text-white p-8 md:p-10"
        >
          <div className="space-y-6">
            <h2 className="text-xl font-bold uppercase tracking-widest border-b border-white/20 dark:border-black/10 pb-6 flex justify-between items-center">
              Votre Panier
              <span className="text-[10px] font-medium bg-white/10 dark:bg-black/5 px-3 py-1 rounded-full">{items.length} articles</span>
            </h2>
            
            <div className="max-h-[320px] overflow-y-auto space-y-8 pr-4 custom-scrollbar">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div 
                    layout
                    key={item.variant_id} 
                    className="flex gap-6"
                  >
                    <div className="w-20 h-24 bg-white/5 dark:bg-black/5 shrink-0 overflow-hidden relative group">
                      {item.image && (
                        <div 
                          className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                          style={{ backgroundImage: `url('${item.image}')` }}
                        />
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider mb-1 leading-tight">{item.name}</p>
                        <div className="flex gap-2 text-[9px] uppercase tracking-widest text-white/50 dark:text-black/50 font-bold">
                          {item.size && <span>Taille: {item.size}</span>}
                          {item.size && item.color && <span>|</span>}
                          {item.color && <span>Couleur: {item.color}</span>}
                        </div>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-medium text-white/40 dark:text-black/40">Qté: {item.quantity}</span>
                        <p className="text-sm font-bold tracking-tighter">
                          {item.price * item.quantity} <span className="text-[10px] ml-1 opacity-60">CFA</span>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="space-y-5 pt-8 border-t border-white/20 dark:border-black/10">
            <div className="flex justify-between text-[11px] uppercase tracking-widest font-bold text-white/50 dark:text-black/50">
              <span>Sous-total</span>
              <span>{totalPrice()} CFA</span>
            </div>
            <div className="flex justify-between text-[11px] uppercase tracking-widest font-bold text-white/50 dark:text-black/50">
              <span>Livraison</span>
              <span className="text-white dark:text-black">Gratuite</span>
            </div>
            
            <div className="flex justify-between items-baseline pt-4">
              <span className="text-xs font-bold uppercase tracking-[0.3em]">Total à payer</span>
              <div className="text-right">
                <span className="text-3xl font-bold tracking-tighter">{totalPrice()}</span>
                <span className="text-xs font-bold ml-2 uppercase">CFA</span>
              </div>
            </div>

            <button 
              form="checkout-form"
              type="submit"
              disabled={isProcessing || items.length === 0}
              className="w-full h-16 bg-white text-black dark:bg-black dark:text-white font-black uppercase tracking-[0.25em] text-[11px] hover:bg-slate-200 dark:hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-3 relative overflow-hidden group"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Traitement...
                </>
              ) : (
                <>
                  <span>Payer Maintenant</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
