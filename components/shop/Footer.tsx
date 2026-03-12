import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t dark:border-slate-800 pt-12 pb-24 md:pb-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="text-xl font-black tracking-tighter uppercase italic block">
              Gig<span className="text-primary">Store</span>
            </Link>
            <p className="hidden md:block text-sm text-muted-foreground leading-relaxed max-w-xs">
              Maroquinerie et mode premium sans compromis.
            </p>
          </div>

          {/* Navigation Rapide - Horizontale sur mobile */}
          <nav className="flex flex-wrap gap-x-6 gap-y-3 text-[10px] font-bold uppercase tracking-widest">
            <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Accueil</Link>
            <Link href="/shop" className="hover:text-black dark:hover:text-white transition-colors">Boutique</Link>
            <Link href="/contact" className="hover:text-black dark:hover:text-white transition-colors">Contact</Link>
            <Link href="/faq" className="hover:text-black dark:hover:text-white transition-colors">FAQ</Link>
          </nav>

          {/* Newsletter Compacte */}
          <div className="w-full md:w-72">
            <form className="relative">
              <input 
                type="email" 
                placeholder="Contactez-nous (Saisissez votre email)" 
                className="w-full bg-transparent border-b border-slate-300 dark:border-slate-800 py-2 text-[10px] font-bold tracking-widest uppercase focus:outline-none focus:border-black dark:focus:border-white transition-colors placeholder:text-slate-400"
              />
              <button 
                type="submit"
                className="absolute right-0 bottom-2 text-[10px] font-bold uppercase tracking-widest"
              >
                OK
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar simple */}
        <div className="border-t dark:border-slate-900 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
          <p>© 2026 Gig-Store — Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-black dark:hover:text-white transition-colors">CGV</Link>
            <Link href="/privacy" className="hover:text-black dark:hover:text-white transition-colors">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
