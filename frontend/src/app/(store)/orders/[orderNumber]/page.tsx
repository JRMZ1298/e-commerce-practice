import type { Metadata } from 'next'
import OrderDetailPageClient from './page-client'

export async function generateMetadata({ params }: { params: { orderNumber: string } }): Promise<Metadata> {
  return {
    title: `Pedido ${params.orderNumber} | MAISON`,
    description: `Detalle del pedido ${params.orderNumber} en MAISON`,
  }
}

export default function OrderDetailPage() {
  return <OrderDetailPageClient />
}
