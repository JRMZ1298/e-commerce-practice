import { ClipboardList } from 'lucide-react'

export default function AdminOrdersPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-canvas px-4 text-center">
      <ClipboardList className="mb-6 h-12 w-12 text-brand-green-light/40" />
      <h1 className="font-sans text-[2.4rem] font-bold text-brand-green">
        Pedidos
      </h1>
      <p className="mt-2 text-[1.4rem] text-foreground-muted">
        Gestión de pedidos próximamente.
      </p>
    </div>
  )
}
