import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gig-store Admin',
  description: 'Administration du magasin Gig-store',
};

import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { headers } from 'next/headers'

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers()
  const pathname = headersList.get('x-invoke-path') || ''
  const isLoginPage = pathname === '/admin/login'

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
