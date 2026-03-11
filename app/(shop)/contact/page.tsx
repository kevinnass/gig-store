import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Contact - Gig-store',
  description: 'Nous contacter pour toute demande.',
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20 mt-16 md:mt-24 max-w-4xl">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase">Contactez-nous</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Une question sur une commande, un produit ou notre politique de retour ? Notre équipe est à votre disposition.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Infos */}
        <div className="space-y-8">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest border-b border-black dark:border-white inline-block pb-1 mb-4">Service Client</h3>
            <p className="text-sm text-muted-foreground mb-1">Du lundi au vendredi, de 9h à 18h.</p>
            <p className="text-sm font-medium">hello@gig-store.com</p>
            <p className="text-sm font-medium">+33 1 23 45 67 89</p>
          </div>
          
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest border-b border-black dark:border-white inline-block pb-1 mb-4">Maison Mère</h3>
            <p className="text-sm text-muted-foreground mb-1">Visites sur rendez-vous uniquement.</p>
            <p className="text-sm font-medium">12 Avenue Montaigne</p>
            <p className="text-sm font-medium">75008 Paris, France</p>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-6 bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 p-8">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Prénom</label>
                <input type="text" className="w-full bg-white dark:bg-slate-950 border dark:border-slate-800 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Nom</label>
                <input type="text" className="w-full bg-white dark:bg-slate-950 border dark:border-slate-800 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all" required />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Email</label>
              <input type="email" className="w-full bg-white dark:bg-slate-950 border dark:border-slate-800 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all" required />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Sujet</label>
              <select className="w-full bg-white dark:bg-slate-950 border dark:border-slate-800 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all appearance-none rounded-none">
                <option>Question sur un produit</option>
                <option>Suivi de commande</option>
                <option>Retours et remboursements</option>
                <option>Demande d'informations</option>
                <option>Autre demande</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Message</label>
              <textarea rows={5} className="w-full bg-white dark:bg-slate-950 border dark:border-slate-800 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all resize-none" required></textarea>
            </div>
          </div>

          <Button type="button" className="w-full h-12 rounded-none font-bold uppercase tracking-widest text-xs bg-black text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200 transition-colors">
            Envoyer le message
          </Button>
        </form>
      </div>
    </div>
  )
}
