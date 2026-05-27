'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'

const links = [
  { href: '/', label: 'Inicio' },
  { href: '/products', label: 'Tienda' },
  { href: '/categories', label: 'Categorías' },
  { href: '/about', label: 'Nosotros' },
]

interface NavbarProps {
  className?: string
  onClick?: () => void
}

export function Navbar({ className, onClick }: NavbarProps) {
  const pathname = usePathname()

  return (
    <nav className={cn('flex items-center gap-1', className)}>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onClick}
          className={cn(
            'rounded-pill px-4 py-2 text-[1.4rem] font-semibold tracking-tight transition-all',
            pathname === link.href
              ? 'bg-brand-green text-white'
              : 'text-foreground hover:bg-brand-green/5'
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
