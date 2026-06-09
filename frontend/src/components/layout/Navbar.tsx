'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const links = [
  { href: '/products', label: 'Colección' },
  { href: '/categories', label: 'Categorías' },
]

interface NavbarProps {
  className?: string
  onClick?: () => void
}

export function Navbar({ className, onClick }: NavbarProps) {
  const pathname = usePathname()

  return (
    <nav className={cn('flex items-center gap-1', className)}>
      <Link
        href="/"
        onClick={onClick}
        className={cn(
          'flex items-center justify-center rounded-pill p-2 transition-all',
          pathname === '/'
            ? 'bg-brand-green text-white'
            : 'text-foreground hover:bg-brand-green/5'
        )}
      >
        <Home className="h-5 w-5" />
      </Link>
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
