'use client'

import Link from 'next/link'
import { ShoppingBag, User, Search, Menu } from 'lucide-react'
import { useCart } from '@/store/cart'
import { Button } from '@/components/ui/button'

export default function Header() {
  const totalItems = useCart((state) => state.totalItems())

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      {/* Promo Banner */}
      {/* <div className="bg-black text-white text-[10px] sm:text-xs py-2 text-center font-medium tracking-widest uppercase">
        Livraison offerte dès 150&apos;€ d&apos;achat • Retours gratuits
      </div> */}
      
      <div className="container mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
        {/* Mobile Menu */}
        <div className="md:hidden flex-1">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Logo */}
        <div className="flex-1 md:flex-none text-center md:text-left">
          <Link href="/" className="text-xl sm:text-2xl font-bold tracking-tighter uppercase ">
            Gig<span className="text-primary ">Store</span>
          </Link>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium uppercase tracking-wider mx-auto">
          <Link href="/shop" className="hover:text-primary transition-colors">Catalogue</Link>
          <Link href="/category/sacs" className="hover:text-primary transition-colors">Sacs</Link>
          <Link href="/category/chaussures" className="hover:text-primary transition-colors">Chaussures</Link>
          <Link href="/category/accessoires" className="hover:text-primary transition-colors">Accessoires</Link>
        </nav>

        {/* Icons */}
        <div className="flex-1 md:flex-none flex items-center justify-end space-x-2 sm:space-x-4">
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
            <User className="h-5 w-5" />
          </Button>
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
