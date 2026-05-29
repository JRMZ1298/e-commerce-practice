'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles, Shield, Truck, RefreshCw } from 'lucide-react'

const features = [
  { icon: Truck, title: 'Envío gratis', desc: 'En pedidos mayores a $999 MXN' },
  { icon: Shield, title: 'Pago seguro', desc: 'Compra con total confianza' },
  { icon: RefreshCw, title: 'Cambios gratis', desc: '30 días para cambiar' },
  { icon: Sparkles, title: 'Calidad premium', desc: 'Materiales seleccionados' },
]

export default function HomePage() {
  return (
    <>
      {/* HERO — asymmetric 40/60 split */}
      <section className="bg-canvas">
        <div className="mx-auto flex max-w-[1440px] flex-col md:flex-row">
          <div className="h-[280px] w-full bg-gradient-to-br from-brand-uplift to-brand-green md:h-auto md:w-[40%]" />
          <div className="flex w-full items-center px-4 py-9 sm:px-6 md:w-[60%] md:px-10 md:py-[6.4rem] lg:px-16">
            <div className="max-w-[500px]">
              <p className="mb-2 text-[1.3rem] font-semibold uppercase tracking-looser text-brand-green">
                Colección Otoño 2025
              </p>
              <h1 className="text-[2.4rem] font-semibold text-brand-green sm:text-[3.6rem]">
                Tu estilo,
              </h1>
              <h2 className="text-[2.4rem] font-normal text-foreground sm:text-[3.6rem]">
                tu esencia
              </h2>
              <p className="mt-4 text-[1.6rem] text-foreground-muted sm:mt-6">
                Descubre nuestra colección de ropa y accesorios diseñados para
                quienes buscan expresar su personalidad a través de la moda.
              </p>
              <div className="mt-6 flex items-center gap-4 sm:mt-8">
                <Link href="/products" className="btn-primary">
                  Explorar colección
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link href="/categories" className="btn-dark-outline">
                  Ver categorías
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="bg-white py-9 sm:py-[6.4rem]">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
          <div className="mb-8 text-center sm:mb-10">
            <p className="text-[1.4rem] font-semibold uppercase tracking-looser text-brand-green">
              Destacados
            </p>
            <h2 className="mt-2 text-[2.4rem] font-semibold text-brand-green sm:text-[3.6rem]">
              Productos destacados
            </h2>
            <p className="mt-1 text-[1.6rem] text-foreground-muted">
              Lo más popular de nuestra colección
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="group overflow-hidden rounded-card bg-card shadow-card transition-shadow hover:shadow-card-hover"
              >
                <div className="aspect-[3/4] bg-gradient-to-br from-ceramic to-neutral-cool" />
                <div className="p-4">
                  <div className="mb-1 h-3 w-2/3 rounded bg-ceramic" />
                  <div className="mb-2 h-3 w-1/3 rounded bg-ceramic" />
                  <div className="h-5 w-1/4 rounded bg-brand-green/20" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center sm:mt-10">
            <Link href="/products" className="btn-outline">
              Ver colección completa
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURE BAND — House Green */}
      <section className="bg-brand-house py-9 sm:py-[6.4rem]">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
          <div className="mb-8 text-center">
            <p className="text-[1.4rem] font-semibold uppercase tracking-looser text-brand-gold">
              Experiencia MAISON
            </p>
            <h2 className="mt-2 text-[2.4rem] font-semibold text-white sm:text-[3.6rem]">
              Por qué elegirnos
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="text-center text-white">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-1 text-[1.4rem] font-semibold uppercase tracking-looser">
                  {feature.title}
                </h3>
                <p className="text-[1.4rem] text-foreground-white-soft">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — cream */}
      <section className="bg-canvas py-9 sm:py-[6.4rem]">
        <div className="mx-auto max-w-[1440px] px-4 text-center sm:px-6 lg:px-10">
          <p className="text-[1.4rem] font-semibold uppercase tracking-looser text-brand-green">
            Únete
          </p>
          <h2 className="mt-2 text-[2.4rem] font-semibold text-brand-green sm:text-[3.6rem]">
            ¿Listo para renovar tu estilo?
          </h2>
          <p className="mt-2 text-[1.6rem] text-foreground-muted">
            Regístrate y recibe 10% de descuento en tu primera compra
          </p>
          <Link
            href="/register"
            className="btn-primary mt-8 inline-flex"
          >
            Crear cuenta gratis
          </Link>
        </div>
      </section>
    </>
  )
}
