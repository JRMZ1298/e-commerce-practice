import Link from 'next/link'
import { Instagram, Facebook, Twitter } from 'lucide-react'

const quickLinks = [
  { href: '/products', label: 'Todos los productos' },
  { href: '/categories', label: 'Categorías' },
  { href: '/orders', label: 'Mis pedidos' },
  { href: '/about', label: 'Sobre nosotros' },
]

const helpLinks = [
  { href: '/contact', label: 'Contacto' },
  { href: '/faq', label: 'FAQ' },
  { href: '/shipping', label: 'Envíos' },
  { href: '/returns', label: 'Devoluciones' },
]

export function Footer() {
  return (
    <footer className="bg-brand-house text-white">
      <div className="mx-auto max-w-[1440px] px-4 py-9 sm:px-6 lg:px-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-[2rem] font-bold tracking-tight text-white">STORE</h3>
            <p className="text-[1.4rem] text-foreground-white-soft">
              Tu tienda de ropa y accesorios con los mejores estilos y tendencias.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-[1.3rem] font-semibold uppercase tracking-looser text-brand-gold">
              Enlaces rápidos
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[1.4rem] text-foreground-white-soft transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[1.3rem] font-semibold uppercase tracking-looser text-brand-gold">
              Ayuda
            </h4>
            <ul className="space-y-2">
              {helpLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[1.4rem] text-foreground-white-soft transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[1.3rem] font-semibold uppercase tracking-looser text-brand-gold">
              Síguenos
            </h4>
            <div className="flex gap-3">
              <a
                href="#"
                aria-label="Instagram"
                className="rounded-pill p-2 text-foreground-white-soft transition-colors hover:bg-white/10 hover:text-white"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="rounded-pill p-2 text-foreground-white-soft transition-colors hover:bg-white/10 hover:text-white"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="rounded-pill p-2 text-foreground-white-soft transition-colors hover:bg-white/10 hover:text-white"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-9 border-t border-white/10 pt-6 text-center text-[1.3rem] text-foreground-white-soft">
          &copy; {new Date().getFullYear()} STORE. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
