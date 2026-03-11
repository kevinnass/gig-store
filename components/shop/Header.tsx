'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, ShoppingBag, User, Home, Grid } from 'lucide-react'
import { useCart } from '@/store/cart'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/ModeToggle'

export default function Header() {
  const pathname = usePathname()
  const totalItems = useCart((state) => state.totalItems())

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
      {/* Promo Banner */}
      {/* <div className="bg-black text-white text-[10px] sm:text-xs py-2 text-center font-medium tracking-widest uppercase">
        Livraison offerte dès 150&apos;€ d&apos;achat • Retours gratuits
      </div> */}
      
      <div className="container mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
        {/* Mobile Spacer (Empty so Logo centers correctly or stays left) */}
        <div className="md:hidden flex-1"></div>

        {/* Logo */}
        <div className="flex-1 md:flex-none text-center md:text-left">
          <Link href="/" className="text-xl sm:text-2xl font-bold tracking-tighter uppercase ">
            Gig Store
          </Link>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-bold uppercase tracking-widest ml-auto mr-8">
          <Link 
            href="/" 
            className={`transition-colors pb-1 border-b-2 ${pathname === '/' ? 'text-primary border-primary' : 'text-slate-500 border-transparent hover:text-primary'}`}
          >
            Accueil
          </Link>
          <Link 
            href="/shop" 
            className={`transition-colors pb-1 border-b-2 ${pathname.startsWith('/shop') || pathname.startsWith('/category') ? 'text-primary border-primary' : 'text-slate-500 border-transparent hover:text-primary'}`}
          >
            Produits
          </Link>
          <Link 
            href="/contact" 
            className={`transition-colors pb-1 border-b-2 ${pathname === '/contact' ? 'text-primary border-primary' : 'text-slate-500 border-transparent hover:text-primary'}`}
          >
            Contacts
          </Link>
        </nav>

        {/* Icons */}
        <div className="flex-1 md:flex-none flex items-center justify-end space-x-2 sm:space-x-4">
          <Link href="/cart" className="hidden md:block">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
            <User className="h-5 w-5" />
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-950 border-t flex items-center justify-around h-16 pb-safe safe-area-padding">
        <Link href="/" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${pathname === '/' ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}>
          <Home className="h-5 w-5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Accueil</span>
        </Link>
        <Link href="/shop" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${pathname.startsWith('/shop') || pathname.startsWith('/category') ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}>
          <Grid className="h-5 w-5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Produits</span>
        </Link>
        <Link href="/cart" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${pathname === '/cart' ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}>
          <div className="relative">
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider">Panier</span>
        </Link>
        <Link href="/contact" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${pathname === '/contact' ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}>
          <User className="h-5 w-5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Profil</span>
        </Link>
      </nav>
    </>
  )
}
