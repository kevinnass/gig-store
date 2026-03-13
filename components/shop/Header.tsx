'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, User, Home, Grid, Mail } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useCart } from '@/store/cart'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/ModeToggle'
import CartPopover from '@/components/shop/CartPopover'
import { SearchBar } from '@/components/shop/SearchBar'

export default function Header() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const totalItems = useCart((state) => state.totalItems())

  useEffect(() => {
    setMounted(true)
  }, [])

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
          {[
            { name: 'Accueil', path: '/' },
            { name: 'Boutique', path: '/shop' },
            { name: 'Contact', path: '/contact' },
          ].map((item) => {
            const isActive = item.path === '/' 
              ? pathname === '/' 
              : pathname.startsWith(item.path)

            return (
              <Link 
                key={item.path}
                href={item.path} 
                className={`relative transition-colors py-1 ${isActive ? 'text-black dark:text-white' : 'text-slate-400 hover:text-black dark:hover:text-white'}`}
              >
                {item.name}
                {isActive && (
                  <motion.div 
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-black dark:bg-white"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Icons */}
        <div className="flex-1 md:flex-none flex items-center justify-end space-x-2 sm:space-x-4">
          {/* Cart Icon with Popover on Desktop */}
          <div className="hidden md:block relative group">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {mounted && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
            
            {/* Popover content (visible on group hover) */}
            <div className="absolute top-full right-0 mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <CartPopover />
            </div>
          </div>
          
          <div className="relative">
            <Suspense fallback={<div className="w-10 h-10" />}>
              <SearchBar />
            </Suspense>
          </div>
          
          <Link href="/login">
            <Button variant="ghost" size="icon" className="inline-flex">
              <User className="h-5 w-5" />
            </Button>
          </Link>
          <ModeToggle />
        </div>
      </div>
    </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-950 border-t flex items-center justify-around h-16 pb-safe safe-area-padding shadow-[0_-1px_10px_rgba(0,0,0,0.05)]">
        {[
          { name: 'Accueil', path: '/', icon: Home },
          { name: 'Boutique', path: '/shop', icon: Grid },
          { name: 'Panier', path: '/cart', icon: ShoppingBag, count: totalItems },
          { name: 'Contact', path: '/contact', icon: Mail },
        ].map((item) => {
          const isActive = item.path === '/' 
            ? pathname === '/' 
            : pathname.startsWith(item.path)
          const Icon = item.icon

          return (
            <Link 
              key={item.path}
              href={item.path} 
              className={`relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 ${isActive ? 'text-black dark:text-white' : 'text-slate-400'}`}
            >
              <motion.div
                initial={false}
                animate={isActive ? { scale: 1.2, y: -2 } : { scale: 1, y: 0 }}
                whileTap={{ scale: 0.9 }}
                className="relative"
              >
                <Icon className="h-5 w-5" />
                {mounted && item.count !== undefined && item.count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-black dark:bg-white text-white dark:text-black text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                    {item.count}
                  </span>
                )}
              </motion.div>
              <span className={`text-[9px] font-bold uppercase tracking-wider transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                {item.name}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="mobile-nav-indicator"
                  className="absolute top-0 w-8 h-[2px] bg-black dark:bg-white"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          )
        })}
      </nav>
    </>
  )
}
