"use client";

import { Suspense } from "react";
import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";
import { Loader2, X } from "lucide-react";

function AuthContent() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-6 bg-gradient-to-br from-brand-green/5 via-canvas to-brand-green/10">
      <Link
        href="/"
        className="fixed right-6 top-6 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-foreground/60 hover:bg-white hover:text-foreground transition-all shadow-md"
        aria-label="Cerrar"
      >
        <X className="h-5 w-5" />
      </Link>
      <div className="w-full max-w-[900px] bg-background rounded-2xl md:rounded-[2.5rem] shadow-2xl overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-0 min-h-0 lg:min-h-[600px]">
          {/* LEFT SIDE - FORM */}
          <div className="flex flex-col items-center justify-center p-6 lg:p-8">
            <Suspense
              fallback={
                <Loader2 className="h-8 w-8 animate-spin text-brand-accent" />
              }
            >
              <AuthForm />
            </Suspense>
          </div>

          {/* RIGHT SIDE - IMAGE PANEL */}
          <div className="relative lg:rounded-[2rem] m-0 lg:m-4 overflow-hidden min-h-[200px] sm:min-h-[250px] lg:min-h-0">
            {/* Background Image Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-house via-brand-uplift to-brand-house" />

            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 right-10 w-40 h-40 border border-white rounded-full" />
              <div className="absolute top-20 right-20 w-60 h-60 border border-white rounded-full" />
              <div className="absolute -bottom-10 -left-10 w-80 h-80 border border-white rounded-full" />
            </div>

            {/* Content overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-8 pb-20 md:pb-8 text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">MAISON</h2>
              <p className="text-[1.4rem] text-white/80 max-w-xs leading-relaxed">
                Moda con elegancia y distinción. Descubre piezas únicas que
                definen tu estilo.
              </p>
            </div>

            {/* Bottom caption card */}
            <div className="hidden lg:block absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-3">
              <p className="text-[1.2rem] text-white/90 leading-relaxed">
                Prendas cuidadosamente seleccionadas para quienes valoran la
                autenticidad y la calidad.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-accent" />
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  );
}
