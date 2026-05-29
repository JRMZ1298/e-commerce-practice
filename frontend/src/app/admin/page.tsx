import { LayoutDashboard } from 'lucide-react'

export default function AdminDashboardPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-4 text-center">
      <LayoutDashboard className="mb-6 h-12 w-12 text-brand-green-light/40" />
      <h1 className="font-sans text-[2.4rem] font-bold text-brand-green">
        Panel de Administración
      </h1>
      <p className="mt-2 text-[1.4rem] text-foreground-muted">
        Gestiona tu tienda desde aquí.
      </p>
    </div>
  )
}
