'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Loader2, XCircle } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { adminApi } from '@/lib/api/admin'
import { ProductForm } from '@/components/admin/ProductForm'

export default function AdminEditProductPage() {
  const params = useParams()
  const id = params.id as string

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['admin-product', id],
    queryFn: () => adminApi.getProductById(id),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
      </div>
    )
  }

  if (isError || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <XCircle className="mb-4 h-12 w-12 text-destructive/40" />
        <h1 className="text-[2rem] font-bold text-foreground">Producto no encontrado</h1>
        <Link href="/admin/products" className="btn-primary mt-4 px-6 py-3 text-[1.3rem]">
          Volver a productos
        </Link>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-[1.3rem] text-brand-accent hover:underline"
        >
          <ChevronLeft className="h-4 w-4" />
          Productos
        </Link>
      </div>
      <div className="mb-8">
        <h1 className="font-serif text-[2rem] sm:text-[2.4rem] font-bold text-foreground">{product.name}</h1>
        <p className="text-[1.3rem] text-muted-foreground">Edita los detalles del producto</p>
      </div>
      <ProductForm product={product} />
    </div>
  )
}
