'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { Hero } from '@/components/home/Hero'
import { TrustBadges } from '@/components/home/TrustBadges'
import { FeatureSection } from '@/components/home/FeatureSection'
import { Testimonials } from '@/components/home/Testimonials'
import { CTABanner } from '@/components/home/CTABanner'
import { Newsletter } from '@/components/home/Newsletter'
import { ProductCard } from '@/components/products/ProductCard'
import { productsApi } from '@/lib/api/products'

export default function HomePageClient() {
  const { data: featuredData, isLoading } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productsApi.getProducts({ featured: true, size: 4 }),
  })

  const products = featuredData?.content ?? []

  return (
    <main className="-mt-[100px]">
      <Hero />
      <TrustBadges />

      {/* Featured Products */}
      <section className="bg-white py-24">
        <div className="mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="mb-16 text-center">
            <span className="mb-4 block text-[1.4rem] tracking-[0.3em] uppercase text-brand-accent">
              Destacados
            </span>
            <h2 className="text-balance mb-4 text-4xl font-bold leading-tight text-foreground md:text-7xl">
              Productos destacados
            </h2>
            <p className="mx-auto max-w-md text-[1.6rem] text-muted-foreground">
              Lo más popular de nuestra colección
            </p>
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-brand-accent" />
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* View All Button */}
          <div className="mt-12 text-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-accent/20 px-8 py-4 text-[1.4rem] tracking-wide text-foreground boty-transition hover:bg-brand-green/5"
            >
              Ver colección completa
            </Link>
          </div>
        </div>
      </section>

      <FeatureSection />
      <Testimonials />
      <CTABanner />
      <Newsletter />
    </main>
  )
}