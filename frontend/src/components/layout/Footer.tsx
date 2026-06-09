import Link from "next/link";
import { Instagram, Facebook, Twitter } from "lucide-react";

const quickLinks = [
  { href: "/products", label: "Todos los productos" },
  { href: "/categories", label: "Categorías" },
  { href: "/orders", label: "Mis pedidos" },
];

const helpLinks = [
  { href: "/contact", label: "Contacto" },
  { href: "/faq", label: "FAQ" },
  { href: "/shipping", label: "Envíos" },
  { href: "/returns", label: "Devoluciones" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-brand-house pt-20 pb-10">
      {/* Giant Background Text */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none select-none z-0">
        <span className="font-bold text-[200px] sm:text-[400px] text-white/[0.03] whitespace-nowrap leading-none">
          MAISON
        </span>
      </div>

      <div className="relative z-10 mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h2 className="mb-4 text-[2.4rem] font-bold tracking-tight text-white">
              MAISON
            </h2>
            <p className="mb-6 text-[1.4rem] leading-relaxed text-white/60">
              Moda con elegancia y distinción. Descubre piezas únicas que
              definen tu estilo.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/60 boty-transition hover:text-white"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/60 boty-transition hover:text-white"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/60 boty-transition hover:text-white"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Enlaces */}
          <div>
            <h3 className="mb-4 font-medium text-white">Enlaces</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[1.4rem] text-white/60 boty-transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ayuda */}
          <div>
            <h3 className="mb-4 font-medium text-white">Ayuda</h3>
            <ul className="space-y-3">
              {helpLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[1.4rem] text-white/60 boty-transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Síguenos */}
          <div>
            <h3 className="mb-4 font-medium text-white">Síguenos</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-[1.4rem] text-white/60 boty-transition hover:text-white"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[1.4rem] text-white/60 boty-transition hover:text-white"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[1.4rem] text-white/60 boty-transition hover:text-white"
                >
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[1.4rem] text-white/60">
              &copy; {new Date().getFullYear()} MAISON. Todos los derechos
              reservados.
            </p>
            <div className="flex gap-6">
              <Link
                href="/"
                className="text-[1.4rem] text-white/60 boty-transition hover:text-white"
              >
                Política de Privacidad
              </Link>
              <Link
                href="/"
                className="text-[1.4rem] text-white/60 boty-transition hover:text-white"
              >
                Términos del Servicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
