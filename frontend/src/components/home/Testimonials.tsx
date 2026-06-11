'use client'

import { useState, useCallback } from 'react'
import { Star } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Ana G.',
    location: 'Ciudad de México',
    rating: 5,
    text: 'La calidad de las prendas es excepcional. Desde que descubrí MAISON, no he dejado de comprar aquí.',
    product: 'Colección Otoño',
  },
  {
    id: 2,
    name: 'Carlos M.',
    location: 'Monterrey',
    rating: 5,
    text: 'Los materiales son increíbles y el diseño es justo lo que buscaba. Definitivamente mi tienda favorita.',
    product: 'Camisas',
  },
  {
    id: 3,
    name: 'María F.',
    location: 'Guadalajara',
    rating: 5,
    text: 'El servicio al cliente es excelente y la ropa llega en tiempo récord. Muy recomendada.',
    product: 'Accesorios',
  },
  {
    id: 4,
    name: 'Pedro L.',
    location: 'Puebla',
    rating: 5,
    text: 'La atención al detalle en cada prenda es notable. Se nota que eligen cuidadosamente cada pieza.',
    product: 'Trajes',
  },
  {
    id: 5,
    name: 'Laura S.',
    location: 'Querétaro',
    rating: 5,
    text: 'Me encanta que tengan opciones sostenibles. La moda consciente sí existe y MAISON lo demuestra.',
    product: 'Colección Eco',
  },
  {
    id: 6,
    name: 'Diego R.',
    location: 'Tijuana',
    rating: 5,
    text: 'Comprar en MAISON es una experiencia. Desde el empaque hasta la calidad del producto, todo es premium.',
    product: 'Accesorios',
  },
  {
    id: 7,
    name: 'Sofía H.',
    location: 'Cancún',
    rating: 5,
    text: 'Los precios son justos para la calidad que ofrecen. Además, los cambios son muy fáciles de gestionar.',
    product: 'Vestidos',
  },
  {
    id: 8,
    name: 'Andrés P.',
    location: 'San Luis Potosí',
    rating: 5,
    text: 'Descubrí MAISON por recomendación y ahora entiendo por qué todos hablan tan bien. Excelente marca.',
    product: 'Camisas',
  },
  {
    id: 9,
    name: 'Valeria N.',
    location: 'Mérida',
    rating: 5,
    text: 'La colección de invierno es simplemente espectacular. Cada prenda es una obra de arte.',
    product: 'Colección Invierno',
  },
]

const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => (
  <div
    className="rounded-3xl p-6 bg-white mb-4 flex-shrink-0 boty-shadow"
  >
    <div className="flex gap-1 mb-3">
      {Array.from({ length: testimonial.rating }).map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-brand-gold text-brand-gold" />
      ))}
    </div>
    <p className="text-foreground/80 leading-relaxed mb-4 text-pretty font-medium text-[1.8rem] tracking-wide">
      &ldquo;{testimonial.text}&rdquo;
    </p>
    <div className="flex items-start justify-between gap-2">
      <div>
        <p className="text-foreground text-[1.4rem] font-bold">{testimonial.name}</p>
        <p className="text-xs text-muted-foreground">{testimonial.location}</p>
      </div>
      <span className="text-xs tracking-wide text-brand-accent/70 bg-brand-accent/5 px-2 py-1 rounded-full whitespace-nowrap">
        {testimonial.product}
      </span>
    </div>
  </div>
)

export function Testimonials() {
  const [headerVisible, setHeaderVisible] = useState(false)

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

  const column1 = [testimonials[0], testimonials[3], testimonials[6]]
  const column2 = [testimonials[1], testimonials[4], testimonials[7]]
  const column3 = [testimonials[2], testimonials[5], testimonials[8]]

  return (
    <section className="py-24 bg-[#f2f0eb] overflow-hidden pb-24 pt-12">
      <div className="mx-auto px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <span
            className={`text-[1.4rem] tracking-[0.3em] uppercase text-brand-accent mb-4 block ${
              headerVisible ? 'animate-blur-in opacity-0' : 'opacity-0'
            }`}
            style={headerVisible ? { animationDelay: '0.2s', animationFillMode: 'forwards' } : {}}
          >
            Testimonios
          </span>
          <h2
            className={`text-4xl leading-tight text-foreground text-balance md:text-7xl ${
              headerVisible ? 'animate-blur-in opacity-0' : 'opacity-0'
            }`}
            style={headerVisible ? { animationDelay: '0.4s', animationFillMode: 'forwards' } : {}}
          >
            Lo que dicen nuestros clientes
          </h2>
        </div>

        {/* Scrolling Testimonials */}
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#f2f0eb] to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#f2f0eb] to-transparent z-10 pointer-events-none" />

          {/* Mobile - Single Column */}
          <div className="md:hidden h-[600px]">
            <div className="relative overflow-hidden h-full">
              <div className="animate-scroll-down hover:animate-scroll-down-slow">
                {[...testimonials, ...testimonials].map((testimonial, index) => (
                  <TestimonialCard key={`mobile-${testimonial.id}-${index}`} testimonial={testimonial} />
                ))}
              </div>
            </div>
          </div>

          {/* Desktop - Three Columns */}
          <div className="hidden md:grid md:grid-cols-3 gap-4 h-[600px]">
            <div className="relative overflow-hidden">
              <div className="animate-scroll-down hover:animate-scroll-down-slow">
                {[...column1, ...column1].map((testimonial, index) => (
                  <TestimonialCard key={`col1-${testimonial.id}-${index}`} testimonial={testimonial} />
                ))}
              </div>
            </div>
            <div className="relative overflow-hidden">
              <div className="animate-scroll-up hover:animate-scroll-up-slow">
                {[...column2, ...column2].map((testimonial, index) => (
                  <TestimonialCard key={`col2-${testimonial.id}-${index}`} testimonial={testimonial} />
                ))}
              </div>
            </div>
            <div className="relative overflow-hidden">
              <div className="animate-scroll-down hover:animate-scroll-down-slow">
                {[...column3, ...column3].map((testimonial, index) => (
                  <TestimonialCard key={`col3-${testimonial.id}-${index}`} testimonial={testimonial} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
