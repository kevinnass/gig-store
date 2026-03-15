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
import { useSearch } from '@/store/search'
import { createClient } from '@/lib/supabase/client'

export default function Header() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any>(null)
  const totalItems = useCart((state) => state.totalItems())
 
  useEffect(() => {
    setMounted(true)
    const supabase = createClient()
 
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
 
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })
 
    return () => subscription.unsubscribe()
  }, [])
 
  const profileLink = user ? '/account' : '/login'

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
      {/* Promo Banner */}
      {/* <div className="bg-black text-white text-[10px] sm:text-xs py-2 text-center font-medium tracking-widest uppercase">
        Livraison offerte dès 150&apos;€ d&apos;achat • Retours gratuits
      </div> */}
      
      <div className="container mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
        {/* Mobile Left: Dark Mode Toggle */}
        <div className="md:hidden flex-1 flex justify-start">
          <ModeToggle />
        </div>

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
          
          <Link href={profileLink} className="hidden md:inline-flex">
            <Button variant="ghost" size="icon" className="relative">
              {user ? (
                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-black text-white dark:bg-white dark:text-black font-bold text-[10px] uppercase shadow-sm">
                  {user.email?.[0].toUpperCase() || '?'}
                </div>
              ) : (
                <User className="h-5 w-5" />
              )}
            </Button>
          </Link>
          
          <div className="hidden md:block">
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-950 border-t flex items-center justify-around h-16 pb-safe safe-area-padding shadow-[0_-1px_10px_rgba(0,0,0,0.05)]">
        <MobileNavLink href="/" icon={Home} label="Accueil" isActive={pathname === '/'} />
        <MobileNavLink href="/shop" icon={Grid} label="Boutique" isActive={pathname === '/shop'} />
        <MobileNavLink href="/cart" icon={ShoppingBag} label="Panier" isActive={pathname === '/cart'} count={totalItems} />
        <MobileNavLink href={profileLink} icon={User} label="Profil" isActive={pathname === profileLink} hasIndicator={!!user} />
      </nav>
    </>
  )
}

function MobileNavLink({ href, icon: Icon, label, isActive, count, hasIndicator }: { href: string; icon: any; label: string; isActive: boolean; count?: number; hasIndicator?: boolean }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <Link 
      href={href} 
      className={`relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 ${isActive ? 'text-black dark:text-white' : 'text-slate-400'}`}
    >
      <motion.div
        initial={false}
        animate={isActive ? { scale: 1.1, y: -2 } : { scale: 1, y: 0 }}
        whileTap={{ scale: 0.9 }}
        className="relative"
      >
        {hasIndicator ? (
          <div className="flex items-center justify-center h-5 w-5 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold text-[9px] uppercase shadow-sm">
             {isActive ? '●' : '◯'}
          </div>
        ) : (
          <Icon className="h-5 w-5" />
        )}
        {mounted && count !== undefined && count > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-black dark:bg-white text-white dark:text-black text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
            {count}
          </span>
        )}
      </motion.div>
      <span className={`text-[9px] font-bold uppercase tracking-wider transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
        {label}
      </span>
    </Link>
  )
}
