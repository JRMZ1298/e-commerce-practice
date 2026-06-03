'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ClipboardList, ChevronRight, Clock, CheckCircle, XCircle, Truck, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { adminApi } from '@/lib/api/admin'
import { formatPrice } from '@/lib/utils/formatPrice'
import { cn } from '@/lib/utils/cn'

const statusConfig: Record<string, { label: string; color: string }> = {
  AWAITING_PAYMENT: { label: 'Pendiente', color: 'text-yellow-600 bg-yellow-50' },
  CONFIRMED: { label: 'Confirmado', color: 'text-blue-600 bg-blue-50' },
  SHIPPED: { label: 'Enviado', color: 'text-purple-600 bg-purple-50' },
  DELIVERED: { label: 'Entregado', color: 'text-green-600 bg-green-50' },
  CANCELLED: { label: 'Cancelado', color: 'text-red-600 bg-red-50' },
}

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string>('')

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders', statusFilter],
    queryFn: () => adminApi.getOrders(statusFilter ? { status: statusFilter } : undefined),
  })

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-[2.4rem] font-bold text-foreground">Pedidos</h1>
          <p className="text-[1.3rem] text-muted-foreground">Gestiona los pedidos de la tienda</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2">
        {['', 'AWAITING_PAYMENT', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((s) => {
          const cfg = s ? statusConfig[s] : { label: 'Todos', color: '' }
          return (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={cn(
                'rounded-full px-4 py-1.5 text-[1.2rem] font-medium transition-all',
                statusFilter === s
                  ? 'bg-brand-accent text-white'
                  : 'bg-white text-foreground hover:bg-muted'
              )}
            >
              {cfg.label}
            </button>
          )
        })}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
        </div>
      ) : !orders || orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <ClipboardList className="mb-4 h-12 w-12 text-muted-foreground/30" />
          <p className="text-[1.4rem] text-muted-foreground">No hay pedidos</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white boty-shadow">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border text-[1.2rem] text-muted-foreground">
                <th className="px-5 py-3 font-medium">Pedido</th>
                <th className="px-5 py-3 font-medium">Fecha</th>
                <th className="px-5 py-3 font-medium">Cliente</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Estado</th>
                <th className="px-5 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                let customerName = ''
                try {
                  const addr = JSON.parse(order.shippingAddress)
                  customerName = addr.fullName || ''
                } catch {}
                const cfg = statusConfig[order.status] ?? statusConfig.AWAITING_PAYMENT

                return (
                  <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-mono text-[1.3rem] font-medium text-foreground">
                        {order.orderNumber}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[1.3rem] text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('es-MX')}
                    </td>
                    <td className="px-5 py-4 text-[1.3rem] text-foreground">{customerName}</td>
                    <td className="px-5 py-4 text-[1.3rem] font-medium text-foreground">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn('inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-[1.1rem] font-medium', cfg.color)}>
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/orders/${order.orderNumber}`}
                        className="flex items-center gap-1 text-[1.2rem] text-brand-accent hover:underline"
                      >
                        Ver <ChevronRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
