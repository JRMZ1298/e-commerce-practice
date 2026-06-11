import type { Metadata } from 'next'
import HomePageClient from './page-client'

export const metadata: Metadata = {
  title: 'Inicio | MAISON',
  description: 'Descubre nuestra colección exclusiva de ropa y accesorios con estilo y elegancia',
  openGraph: {
    title: 'Inicio | MAISON',
    description: 'Descubre nuestra colección exclusiva de ropa y accesorios con estilo y elegancia',
  },
}

export default function HomePage() {
  return <HomePageClient />
}
