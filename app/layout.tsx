import type { Metadata } from 'next';
import { Ubuntu, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from "@/components/theme-provider"


const ubuntu = Ubuntu({
  variable: '--font-ubuntu',
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Gig-store',
  description: 'E‑commerce premium',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${ubuntu.variable} ${geistMono.variable}`}>
      <body className="antialiased min-h-screen flex flex-col text-slate-900 dark:text-slate-50">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
