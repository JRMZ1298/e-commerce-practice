import type { Metadata } from 'next'
import CheckoutPageClient from './page-client'

export const metadata: Metadata = {
  title: 'Checkout | MAISON',
  description: 'Completa tu compra en MAISON de forma segura',
  openGraph: {
    title: 'Checkout | MAISON',
    description: 'Completa tu compra en MAISON de forma segura',
  },
}

export default function CheckoutPage() {
  return <CheckoutPageClient />
}
