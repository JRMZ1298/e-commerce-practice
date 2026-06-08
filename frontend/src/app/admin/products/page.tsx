'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Plus, ChevronRight, Loader2, Search } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { adminApi } from '@/lib/api/admin'
import { formatPrice } from '@/lib/utils/formatPrice'
import { cn } from '@/lib/utils/cn'
import type { ProductListDto } from '@/types/product'

export default function AdminProductsPage() {
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', page],
    queryFn: () => adminApi.getProducts(page, 20),
  })

  const products = data?.content ?? []
  const totalPages = data?.totalPages ?? 0

  const filtered = search
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.brand?.toLowerCase().includes(search.toLowerCase()),
      )
    : products

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-[2.4rem] font-bold text-foreground">Productos</h1>
          <p className="text-[1.3rem] text-muted-foreground">Gestiona el catálogo de productos</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-full bg-brand-accent px-5 py-2.5 text-[1.3rem] font-medium text-white transition-all hover:bg-brand-accent/90"
        >
          <Plus className="h-4 w-4" />
          Nuevo producto
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field w-full pl-10 pr-4 py-2.5 text-[1.4rem]"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <ShoppingBag className="mb-4 h-12 w-12 text-muted-foreground/30" />
          <p className="text-[1.4rem] text-muted-foreground">No hay productos</p>
          <Link
            href="/admin/products/new"
            className="btn-primary mt-4 px-6 py-3 text-[1.3rem]"
          >
            Crear primer producto
          </Link>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-xl bg-white boty-shadow">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border text-[1.2rem] text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Producto</th>
                  <th className="px-5 py-3 font-medium">SKU</th>
                  <th className="px-5 py-3 font-medium">Precio</th>
                  <th className="px-5 py-3 font-medium">Stock</th>
                  <th className="px-5 py-3 font-medium">Estado</th>
                  <th className="px-5 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                          {product.primaryImage ? (
                            <img src={product.primaryImage} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full items-center justify-center text-muted-foreground/20">
                              <ShoppingBag className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground">{product.name}</p>
                          {product.brand && (
                            <p className="text-[1.2rem] text-muted-foreground">{product.brand}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[1.3rem] text-muted-foreground font-mono">
                      {product.slug}
                    </td>
                    <td className="px-5 py-4 text-[1.3rem] font-medium text-foreground">
                      {formatPrice(product.basePrice)}
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn(
                        'text-[1.3rem] font-medium',
                        product.stock === 0 ? 'text-red-500' : product.stock <= 5 ? 'text-yellow-600' : 'text-foreground',
                      )}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn(
                        'inline-flex rounded-full px-3 py-0.5 text-[1.1rem] font-medium',
                        product.stock === 0 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600',
                      )}>
                        {product.stock === 0 ? 'Agotado' : 'Activo'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="flex items-center gap-1 text-[1.2rem] text-brand-accent hover:underline"
                      >
                        Editar <ChevronRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="btn-outline px-3 py-2 text-[1.3rem] disabled:opacity-30"
              >
                Anterior
              </button>
              <span className="text-[1.3rem] text-muted-foreground">
                Página {page + 1} de {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="btn-outline px-3 py-2 text-[1.3rem] disabled:opacity-30"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
