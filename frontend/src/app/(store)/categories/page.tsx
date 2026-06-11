import type { Metadata } from 'next'
import CategoriesPageClient from './page-client'

export const metadata: Metadata = {
  title: 'Categorías | MAISON',
  description: 'Explora nuestros productos por categoría en MAISON',
  openGraph: {
    title: 'Categorías | MAISON',
    description: 'Explora nuestros productos por categoría en MAISON',
  },
}

export default function CategoriesPage() {
  return <CategoriesPageClient />
}
