import type { Metadata } from 'next'
import ProductDetailPageClient from './page-client'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return {
    title: `${params.slug} | MAISON`,
    description: `Descubre ${params.slug} en MAISON - ropa y accesorios de alta calidad`,
  }
}

export default function ProductDetailPage() {
  return <ProductDetailPageClient />
}
