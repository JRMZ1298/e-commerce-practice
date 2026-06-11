'use client'

import { useState, useCallback } from 'react'
import { Truck, Shield, RefreshCw, Sparkles } from 'lucide-react'

const badges = [
  {
    icon: Truck,
    title: 'Envío gratis',
    description: 'En pedidos mayores a $999 MXN',
  },
  {
    icon: Shield,
    title: 'Pago seguro',
    description: 'Compra con total confianza',
  },
  {
    icon: RefreshCw,
    title: 'Cambios gratis',
    description: '30 días para cambiar',
  },
  {
    icon: Sparkles,
    title: 'Calidad premium',
    description: 'Materiales seleccionados',
  },
]

export function TrustBadges() {
  const [isVisible, setIsVisible] = useState(false)

  const sectionRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="py-20 bg-background" style={{ backgroundColor: '#f2f0eb' }}>
      <div className="mx-auto px-6 lg:px-8">
        <div ref={sectionRef} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((badge, index) => (
            <div
              key={badge.title}
              className={`bg-white p-6 lg:p-8 text-center rounded-xl transition-all duration-700 ease-out boty-shadow ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <badge.icon className="text-brand-accent mb-4 mx-auto size-12" strokeWidth={1} />
              <h3 className="text-foreground mb-2 text-[2rem] font-semibold">{badge.title}</h3>
              <p className="text-[1.4rem] text-muted-foreground">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
