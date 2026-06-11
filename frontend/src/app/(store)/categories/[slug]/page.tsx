import type { Metadata } from 'next'
import CategoryPageClient from './page-client'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return {
    title: `${params.slug} | Categorías | MAISON`,
    description: `Explora productos en la categoría ${params.slug} en MAISON`,
  }
}

export default function CategoryPage() {
  return <CategoryPageClient />
}
