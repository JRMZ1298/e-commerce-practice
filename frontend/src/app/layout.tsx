import type { Metadata } from 'next'
import { Nunito_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'

const nunito = Nunito_Sans({
  subsets: ['latin'],
  variable: '--font-nunito',
  weight: ['400', '600', '700'],
})

export const metadata: Metadata = {
  title: 'STORE - Ropa y Accesorios',
  description: 'Descubre nuestra colección de ropa y accesorios',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={nunito.variable}>
      <body className="font-sans tracking-tight antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
