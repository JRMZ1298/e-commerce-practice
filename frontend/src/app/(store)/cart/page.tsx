import type { Metadata } from 'next'
import CartPageClient from './page-client'

export const metadata: Metadata = {
  title: 'Carrito | MAISON',
  description: 'Revisa y gestiona tu carrito de compras en MAISON',
  openGraph: {
    title: 'Carrito | MAISON',
    description: 'Revisa y gestiona tu carrito de compras en MAISON',
  },
}

export default function CartPage() {
  return <CartPageClient />
}
