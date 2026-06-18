"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  ChevronLeft,
  CreditCard,
  Shield,
  Package,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "@/lib/api/cart";
import { formatPrice } from "@/lib/utils/formatPrice";
import { cn } from "@/lib/utils/cn";

export default function CartPageClient() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: cart, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: cartApi.getCart,
  });

  const updateMutation = useMutation({
    mutationFn: ({
      variantId,
      quantity,
    }: {
      variantId: string;
      quantity: number;
    }) => cartApi.updateItemQuantity(variantId, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const removeMutation = useMutation({
    mutationFn: (variantId: string) => cartApi.removeItem(variantId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <ShoppingBag className="mb-6 h-16 w-16 text-brand-green-light/40" />
        <h1 className="font-sans text-[2.4rem] font-bold text-brand-green">
          Tu carrito está vacío
        </h1>
        <p className="mt-2 text-[1.4rem] text-muted-foreground">
          Agrega productos para empezar tu compra
        </p>
        <Link
          href="/products"
          className="btn-primary mt-6 px-8 py-4 text-[1.4rem]"
        >
          Explorar productos
        </Link>
      </div>
    );
  }

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const freeShippingThreshold = 999;
  const shipping = cart.subtotal > freeShippingThreshold ? 0 : null;

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-col-xl">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-[3.2rem] font-bold text-brand-green sm:text-[4rem]">
              Carrito de Compras
            </h1>
            <p className="mt-1 text-[1.4rem] text-muted-foreground">
              {totalItems} {totalItems === 1 ? "artículo" : "artículos"}
            </p>
          </div>
          <Link
            href="/products"
            className="hidden items-center gap-2 text-[1.4rem] text-brand-accent hover:underline sm:flex"
          >
            <ChevronLeft className="h-4 w-4" />
            Seguir comprando
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_38rem]">
          {/* Cart Items */}
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="card-starbucks flex gap-5 p-5 sm:p-6"
              >
                {/* Image */}
                <Link
                  href={`/products/${item.variantId}`}
                  className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-xl bg-muted sm:h-32 sm:w-32"
                >
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 112px, 128px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground/30">
                      <ShoppingBag className="h-8 w-8" />
                    </div>
                  )}
                </Link>

                {/* Details */}
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <Link
                        href={`/products/${item.variantId}`}
                        className="font-serif text-[1.6rem] font-semibold text-foreground hover:text-brand-accent boty-transition"
                      >
                        {item.productName}
                      </Link>
                      <p className="mt-0.5 text-[1.4rem] text-muted-foreground">
                        {item.variantName}
                      </p>
                      <p className="mt-1 text-[1.4rem] text-muted-foreground">
                        {formatPrice(item.unitPrice)} c/u
                      </p>
                    </div>
                    <p className="hidden flex-shrink-0 font-medium text-foreground sm:block">
                      {formatPrice(item.totalPrice)}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-border rounded-full">
                        <button
                          type="button"
                          onClick={() => {
                            if (item.quantity <= 1) {
                              removeMutation.mutate(item.variantId);
                            } else {
                              updateMutation.mutate({
                                variantId: item.variantId,
                                quantity: item.quantity - 1,
                              });
                            }
                          }}
                          disabled={
                            updateMutation.isPending || removeMutation.isPending
                          }
                          className="p-1.5 hover:bg-muted boty-transition rounded-l-full disabled:opacity-50 text-foreground"
                          aria-label="Disminuir cantidad"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="min-w-[2.4rem] text-center text-[1.4rem] font-medium text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateMutation.mutate({
                              variantId: item.variantId,
                              quantity: item.quantity + 1,
                            })
                          }
                          disabled={updateMutation.isPending}
                          className="p-1.5 hover:bg-muted boty-transition rounded-r-full disabled:opacity-50 text-foreground"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMutation.mutate(item.variantId)}
                        disabled={removeMutation.isPending}
                        className="p-1.5 text-muted-foreground hover:text-destructive boty-transition disabled:opacity-50"
                        aria-label="Eliminar artículo"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="font-medium text-foreground sm:hidden">
                      {formatPrice(item.totalPrice)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="card-starbucks p-6">
              <h2 className="font-serif text-[2rem] font-semibold text-foreground">
                Resumen del pedido
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-[1.4rem]">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-foreground">
                    {formatPrice(cart.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-[1.4rem]">
                  <span className="text-muted-foreground">Envío</span>
                  <span className="font-medium text-foreground">
                    {shipping === 0 ? "Gratis" : "Por calcular"}
                  </span>
                </div>
                {shipping === null && cart.subtotal < freeShippingThreshold && (
                  <p className="text-[1.2rem] text-muted-foreground">
                    Envío gratis en pedidos mayores a{" "}
                    {formatPrice(freeShippingThreshold)}
                  </p>
                )}
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between">
                    <span className="text-[1.6rem] font-semibold text-foreground">
                      Total
                    </span>
                    <span className="text-[1.8rem] font-bold text-brand-accent">
                      {formatPrice(cart.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Coupon */}
              <CouponSection />

              <button
                type="button"
                onClick={() => router.push("/checkout")}
                className="mt-6 w-full rounded-full bg-brand-accent py-4 text-[1.4rem] font-semibold text-white hover:bg-brand-accent/90 boty-transition"
              >
                Proceder al pago
              </button>

              <Link
                href="/products"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-border py-4 text-[1.4rem] font-medium text-foreground hover:bg-muted boty-transition"
              >
                <ChevronLeft className="h-4 w-4" />
                Seguir comprando
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex flex-col items-center gap-2 rounded-xl bg-background p-4 text-center boty-shadow">
                <Package className="h-6 w-6 text-brand-accent" />
                <span className="text-[1.2rem] font-medium text-foreground">
                  Envío gratis
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-xl bg-background p-4 text-center boty-shadow">
                <CreditCard className="h-6 w-6 text-brand-accent" />
                <span className="text-[1.2rem] font-medium text-foreground">
                  Pago seguro
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-xl bg-background p-4 text-center boty-shadow">
                <Shield className="h-6 w-6 text-brand-accent" />
                <span className="text-[1.2rem] font-medium text-foreground">
                  Devolución fácil
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile back link */}
        <div className="mt-6 sm:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-[1.4rem] text-brand-accent hover:underline"
          >
            <ChevronLeft className="h-4 w-4" />
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
}

function CouponSection() {
  const [code, setCode] = useState("");

  return (
    <div className="mt-6 border-t border-border pt-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          aria-label="Código de cupón"
          placeholder="Código de cupón"
          className="input-field flex-1"
        />
        <button
          type="button"
          className="btn-outline flex-shrink-0 px-5 text-[1.3rem]"
        >
          Aplicar
        </button>
      </div>
    </div>
  );
}
