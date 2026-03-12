'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut, Store } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

const NAV_LINKS = [
  { name: 'Tableau de bord', href: '/admin', icon: LayoutDashboard },
  { name: 'Inventaire', href: '/admin/inventory', icon: Package },
  { name: 'Commandes', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Paramètres', href: '/admin/settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <aside className="w-64 border-r bg-card flex flex-col h-screen sticky top-0">
      {/* Logo / En-tête de la sidebar */}
      <div className="h-16 flex items-center px-6 border-b">
        <Link href="/admin" className="flex items-center gap-2 font-bold tracking-tighter uppercase text-lg">
          <div className="w-6 h-6 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center rounded-sm">
            G
          </div>
          Gig<span className="text-primary italic">Workspace</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-4 space-y-1">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`) && link.href !== '/admin'
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              {link.name}
            </Link>
          )
        })}
      </nav>

      {/* Footer Sidebar (Liens externes et Déconnexion) */}
      <div className="p-4 border-t space-y-2">
        <Link href="/" target="_blank" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full">
          <Store className="w-4 h-4" />
          Voir la boutique
        </Link>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground hover:text-red-500 hover:bg-red-500/10 px-3 py-2 h-auto"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Se déconnecter
        </Button>
      </div>
    </aside>
  )
}
