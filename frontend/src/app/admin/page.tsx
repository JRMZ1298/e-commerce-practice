'use client'

import {
  ShoppingBag,
  ClipboardList,
  Users,
  DollarSign,
  Clock,
  AlertTriangle,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { adminApi } from '@/lib/api/admin'
import { formatPrice } from '@/lib/utils/formatPrice'
import { cn } from '@/lib/utils/cn'
import Link from 'next/link'
import type { DashboardStats } from '@/types/admin'

const statCards: Array<{
  key: keyof DashboardStats
  label: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  href?: string
  format?: boolean
}> = [
  { key: 'totalOrders', label: 'Pedidos totales', icon: ClipboardList, color: 'text-blue-600 bg-blue-50', href: '/admin/orders' },
  { key: 'totalProducts', label: 'Productos', icon: ShoppingBag, color: 'text-purple-600 bg-purple-50', href: '/admin/products' },
  { key: 'totalUsers', label: 'Usuarios', icon: Users, color: 'text-green-600 bg-green-50', href: '/admin/users' },
  { key: 'totalRevenue', label: 'Ingresos totales', icon: DollarSign, color: 'text-emerald-600 bg-emerald-50', format: true },
  { key: 'pendingOrders', label: 'Pedidos pendientes', icon: Clock, color: 'text-yellow-600 bg-yellow-50', href: '/admin/orders' },
  { key: 'lowStockProducts', label: 'Stock bajo', icon: AlertTriangle, color: 'text-red-600 bg-red-50', href: '/admin/products' },
]

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminApi.getDashboardStats,
    refetchInterval: 30_000,
  })

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="font-serif text-[2.4rem] font-bold text-foreground">Dashboard</h1>
        <p className="text-[1.3rem] text-muted-foreground">Resumen de la tienda</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon
          const value = stats ? stats[stat.key] : 0
          const display =
            stat.format && typeof value === 'number'
              ? formatPrice(value)
              : String(value)
          const card = (
            <div className="rounded-xl bg-white p-6 boty-shadow transition-all hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[1.3rem] text-muted-foreground">{stat.label}</p>
                  <p className="text-[2rem] font-bold text-foreground">{display}</p>
                </div>
                <div className={cn('flex h-12 w-12 items-center justify-center rounded-full', stat.color)}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          )
          if (stat.href) {
            return <Link key={stat.key} href={stat.href}>{card}</Link>
          }
          return <div key={stat.key}>{card}</div>
        })}
      </div>
    </div>
  )
}
