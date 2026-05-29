import { PlusCircle } from 'lucide-react'

export default function AdminNewProductPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-canvas px-4 text-center">
      <PlusCircle className="mb-6 h-12 w-12 text-brand-green-light/40" />
      <h1 className="font-sans text-[2.4rem] font-bold text-brand-green">
        Nuevo producto
      </h1>
      <p className="mt-2 text-[1.4rem] text-foreground-muted">
        Creación de producto próximamente.
      </p>
    </div>
  )
}
