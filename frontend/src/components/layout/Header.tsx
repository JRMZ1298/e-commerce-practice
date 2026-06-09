"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Menu, X, User, LogOut, Home } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useUIStore } from "@/stores/uiStore";
import { cn } from "@/lib/utils/cn";

export function Header() {
  const { totalItems, toggleCart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { mobileMenuOpen, toggleMobileMenu } = useUIStore();
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setHeaderVisible(false);
      } else {
        setHeaderVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 px-4 pt-4 transition-transform duration-500 ease-in-out",
        headerVisible ? "translate-y-0" : "-translate-y-full",
      )}
    >
      <nav
        className="mx-auto px-6 lg:px-8 backdrop-blur-md rounded-lg bg-[rgba(255,255,255,0.6)] border border-white/30 animate-scale-fade-in"
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 10px 50px" }}
      >
        <div className="flex items-center justify-between h-[68px]">
          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 text-foreground/80 hover:text-foreground boty-transition"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          {/* Desktop Navigation - Left */}
          <div className="hidden lg:flex items-center gap-6">
            <Link
              href="/"
              className="text-[1.4rem] tracking-wide text-foreground/70 hover:text-foreground boty-transition"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-[1.4rem] tracking-wide text-foreground/70 hover:text-foreground boty-transition"
            >
              Colección
            </Link>
            <Link
              href="/categories"
              className="text-[1.4rem] tracking-wide text-foreground/70 hover:text-foreground boty-transition"
            >
              Categorías
            </Link>
          </div>

          {/* Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <h1 className="font-bold text-[2.4rem] tracking-tight text-brand-green">
              MAISON
            </h1>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/wishlist"
              className="hidden sm:block p-2 text-foreground/70 hover:text-foreground boty-transition"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
            </Link>
            <button
              type="button"
              onClick={toggleCart}
              className="relative p-2 text-foreground/70 hover:text-foreground boty-transition"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0 -right-0 w-4 h-4 bg-brand-accent text-white text-[10px] flex items-center justify-center rounded-full">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>
            {isAuthenticated && user ? (
              <div className="hidden sm:flex items-center gap-2">
                {(user.role === "ADMIN" || user.role === "SUPER_ADMIN") && (
                  <Link
                    href="/admin"
                    className="text-[1.3rem] tracking-wide text-brand-accent hover:text-brand-accent/80 boty-transition"
                  >
                    Admin →
                  </Link>
                )}
                <span className="text-[1.3rem] text-foreground/70">
                  {user.firstName || user.email}
                </span>
                <button
                  onClick={logout}
                  className="inline-flex items-center gap-1 text-[1.3rem] tracking-wide text-foreground/70 hover:text-destructive boty-transition"
                  aria-label="Cerrar sesión"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Salir</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center gap-1.5 text-[1.4rem] tracking-wide text-foreground/70 hover:text-foreground boty-transition"
              >
                <User className="w-4 h-4" />
                <span>Ingresar</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "lg:hidden overflow-hidden boty-transition",
            mobileMenuOpen ? "max-h-80 pb-6" : "max-h-0",
          )}
        >
          <div className="flex flex-col gap-4 pt-4 border-t border-black/10">
            <Link
              href="/products"
              onClick={toggleMobileMenu}
              className="text-[1.4rem] tracking-wide text-foreground/70 hover:text-foreground boty-transition"
            >
              Colección
            </Link>
            <Link
              href="/categories"
              onClick={toggleMobileMenu}
              className="text-[1.4rem] tracking-wide text-foreground/70 hover:text-foreground boty-transition"
            >
              Categorías
            </Link>

            {isAuthenticated && user ? (
              <>
                {(user.role === "ADMIN" || user.role === "SUPER_ADMIN") && (
                  <Link
                    href="/admin"
                    onClick={toggleMobileMenu}
                    className="text-[1.4rem] tracking-wide text-brand-accent hover:text-brand-accent/80 boty-transition"
                  >
                    Admin →
                  </Link>
                )}
                <span className="text-[1.4rem] text-foreground/70 px-1">
                  {user.firstName || user.email}
                </span>
                <button
                  onClick={() => {
                    logout();
                    toggleMobileMenu();
                  }}
                  className="text-left text-[1.4rem] tracking-wide text-foreground/70 hover:text-destructive boty-transition"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={toggleMobileMenu}
                  className="text-[1.4rem] tracking-wide text-foreground/70 hover:text-foreground boty-transition"
                >
                  Ingresar
                </Link>
                <Link
                  href="/register"
                  onClick={toggleMobileMenu}
                  className="text-[1.4rem] tracking-wide text-foreground/70 hover:text-foreground boty-transition"
                >
                  Unirme
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
