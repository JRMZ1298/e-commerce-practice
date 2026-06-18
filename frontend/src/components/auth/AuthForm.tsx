"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from "@/lib/validations/auth";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Eye, EyeOff } from "lucide-react";

type AuthMode = "login" | "register";

interface FieldState {
  name: string;
  label: string;
  type: string;
  autoComplete: string;
  isVisible: boolean;
}

export function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register: registerUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const redirectTo = searchParams.get("redirect") || "/";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const mode = (searchParams.get("mode") as AuthMode) || "login";
  const isLogin = mode === "login";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginInput | RegisterInput>({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
  });

  const switchMode = useCallback(
    (newMode: AuthMode) => {
      if (newMode === mode) return;
      setTransitioning(true);
      setTimeout(() => {
        setError(null);
        reset();
        router.replace(`/auth?mode=${newMode}`, { scroll: false });
        setTimeout(() => {
          setTransitioning(false);
        }, 50);
      }, 250);
    },
    [mode, reset, router],
  );

  const loginFields: FieldState[] = [
    {
      name: "email",
      label: "Correo electrónico",
      type: "email",
      autoComplete: "email",
      isVisible: true,
    },
    {
      name: "password",
      label: "Contraseña",
      type: showPassword ? "text" : "password",
      autoComplete: "current-password",
      isVisible: true,
    },
  ];

  const registerFields: FieldState[] = [
    {
      name: "firstName",
      label: "Nombre",
      type: "text",
      autoComplete: "given-name",
      isVisible: !isLogin && !transitioning,
    },
    {
      name: "lastName",
      label: "Apellido",
      type: "text",
      autoComplete: "family-name",
      isVisible: !isLogin && !transitioning,
    },
    {
      name: "email",
      label: "Correo electrónico",
      type: "email",
      autoComplete: "email",
      isVisible: true,
    },
    {
      name: "password",
      label: "Contraseña",
      type: showPassword ? "text" : "password",
      autoComplete: isLogin ? "current-password" : "new-password",
      isVisible: true,
    },
    {
      name: "confirmPassword",
      label: "Confirmar contraseña",
      type: showConfirm ? "text" : "password",
      autoComplete: "new-password",
      isVisible: !isLogin && !transitioning,
    },
  ];

  const visibleFields = isLogin ? loginFields : registerFields;

  const onSubmit = async (data: LoginInput | RegisterInput) => {
    setError(null);
    try {
      if (isLogin) {
        const d = data as LoginInput;
        await login(d.email, d.password);
        router.replace(redirectTo);
      } else {
        const d = data as RegisterInput;
        await registerUser({
          email: d.email,
          password: d.password,
          firstName: d.firstName,
          lastName: d.lastName,
        });
        router.replace(redirectTo);
      }
    } catch {
      setError(
        isLogin
          ? "Credenciales inválidas. Intenta de nuevo."
          : "Error al registrar. Intenta de nuevo.",
      );
    }
  };

  return (
    <div className="w-full max-w-[380px] space-y-5">
      <div className="text-left">
        <Link
          href="/"
          className="mb-4 inline-block text-[2rem] font-bold tracking-tight text-brand-green"
        >
          MAISON
        </Link>
        <h1 className="text-[2.4rem] font-bold tracking-tight text-foreground">
          {isLogin ? "Iniciar sesión" : "Crear cuenta"}
        </h1>
        <p className="mt-1 text-[1.3rem] text-muted-foreground">
          {isLogin
            ? "Ingresa tus datos para continuar"
            : "Únete a nuestra comunidad y recibe 10% de descuento"}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* Animated Fields Container */}
        <div className="relative overflow-hidden">
          <div
            className="space-y-3 transition-all duration-300 ease-in-out"
            style={{
              opacity: transitioning ? 0 : 1,
              transform: transitioning
                ? `translateY(${isLogin ? "-10px" : "10px"})`
                : "translateY(0)",
            }}
          >
            {visibleFields.map((field) => (
              <div
                key={field.name}
                className="space-y-2 transition-all duration-300 ease-in-out"
                style={{
                  opacity: field.isVisible ? 1 : 0,
                  transform: field.isVisible
                    ? "translateY(0)"
                    : "translateY(-8px)",
                  maxHeight: field.isVisible ? "80px" : "0",
                  overflow: "hidden",
                  transitionDelay: field.isVisible ? "50ms" : "0ms",
                }}
              >
                <label
                  htmlFor={field.name}
                  className="text-[1.2rem] font-normal text-foreground"
                >
                  {field.label}
                </label>
                <div className="relative">
                  <input
                    id={field.name}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    placeholder={
                      field.name === "email"
                        ? "nombre@email.com"
                        : field.name === "password" ||
                            field.name === "confirmPassword"
                          ? "••••••••"
                          : ""
                    }
                    className="h-[44px] w-full rounded-xl border-2 border-foreground bg-background px-4 text-[1.4rem] text-muted-foreground placeholder:text-foreground focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
                    {...register(field.name as any)}
                  />
                  {(field.name === "password" ||
                    field.name === "confirmPassword") && (
                    <button
                      type="button"
                      onClick={() =>
                        field.name === "password"
                          ? setShowPassword(!showPassword)
                          : setShowConfirm(!showConfirm)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-brand-accent"
                      tabIndex={-1}
                    >
                      {(
                        field.name === "password" ? showPassword : showConfirm
                      ) ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>
                {errors[field.name as keyof typeof errors] && (
                  <p className="text-[1.2rem] text-destructive">
                    {
                      errors[field.name as keyof typeof errors]
                        ?.message as string
                    }
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Forgot password link (login only) */}
        {isLogin && (
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-[1.2rem] text-muted-foreground transition-colors hover:text-brand-accent"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-[1.3rem] text-destructive">
            {error}
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-[44px] w-full rounded-xl bg-brand-accent text-[1.4rem] font-medium text-white transition-colors hover:bg-brand-accent/90 disabled:opacity-60"
        >
          {isSubmitting ? (
            <Loader2 className="mx-auto h-5 w-5 animate-spin" />
          ) : isLogin ? (
            "Iniciar sesión"
          ) : (
            "Crear cuenta"
          )}
        </button>
      </form>

      {/* Toggle mode */}
      <div className="text-center pt-1">
        <button
          type="button"
          onClick={() => switchMode(isLogin ? "register" : "login")}
          className="text-[1.3rem] font-normal text-muted-foreground transition-colors hover:text-brand-accent"
        >
          {isLogin
            ? "¿No tienes cuenta? Regístrate"
            : "¿Ya tienes cuenta? Inicia sesión"}
        </button>
      </div>
    </div>
  );
}
