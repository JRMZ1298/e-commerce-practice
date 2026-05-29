"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setError(null);
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });
    } catch {
      setError("Error al registrar. Intenta de nuevo.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-3xl">
        <div className="rounded-card bg-card px-8 py-10 shadow-card">
          <div className="mb-8 text-center">
            <Link
              href="/"
              className="mb-6 inline-block text-[2.4rem] font-bold tracking-tight text-brand-green"
            >
              MAISON
            </Link>
            <h1 className="text-[2.4rem] font-semibold text-brand-green sm:text-[3.2rem]">
              Crear cuenta
            </h1>
            <p className="mt-2 text-[1.4rem] text-foreground-muted">
              Únete a nuestra comunidad y recibe 10% de descuento
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="input-field-floating">
                <input
                  id="firstName"
                  type="text"
                  placeholder=" "
                  {...register("firstName")}
                />
                <label htmlFor="firstName">Nombre</label>
                {errors.firstName && (
                  <p className="error-message">{errors.firstName.message}</p>
                )}
              </div>

              <div className="input-field-floating">
                <input
                  id="lastName"
                  type="text"
                  placeholder=" "
                  {...register("lastName")}
                />
                <label htmlFor="lastName">Apellido</label>
                {errors.lastName && (
                  <p className="error-message">{errors.lastName.message}</p>
                )}
              </div>
            </div>

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
                autoComplete="new-password"
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

            <div className="input-field-floating">
              <input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                placeholder=" "
                className="pr-10"
                {...register("confirmPassword")}
              />
              <label htmlFor="confirmPassword">Confirmar contraseña</label>
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground"
                tabIndex={-1}
              >
                {showConfirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
              {errors.confirmPassword && (
                <p className="error-message">
                  {errors.confirmPassword.message}
                </p>
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
                "Crear cuenta"
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-[1.4rem] text-foreground-muted">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/login"
              className="font-semibold text-brand-accent hover:underline"
            >
              Inicia sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
