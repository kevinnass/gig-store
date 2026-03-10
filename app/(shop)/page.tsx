import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-slate-100">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/20 z-10" />
          {/* Placeholder color instead of image for now to ensure look is premium even without assets */}
          <div className="w-full h-full bg-[linear-gradient(45deg,#f8fafc_25%,#f1f5f9_25%,#f1f5f9_50%,#f8fafc_50%,#f8fafc_75%,#f1f5f9_75%,#f1f5f9_100%)] bg-[length:20px_20px]" />
        </div>
        
        <div className="container mx-auto px-4 relative z-20 text-center space-y-8">
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter uppercase italic leading-none">
            Style <br /> <span className="text-primary italic">Sans Compromis</span>
          </h1>
          <p className="max-w-xl mx-auto text-lg md:text-xl text-slate-700 font-medium">
            Découvrez notre nouvelle collection de maroquinerie premium. Fabriquée à la main pour les esprits exigeants.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/shop">
              <Button size="lg" className="px-8 h-14 text-base font-bold uppercase tracking-widest rounded-none">
                Découvrir la collection
              </Button>
            </Link>
            <Link href="/category/nouveautes">
              <Button variant="outline" size="lg" className="px-8 h-14 text-base font-bold uppercase tracking-widest rounded-none border-2">
                Nouveautés <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories (Placeholder) */}
      <section className="py-20 container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-primary mb-2">Collections</h2>
            <p className="text-3xl md:text-5xl font-bold tracking-tighter uppercase">Nos Incontournables</p>
          </div>
          <Link href="/shop" className="text-sm font-bold uppercase tracking-widest border-b-2 border-primary pb-1 hover:text-primary transition-colors">
            Voir tout
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'Sacs à main', slug: 'sacs', color: '#f8fafc' },
            { name: 'Chaussures', slug: 'chaussures', color: '#e2e8f0' },
            { name: 'Accessoires', slug: 'accessoires', color: '#cbd5e1' }
          ].map((cat) => (
            <Link key={cat.slug} href={`/category/${cat.slug}`} className="group relative aspect-[4/5] overflow-hidden bg-slate-200">
               <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 z-10" />
               <div className="absolute inset-0 flex flex-col justify-end p-8 z-20">
                  <h3 className="text-2xl font-bold text-white uppercase tracking-tighter transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    {cat.name}
                  </h3>
               </div>
               <div className="w-full h-full bg-slate-300 transition-transform duration-700 group-hover:scale-110" style={{ backgroundColor: cat.color }} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
