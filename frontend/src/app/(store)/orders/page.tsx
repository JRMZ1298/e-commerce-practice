import type { Metadata } from 'next'
import OrdersPageClient from './page-client'

export const metadata: Metadata = {
  title: 'Mis Pedidos | MAISON',
  description: 'Revisa el estado de tus pedidos en MAISON',
  openGraph: {
    title: 'Mis Pedidos | MAISON',
    description: 'Revisa el estado de tus pedidos en MAISON',
  },
}

export default function OrdersPage() {
  return <OrdersPageClient />
}
