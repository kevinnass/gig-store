import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t py-12 sm:py-20 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4 text-center md:text-left">
            <Link href="/" className="text-xl font-black tracking-tighter uppercase italic">
              Gig<span className="text-primary">Store</span>
            </Link>
            <p className="text-sm text-balance text-muted-foreground leading-relaxed">
              Maroquinerie et mode premium pour ceux qui ne font aucun compromis sur le style et la qualité.
            </p>
          </div>

          {/* Links 1 */}
          <div className="text-center md:text-left">
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Boutique</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/shop" className="hover:text-black transition-colors">Tous les produits</Link></li>
              <li><Link href="/category/sacs" className="hover:text-black transition-colors">Sacs à main</Link></li>
              <li><Link href="/category/chaussures" className="hover:text-black transition-colors">Chaussures</Link></li>
              <li><Link href="/category/accessoires" className="hover:text-black transition-colors">Accessoires</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div className="text-center md:text-left">
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Aide</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/shipping" className="hover:text-black transition-colors">Livraison</Link></li>
              <li><Link href="/returns" className="hover:text-black transition-colors">Retours</Link></li>
              <li><Link href="/faq" className="hover:text-black transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-black transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="text-center md:text-left">
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Newsletter</h4>
            <p className="text-xs text-muted-foreground mb-4">Inscrivez-vous pour recevoir nos nouveautés.</p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Votre email" 
                className="flex-1 bg-white border border-r-0 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
              <button className="bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-tighter hover:bg-zinc-800 transition-colors">
                OK
              </button>
            </form>
          </div>
        </div>

        <div className="border-t mt-12 sm:mt-20 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-[10px] uppercase tracking-widest text-muted-foreground">
          <p>© {new Date().getFullYear()} Gig-store. Tous droits réservés.</p>
          <div className="flex space-x-6">
            <Link href="/terms" className="hover:text-black underline underline-offset-4">CGV</Link>
            <Link href="/privacy" className="hover:text-black underline underline-offset-4">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
