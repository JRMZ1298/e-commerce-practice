"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginInput) => {
    setError(null);
    try {
      await login(data.email, data.password);
    } catch {
      setError("Credenciales inválidas. Intenta de nuevo.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-xl">
        <div className="rounded-card bg-card px-8 py-10 shadow-card">
          <div className="mb-8 text-center">
            <Link
              href="/"
              className="mb-6 inline-block text-[2.4rem] font-bold tracking-tight text-brand-green"
            >
              MAISON
            </Link>
            <h1 className="text-[2.4rem] font-semibold text-brand-green sm:text-[3.2rem]">
              Iniciar sesión
            </h1>
            <p className="mt-2 text-[1.4rem] text-foreground-muted">
              Ingresa tus datos para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="input-field-floating">
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder=" "
                {...register("email")}
              />
              <label htmlFor="email">Correo electrónico</label>
              {errors.email && (
                <p className="error-message">{errors.email.message}</p>
              )}
            </div>

            <div className="input-field-floating">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder=" "
                className="pr-10"
                {...register("password")}
              />
              <label htmlFor="password">Contraseña</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
              {errors.password && (
                <p className="error-message">{errors.password.message}</p>
              )}
            </div>

            {error && (
              <div className="rounded-[4px] border border-destructive/20 bg-destructive/5 px-4 py-3 text-[1.4rem] text-destructive">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full disabled:opacity-60"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Iniciar sesión"
              )}
            </button>
          </form>

          <div className="mt-6 space-y-2 text-center text-[1.4rem] text-foreground-muted">
            <p>
              ¿No tienes cuenta?{" "}
              <Link
                href="/register"
                className="font-semibold text-brand-accent hover:underline"
              >
                Regístrate
              </Link>
            </p>
            <Link
              href="/forgot-password"
              className="block text-[1.3rem] text-foreground-muted hover:text-brand-accent"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
