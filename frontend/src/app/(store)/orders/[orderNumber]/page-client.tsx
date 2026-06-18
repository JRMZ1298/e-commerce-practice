"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Package,
  ChevronLeft,
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  MapPin,
  CreditCard,
  Loader2,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersApi } from "@/lib/api/orders";
import { formatPrice } from "@/lib/utils/formatPrice";
import { cn } from "@/lib/utils/cn";

const statusConfig: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  AWAITING_PAYMENT: {
    label: "Pendiente de pago",
    color: "text-yellow-600 bg-yellow-50",
    icon: <Clock className="h-4 w-4" />,
  },
  CONFIRMED: {
    label: "Confirmado",
    color: "text-blue-600 bg-blue-50",
    icon: <CheckCircle className="h-4 w-4" />,
  },
  SHIPPED: {
    label: "Enviado",
    color: "text-purple-600 bg-purple-50",
    icon: <Truck className="h-4 w-4" />,
  },
  DELIVERED: {
    label: "Entregado",
    color: "text-green-600 bg-green-50",
    icon: <CheckCircle className="h-4 w-4" />,
  },
  CANCELLED: {
    label: "Cancelado",
    color: "text-red-600 bg-red-50",
    icon: <XCircle className="h-4 w-4" />,
  },
};

export default function OrderDetailPageClient() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
        </div>
      }
    >
      <OrderDetailContent />
    </Suspense>
  );
}

function OrderDetailContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const isSuccess = searchParams.get("success") === "true";
  const orderNumber = params.orderNumber as string;

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["order", orderNumber],
    queryFn: () => ordersApi.getOrderByNumber(orderNumber),
    enabled: !!orderNumber,
  });

  const cancelMutation = useMutation({
    mutationFn: () => ordersApi.cancelOrder(orderNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", orderNumber] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <XCircle className="mb-6 h-12 w-12 text-destructive/40" />
        <h1 className="font-sans text-[2.4rem] font-bold text-brand-green">
          Pedido no encontrado
        </h1>
        <p className="mt-2 text-[1.4rem] text-muted-foreground">
          No pudimos encontrar el pedido que buscas.
        </p>
        <Link
          href="/orders"
          className="btn-primary mt-6 px-8 py-4 text-[1.4rem]"
        >
          Mis pedidos
        </Link>
      </div>
    );
  }

  const status = statusConfig[order.status] ?? statusConfig.AWAITING_PAYMENT;
  let shippingAddress: Record<string, string> = {};
  try {
    shippingAddress = JSON.parse(order.shippingAddress);
  } catch {}

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-col-lg">
        {/* Success Banner */}
        {isSuccess && order.status === "AWAITING_PAYMENT" && (
          <div className="mb-6 rounded-xl bg-green-50 p-6 text-center">
            <CheckCircle className="mx-auto mb-3 h-12 w-12 text-green-600" />
            <h2 className="font-serif text-[2rem] font-bold text-green-800">
              Pedido creado exitosamente
            </h2>
            <p className="mt-1 text-[1.4rem] text-green-600">
              Tu pedido {order.orderNumber} ha sido registrado. Te notificaremos
              cuando sea confirmado.
            </p>
          </div>
        )}

        <div className="mb-6">
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 text-[1.4rem] text-brand-accent hover:underline"
          >
            <ChevronLeft className="h-4 w-4" />
            Mis pedidos
          </Link>
        </div>

        <div className="card-starbucks mb-6 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-mono text-[2rem] font-bold text-foreground">
                {order.orderNumber}
              </h1>
              <p className="mt-1 text-[1.4rem] text-muted-foreground">
                {new Date(order.createdAt).toLocaleDateString("es-MX", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <span
              className={cn(
                "inline-flex w-fit items-center gap-1.5 rounded-full px-4 py-1.5 text-[1.3rem] font-medium",
                status.color,
              )}
            >
              {status.icon}
              {status.label}
            </span>
          </div>
        </div>

        {order.status === "AWAITING_PAYMENT" && (
          <div className="mb-6 flex justify-end">
            <button
              type="button"
              onClick={() => {
                if (window.confirm("¿Estás seguro de cancelar este pedido?")) {
                  cancelMutation.mutate();
                }
              }}
              disabled={cancelMutation.isPending}
              className="btn-outline border-destructive flex items-center gap-2 px-6 py-3 text-[1.3rem] text-destructive hover:bg-red-400 disabled:opacity-50"
            >
              {cancelMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              Cancelar pedido
            </button>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_32rem]">
          {/* Left - Items */}
          <div className="card-starbucks p-6">
            <h2 className="mb-4 font-serif text-[2rem] font-semibold text-foreground">
              Artículos
            </h2>
            <div className="divide-y divide-border">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <Link
                    href={`/products/${item.productSlug}`}
                    className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-muted"
                  >
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.productName}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground/30">
                        <ShoppingBag className="h-6 w-6" />
                      </div>
                    )}
                  </Link>
                  <div className="flex flex-1 justify-between">
                    <div className="min-w-0">
                      <Link
                        href={`/products/${item.productSlug}`}
                        className="font-medium text-foreground hover:text-brand-accent boty-transition"
                      >
                        {item.productName}
                      </Link>
                      {item.variantName && (
                        <p className="text-[1.3rem] text-muted-foreground">
                          {item.variantName}
                        </p>
                      )}
                      <p className="mt-1 text-[1.3rem] text-muted-foreground">
                        Cant: {item.quantity} x {formatPrice(item.unitPrice)}
                      </p>
                    </div>
                    <p className="flex-shrink-0 font-medium text-foreground">
                      {formatPrice(item.totalPrice)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Summary & Info */}
          <div className="space-y-6">
            <div className="card-starbucks p-6">
              <h2 className="mb-4 font-serif text-[2rem] font-semibold text-foreground">
                Resumen
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-[1.4rem]">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-foreground">
                    {formatPrice(order.subtotal)}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-[1.4rem]">
                    <span className="text-muted-foreground">Descuento</span>
                    <span className="font-medium text-green-600">
                      -{formatPrice(order.discount)}
                    </span>
                  </div>
                )}
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between">
                    <span className="text-[1.6rem] font-semibold text-foreground">
                      Total
                    </span>
                    <span className="text-[1.8rem] font-bold text-brand-accent">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-starbucks p-6">
              <h2 className="mb-4 font-serif text-[2rem] font-semibold text-foreground">
                <span className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-brand-accent" />
                  Dirección de envío
                </span>
              </h2>
              <div className="text-[1.4rem] text-foreground">
                <p className="font-medium">{shippingAddress.fullName}</p>
                {shippingAddress.phone && (
                  <p className="text-muted-foreground">
                    {shippingAddress.phone}
                  </p>
                )}
                <p className="mt-1 text-muted-foreground">
                  {shippingAddress.street}
                </p>
                <p className="text-muted-foreground">
                  {shippingAddress.city}, {shippingAddress.state}{" "}
                  {shippingAddress.postalCode}
                </p>
                <p className="text-muted-foreground">
                  {shippingAddress.country}
                </p>
              </div>
            </div>

            {order.notes && (
              <div className="card-starbucks p-6">
                <h2 className="mb-3 font-serif text-[2rem] font-semibold text-foreground">
                  Notas
                </h2>
                <p className="text-[1.4rem] text-muted-foreground">
                  {order.notes}
                </p>
              </div>
            )}

            {/* Status Timeline */}
            {order.statusHistory && order.statusHistory.length > 0 && (
              <div className="card-starbucks p-6">
                <h2 className="mb-4 font-serif text-[2rem] font-semibold text-foreground">
                  Historial del pedido
                </h2>
                <div className="space-y-4">
                  {order.statusHistory.map((entry) => {
                    const entryStatus =
                      statusConfig[entry.toStatus] ??
                      statusConfig.AWAITING_PAYMENT;
                    return (
                      <div key={entry.id} className="flex gap-3">
                        <div className="mt-0.5 flex-shrink-0">
                          <span
                            className={cn(
                              "flex h-6 w-6 items-center justify-center rounded-full",
                              entryStatus.color,
                            )}
                          >
                            {entryStatus.icon}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground">
                            {entryStatus.label}
                          </p>
                          <p className="text-[1.2rem] text-muted-foreground">
                            {new Date(entry.createdAt).toLocaleDateString(
                              "es-MX",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </p>
                          {entry.notes && (
                            <p className="mt-0.5 text-[1.2rem] text-muted-foreground">
                              {entry.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
