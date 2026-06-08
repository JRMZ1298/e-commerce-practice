'use client'

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { ProductForm } from '@/components/admin/ProductForm'

export default function AdminNewProductPage() {
  return (
    <div className="p-6">
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
        <h1 className="font-serif text-[2.4rem] font-bold text-foreground">Nuevo producto</h1>
        <p className="text-[1.3rem] text-muted-foreground">Crea un nuevo producto en el catálogo</p>
      </div>
      <ProductForm />
    </div>
  )
}
