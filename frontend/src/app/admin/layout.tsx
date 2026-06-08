'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  Users,
  LogOut,
  ChevronLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Productos', icon: ShoppingBag },
  { href: '/admin/orders', label: 'Pedidos', icon: ClipboardList },
  { href: '/admin/users', label: 'Usuarios', icon: Users },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated, isLoading, logout } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth?mode=login')
    } else if (!isLoading && isAuthenticated && user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN') {
      router.replace('/')
    }
  }, [isLoading, isAuthenticated, user, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
      </div>
    )
  }

  if (!isAuthenticated || (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN')) return null

  return (
    <div className="flex min-h-screen bg-[#f5f5f0]">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r border-border bg-white">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <Link href="/" className="flex items-center gap-2 text-[1.4rem] font-bold text-foreground">
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
            Tienda
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const isActive = item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-[1.4rem] font-medium transition-colors',
                  isActive
                    ? 'bg-brand-accent/10 text-brand-accent'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="border-t border-border p-4">
          <div className="mb-3 text-[1.2rem] text-muted-foreground">
            {user?.firstName} {user?.lastName}
          </div>
          <button
            type="button"
            onClick={() => { logout(); router.push('/') }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[1.4rem] font-medium text-destructive transition-colors hover:bg-destructive/5"
          >
            <LogOut className="h-5 w-5" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
