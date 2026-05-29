'use client'

import Link from 'next/link'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import { Hero } from '@/components/home/Hero'
import { TrustBadges } from '@/components/home/TrustBadges'
import { FeatureSection } from '@/components/home/FeatureSection'
import { Testimonials } from '@/components/home/Testimonials'
import { CTABanner } from '@/components/home/CTABanner'
import { Newsletter } from '@/components/home/Newsletter'
import { useCart } from '@/hooks/useCart'

const products = [
  {
    id: '1',
    name: 'Camisa Premium',
    description: 'Algodón egipcio de primera calidad',
    price: 1299,
    originalPrice: 1599,
    image: null,
    badge: 'Nuevo',
    category: 'camisas',
  },
  {
    id: '2',
    name: 'Vestido Elegante',
    description: 'Corte moderno y diseño exclusivo',
    price: 2499,
    originalPrice: null,
    image: null,
    badge: 'Más vendido',
    category: 'vestidos',
  },
  {
    id: '3',
    name: 'Chaqueta Cuero',
    description: 'Cuero genuino italiano',
    price: 5499,
    originalPrice: 6499,
    image: null,
    badge: 'Oferta',
    category: 'chaquetas',
  },
  {
    id: '4',
    name: 'Accesorios Set',
    description: 'Juego de 3 piezas elegantes',
    price: 899,
    originalPrice: null,
    image: null,
    badge: 'Nuevo',
    category: 'accesorios',
  },
]

const categories = [
  { value: 'camisas', label: 'Camisas' },
  { value: 'vestidos', label: 'Vestidos' },
  { value: 'chaquetas', label: 'Chaquetas' },
  { value: 'accesorios', label: 'Accesorios' },
]

export default function HomePage() {
  const { addItem } = useCart()

  return (
    <main>
      <Hero />
      <TrustBadges />

      {/* Featured Products */}
      <section className="py-24 bg-white">
        <div className="mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-[1.4rem] tracking-[0.3em] uppercase text-brand-accent mb-4 block">
              Destacados
            </span>
            <h2 className="text-4xl leading-tight text-foreground mb-4 text-balance md:text-7xl font-bold">
              Productos destacados
            </h2>
            <p className="text-[1.6rem] text-muted-foreground max-w-md mx-auto">
              Lo más popular de nuestra colección
            </p>
          </div>

          {/* Product Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group transition-all duration-500 ease-out opacity-100 scale-100"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <div className="bg-background rounded-3xl overflow-hidden boty-shadow boty-transition group-hover:scale-[1.02]">
                  {/* Image */}
                  <div className="relative aspect-square bg-muted overflow-hidden" style={{ backgroundColor: '#edebe9' }}>
                    {product.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover boty-transition group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground/20">
                        <ShoppingBag className="w-16 h-16" />
                      </div>
                    )}
                    {/* Badge */}
                    {product.badge && (
                      <span
                        className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs tracking-wide bg-white text-black ${
                          product.badge === 'Oferta'
                            ? 'bg-red-50 text-red-500'
                            : product.badge === 'Nuevo'
                            ? 'bg-brand-accent/10 text-brand-accent'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {product.badge}
                      </span>
                    )}
                    {/* Quick add button */}
                    <button
                      type="button"
                      className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 boty-transition boty-shadow"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        addItem({
                          id: product.id,
                          productName: product.name,
                          variantName: product.description,
                          unitPrice: product.price,
                          imageUrl: product.image || '',
                          quantity: 1,
                          totalPrice: product.price,
                          variantId: product.id,
                        })
                      }}
                      aria-label="Add to cart"
                    >
                      <ShoppingBag className="w-4 h-4 text-foreground" />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="text-[1.6rem] text-foreground mb-1 font-semibold">{product.name}</h3>
                    <p className="text-[1.4rem] text-muted-foreground mb-3">{product.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-[1.4rem] text-muted-foreground line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 border border-brand-accent/20 text-foreground px-8 py-4 rounded-full text-[1.4rem] tracking-wide boty-transition hover:bg-brand-green/5"
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
