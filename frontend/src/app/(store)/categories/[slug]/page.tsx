import { Tag } from 'lucide-react'

export default function CategoryPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <Tag className="mb-6 h-12 w-12 text-brand-green-light/40" />
      <h1 className="font-sans text-[2.4rem] font-bold text-brand-green">
        Categoría
      </h1>
      <p className="mt-2 text-[1.4rem] text-foreground-muted">
        Explora nuestros productos por categoría.
      </p>
    </div>
  )
}
