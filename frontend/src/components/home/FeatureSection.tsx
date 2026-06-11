'use client'

import { useState, useCallback } from 'react'
import { Shirt, Sparkles, Repeat, Gem } from 'lucide-react'

const features = [
  {
    icon: Shirt,
    title: 'Diseño Exclusivo',
    description: 'Piezas únicas seleccionadas para ti',
  },
  {
    icon: Sparkles,
    title: 'Calidad Superior',
    description: 'Materiales premium y acabados impecables',
  },
  {
    icon: Repeat,
    title: 'Moda Sostenible',
    description: 'Comprometidos con el medio ambiente',
  },
  {
    icon: Gem,
    title: 'Elegancia Atemporal',
    description: 'Estilo que trasciende temporadas',
  },
]

export function FeatureSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [headerVisible, setHeaderVisible] = useState(false)

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

  const headerRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="py-24 bg-background">
      <div className="mx-auto px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <span
            className={`text-[1.4rem] tracking-[0.3em] uppercase text-brand-accent mb-4 block ${
              headerVisible ? 'animate-blur-in opacity-0' : 'opacity-0'
            }`}
            style={headerVisible ? { animationDelay: '0.2s', animationFillMode: 'forwards' } : {}}
          >
            Experiencia MAISON
          </span>
          <h2
            className={`text-4xl leading-tight text-foreground mb-4 text-balance md:text-7xl ${
              headerVisible ? 'animate-blur-in opacity-0' : 'opacity-0'
            }`}
            style={headerVisible ? { animationDelay: '0.4s', animationFillMode: 'forwards' } : {}}
          >
            Por qué elegirnos
          </h2>
        </div>

        {/* Feature Cards */}
        <div
          ref={sectionRef}
          className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
        >
          {/* Bento Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {features.slice(0, 2).map((feature, index) => (
              <div
                key={feature.title}
                className={`rounded-2xl p-6 md:p-8 flex flex-col bg-white boty-shadow transition-all duration-700 ease-out ${
                  isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-green/10 mb-4">
                  <feature.icon className="w-6 h-6 text-brand-green" />
                </div>
                <h3 className="text-[1.8rem] font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-[1.4rem] text-muted-foreground">{feature.description}</p>
              </div>
            ))}
            <div
              className={`md:col-span-2 rounded-2xl p-6 md:p-8 bg-gradient-to-br from-brand-house to-brand-uplift text-white boty-shadow transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              <h3 className="text-[2rem] md:text-[2.4rem] font-bold mb-3">Estilo que habla por ti</h3>
              <p className="text-white/80 text-[1.4rem] leading-relaxed">
                Cada prenda cuenta una historia. Descubre piezas cuidadosamente seleccionadas para quienes valoran la autenticidad y la calidad.
              </p>
            </div>
          </div>

          {/* Content */}
          <div
            className={`transition-all duration-700 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            <span className="text-[1.4rem] tracking-[0.3em] uppercase text-brand-accent mb-4 block">
              Nuestra Filosofía
            </span>
            <h2 className="text-4xl leading-tight text-foreground mb-6 text-balance md:text-5xl">
              Moda con propósito
            </h2>
            <p className="text-[1.6rem] text-muted-foreground leading-relaxed mb-10 max-w-md">
              Creemos que la moda debe ser una expresión de identidad, no solo una tendencia. Cada colección es cuidadosamente curada para ofrecerte lo mejor en estilo y calidad.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {features.slice(2).map((feature) => (
                <div
                  key={feature.title}
                  className="group p-5 boty-transition hover:scale-[1.02] rounded-md bg-white boty-shadow"
                >
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full mb-3 bg-brand-green/10">
                    <feature.icon className="w-5 h-5 text-brand-green" />
                  </div>
                  <h3 className="font-medium text-foreground mb-1">{feature.title}</h3>
                  <p className="text-[1.4rem] text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
