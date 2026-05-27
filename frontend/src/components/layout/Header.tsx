'use client'

import Link from 'next/link'
import { Search, Heart, ShoppingBag, Menu, X, User } from 'lucide-react'
import { Navbar } from './Navbar'
import { useCart } from '@/hooks/useCart'
import { useUIStore } from '@/stores/uiStore'
import { cn } from '@/lib/utils/cn'

export function Header() {
  const { totalItems, toggleCart } = useCart()
  const { mobileMenuOpen, toggleMobileMenu } = useUIStore()

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white shadow-nav">
      <div className="mx-auto flex h-[64px] items-center justify-between px-4 sm:h-[72px] sm:px-6 lg:h-[83px] lg:px-10">
        <Link href="/" className="text-[2rem] font-bold tracking-tight text-brand-green">
          STORE
        </Link>

        <Navbar className="hidden md:flex" />

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Buscar"
            className="rounded-pill p-2 text-foreground-muted transition-colors hover:bg-brand-green/5 hover:text-foreground"
          >
            <Search className="h-5 w-5" />
          </button>

          <Link
            href="/wishlist"
            aria-label="Favoritos"
            className="rounded-pill p-2 text-foreground-muted transition-colors hover:bg-brand-green/5 hover:text-foreground"
          >
            <Heart className="h-5 w-5" />
          </Link>

          <button
            type="button"
            onClick={toggleCart}
            aria-label="Carrito"
            className="relative rounded-pill p-2 text-foreground-muted transition-colors hover:bg-brand-green/5 hover:text-foreground"
          >
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-accent px-1 text-[10px] font-bold text-white">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </button>

          <Link
            href="/login"
            aria-label="Iniciar sesión"
            className="btn-dark-outline ml-1 hidden text-[1.3rem] sm:inline-flex"
          >
            <User className="mr-1.5 h-4 w-4" />
            <span>Ingresar</span>
          </Link>

          <button
            type="button"
            onClick={toggleMobileMenu}
            aria-label="Menú"
            className="rounded-pill p-2 text-foreground-muted transition-colors hover:bg-brand-green/5 md:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          'overflow-hidden border-t border-ceramic bg-white transition-all duration-300 md:hidden',
          mobileMenuOpen ? 'max-h-80' : 'max-h-0'
        )}
      >
        <div className="px-4 py-4">
          <Navbar
            className="flex-col items-start gap-2"
            onClick={toggleMobileMenu}
          />
          <div className="mt-4 flex flex-col gap-3">
            <Link
              href="/login"
              onClick={toggleMobileMenu}
              className="flex w-full items-center justify-center gap-2 rounded-pill border border-brand-green px-4 py-2 text-sm font-semibold text-brand-green transition-all active:scale-95"
            >
              <User className="h-4 w-4" />
              Ingresar
            </Link>
            <Link
              href="/register"
              onClick={toggleMobileMenu}
              className="btn-black flex w-full items-center justify-center gap-2"
            >
              Unirme
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
