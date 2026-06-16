'use client'

import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setEmail('')
    }
  }

  return (
    <section className="py-24 relative" style={{ backgroundColor: '#5D4037' }}>
      <div className="mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl leading-tight text-white mb-4 text-balance md:text-7xl font-bold">
            Únete a la comunidad
          </h2>
          <p className="text-[1.6rem] text-white/80 mb-10">
            Suscríbete para recibir ofertas exclusivas, novedades y acceso anticipado a nuevas colecciones.
          </p>

          {isSubscribed ? (
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-8 py-4">
              <Check className="w-5 h-5 text-white" />
              <span className="text-white">¡Bienvenido a la familia MAISON!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Tu correo electrónico"
                placeholder="Tu correo electrónico"
                className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-4 text-white placeholder:text-white/50 focus:outline-none focus:border-white/40 boty-transition"
                required
              />
              <button
                type="submit"
                className="group inline-flex items-center justify-center gap-2 bg-white text-brand-green px-8 py-4 rounded-full text-[1.4rem] tracking-wide boty-transition hover:bg-white/90"
              >
                Suscribirme
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 boty-transition" />
              </button>
            </form>
          )}

          <p className="text-[1.4rem] text-white/60 mt-6">
            Puedes cancelar tu suscripción en cualquier momento. Respetamos tu privacidad.
          </p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-[#5D4037] to-brand-house pointer-events-none" />
    </section>
  )
}
