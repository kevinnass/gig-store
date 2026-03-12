import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gig-store Admin',
  description: 'Administration du magasin Gig-store',
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
