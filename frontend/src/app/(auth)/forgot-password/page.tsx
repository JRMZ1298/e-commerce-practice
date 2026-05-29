import { Lock } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-md">
        <div className="rounded-card bg-white px-8 py-10 shadow-card">
          <div className="mb-8 text-center">
            <Link
              href="/"
              className="mb-6 inline-block font-sans text-[2.6rem] font-bold tracking-tight text-brand-green"
            >
              MAISON
            </Link>
            <Lock className="mx-auto mb-4 h-8 w-8 text-brand-accent" />
            <h1 className="font-sans text-[2.4rem] font-bold text-brand-green">
              Recuperar contraseña
            </h1>
            <p className="mt-2 text-[1.4rem] text-foreground-muted">
              Te enviaremos un enlace para restablecer tu contraseña
            </p>
          </div>
          <div className="rounded-[4px] border border-ceramic bg-canvas px-4 py-6 text-center text-[1.4rem] text-foreground-muted">
            Funcionalidad disponible próximamente.
          </div>
        </div>
      </div>
    </div>
  )
}
