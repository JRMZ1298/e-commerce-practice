import type { Metadata } from 'next'
import CatalogPageClient from './page-client'

export const metadata: Metadata = {
  title: 'Colección | MAISON',
  description: 'Explora nuestra colección completa de ropa y accesorios MAISON',
  openGraph: {
    title: 'Colección | MAISON',
    description: 'Explora nuestra colección completa de ropa y accesorios MAISON',
  },
}

export default function CatalogPage() {
  return <CatalogPageClient />
}
