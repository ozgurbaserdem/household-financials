import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import ClientI18nProvider from '@/components/ClientI18nProvider'
import LanguageSwitcher from '@/components/LanguageSwitcher'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Financial Calculator',
  description: 'A comprehensive financial calculator application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sv">
      <body className={inter.className}>
        <ClientI18nProvider>
          <Providers>
            {children}
            <LanguageSwitcher />
          </Providers>
        </ClientI18nProvider>
      </body>
    </html>
  )
} 