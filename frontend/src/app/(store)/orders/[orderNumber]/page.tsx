import { FileText } from 'lucide-react'

export default function OrderDetailPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <FileText className="mb-6 h-12 w-12 text-brand-green-light/40" />
      <h1 className="font-sans text-[2.4rem] font-bold text-brand-green">
        Detalle del pedido
      </h1>
      <p className="mt-2 text-[1.4rem] text-foreground-muted">
        Información detallada de tu pedido.
      </p>
    </div>
  )
}
