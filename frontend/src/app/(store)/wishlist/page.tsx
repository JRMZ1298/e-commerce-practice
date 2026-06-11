import type { Metadata } from 'next'
import WishlistPageClient from './page-client'

export const metadata: Metadata = {
  title: 'Favoritos | MAISON',
  description: 'Tus productos favoritos guardados en MAISON',
  openGraph: {
    title: 'Favoritos | MAISON',
    description: 'Tus productos favoritos guardados en MAISON',
  },
}

export default function WishlistPage() {
  return <WishlistPageClient />
}
