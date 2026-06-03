'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingBag, ClipboardList, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils/cn'

const menuItems = [
  { label: 'Carrito', href: '/cart', icon: ShoppingBag },
  { label: 'Pedidos', href: '/orders', icon: ClipboardList, requiresAuth: true },
]

export function FrapButton() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handleToggle = useCallback(() => {
    setOpen((prev) => !prev)
  }, [])

  const handleNavigate = useCallback(
    (href: string) => {
      setOpen(false)
      router.push(href)
    },
    [router]
  )

  const visibleItems = menuItems.filter(
    (item) => !item.requiresAuth || isAuthenticated
  )

  return (
    <div ref={ref} className="fixed bottom-6 right-6 z-50">
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 -z-10"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Menu items in circular arrangement */}
      <div className="absolute bottom-16 right-0 flex flex-col items-end gap-3">
        {visibleItems.map((item, index) => {
          const Icon = item.icon
          const delay = `${(visibleItems.length - 1 - index) * 50}ms`
          return (
            <button
              key={item.href}
              type="button"
              onClick={() => handleNavigate(item.href)}
              className={cn(
                'flex items-center gap-3 rounded-full bg-white pr-5 pl-3 py-2.5 shadow-lg transition-all duration-200 group',
                open ? 'pointer-events-auto' : 'pointer-events-none'
              )}
              style={{
                opacity: open ? 1 : 0,
                transform: open ? 'translateX(0)' : 'translateX(20px)',
                transitionDelay: delay,
              }}
            >
              <span className="text-[1.3rem] font-medium text-foreground whitespace-nowrap group-hover:text-white transition-colors">
                {item.label}
              </span>
              <Icon className="h-5 w-5 text-brand-accent group-hover:text-white transition-colors" />
            </button>
          )
        })}
      </div>

      {/* Main FAB */}
      <button
        type="button"
        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        onClick={handleToggle}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-accent text-white shadow-lg transition-all duration-200 active:scale-95 hover:bg-brand-accent/90"
        style={{
          boxShadow: open
            ? '0 0 6px rgba(0,0,0,0.24), 0 8px 12px rgba(0,0,0,0.14)'
            : '0 4px 10px rgba(0,0,0,0.25), 0 8px 20px rgba(0,0,0,0.15)',
        }}
      >
        {open ? (
          <X className="h-6 w-6 transition-transform duration-200 rotate-90" />
        ) : (
          <ShoppingBag className="h-6 w-6 transition-transform duration-200" />
        )}
      </button>
    </div>
  )
}
