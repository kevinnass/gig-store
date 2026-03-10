import type { Metadata } from 'next'
import { Ubuntu, Geist_Mono } from 'next/font/google'
import '../globals.css'

const ubuntu = Ubuntu({
  variable: '--font-ubuntu',
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Gig-store Admin',
  description: 'Administration du magasin Gig-store',
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${ubuntu.variable} ${geistMono.variable}`}>
      <body
        className="antialiased"
      >
        <div className="flex min-h-screen bg-slate-50">
          {/* Sidebar Placeholder */}
          <aside className="w-64 bg-white border-r shadow-sm hidden md:block">
            <div className="p-6">
              <h2 className="text-xl font-bold">Admin</h2>
            </div>
            <nav className="px-4 py-2">
              <ul className="space-y-2">
                <li><a href="/admin" className="block px-4 py-2 rounded-md bg-slate-100 font-medium">Dashboard</a></li>
                <li><a href="/admin/inventory" className="block px-4 py-2 rounded-md hover:bg-slate-50">Inventaire</a></li>
                <li><a href="/admin/orders" className="block px-4 py-2 rounded-md hover:bg-slate-50">Commandes</a></li>
              </ul>
            </nav>
          </aside>
          
          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
