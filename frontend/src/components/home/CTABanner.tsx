'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function CTABanner() {
  const [isVisible, setIsVisible] = useState(false)
  const bannerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (bannerRef.current) {
      observer.observe(bannerRef.current)
    }

    return () => {
      if (bannerRef.current) {
        observer.unobserve(bannerRef.current)
      }
    }
  }, [])

  return (
    <section className="py-24 bg-background" style={{ backgroundColor: '#f2f0eb' }}>
      <div className="mx-auto px-6 lg:px-8">
        <div
          ref={bannerRef}
          className={`rounded-3xl p-12 md:p-16 flex flex-col justify-center relative overflow-hidden min-h-[300px] bg-gradient-to-br from-brand-house to-brand-uplift transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className="relative z-10 text-left max-w-2xl">
            <h3 className="text-4xl md:text-5xl text-white mb-4 font-bold">
              ¿Listo para renovar tu estilo?
            </h3>
            <p className="text-[1.6rem] text-white/80 mb-8">
              Regístrate y recibe 10% de descuento en tu primera compra
            </p>

            <Link
              href="/register"
              className="group inline-flex items-center justify-center gap-3 bg-white text-brand-green px-8 py-4 rounded-full text-[1.4rem] tracking-wide boty-transition hover:bg-white/90 boty-shadow"
            >
              Crear cuenta gratis
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 boty-transition" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
