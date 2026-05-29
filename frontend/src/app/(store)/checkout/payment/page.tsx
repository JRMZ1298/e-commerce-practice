import { CreditCard } from 'lucide-react'

export default function PaymentPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <CreditCard className="mb-6 h-12 w-12 text-brand-green-light/40" />
      <h1 className="font-sans text-[2.4rem] font-bold text-brand-green">
        Pago
      </h1>
      <p className="mt-2 text-[1.4rem] text-foreground-muted">
        Procesa tu pago de forma segura.
      </p>
    </div>
  )
}
