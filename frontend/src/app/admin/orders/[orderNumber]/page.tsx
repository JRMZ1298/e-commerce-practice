"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  MapPin,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/admin";
import { formatPrice } from "@/lib/utils/formatPrice";
import { cn } from "@/lib/utils/cn";

const statusConfig: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  AWAITING_PAYMENT: {
    label: "Pendiente",
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

const allowedTransitions: Record<string, string[]> = {
  AWAITING_PAYMENT: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const orderNumber = params.orderNumber as string;
  const [notes, setNotes] = useState("");

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin-order", orderNumber],
    queryFn: () => adminApi.getOrderByNumber(orderNumber),
    enabled: !!orderNumber,
  });

  const statusMutation = useMutation({
    mutationFn: ({ status, notes: n }: { status: string; notes?: string }) =>
      adminApi.updateOrderStatus(orderNumber, status, n),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-order", orderNumber] });
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      setNotes("");
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <XCircle className="mb-4 h-12 w-12 text-destructive/40" />
        <h1 className="text-[2rem] font-bold text-foreground">
          Pedido no encontrado
        </h1>
        <Link
          href="/admin/orders"
          className="btn-primary mt-4 px-6 py-3 text-[1.3rem]"
        >
          Volver a pedidos
        </Link>
      </div>
    );
  }

  let shippingAddress: Record<string, string> = {};
  try {
    shippingAddress = JSON.parse(order.shippingAddress);
  } catch {}

  const currentCfg =
    statusConfig[order.status] ?? statusConfig.AWAITING_PAYMENT;
  const possibleTransitions = allowedTransitions[order.status] ?? [];

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-[1.3rem] text-brand-accent hover:underline"
        >
          <ChevronLeft className="h-4 w-4" />
          Pedidos
        </Link>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <h1 className="font-mono text-[1.6rem] sm:text-[2rem] font-bold text-foreground">
            {order.orderNumber}
          </h1>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[1.3rem] font-medium",
              currentCfg.color,
            )}
          >
            {currentCfg.icon}
            {currentCfg.label}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_36rem]">
        {/* Left - Order Items */}
        <div className="rounded-xl bg-cards p-6 boty-shadow">
          <h2 className="mb-4 font-serif text-[1.8rem] font-semibold text-foreground">
            Artículos
          </h2>
          <div className="divide-y divide-border">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground/30">
                      <ShoppingBag className="h-5 w-5" />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 justify-between">
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">
                      {item.productName}
                    </p>
                    {item.variantName && (
                      <p className="text-[1.2rem] text-muted-foreground">
                        {item.variantName}
                      </p>
                    )}
                    <p className="mt-1 text-[1.2rem] text-muted-foreground">
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

        {/* Right - Order Info */}
        <div className="space-y-6">
          {/* Summary */}
          <div className="rounded-xl bg-cards p-6 boty-shadow">
            <h2 className="mb-4 font-serif text-[1.8rem] font-semibold text-foreground">
              Resumen
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-[1.3rem]">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">
                  {formatPrice(order.subtotal)}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-[1.3rem]">
                  <span className="text-muted-foreground">Descuento</span>
                  <span className="font-medium text-green-600">
                    -{formatPrice(order.discount)}
                  </span>
                </div>
              )}
              {order.couponCode && (
                <div className="flex justify-between text-[1.3rem]">
                  <span className="text-muted-foreground">Cupón</span>
                  <span className="font-medium text-foreground">
                    {order.couponCode}
                  </span>
                </div>
              )}
              <div className="border-t border-border pt-3">
                <div className="flex justify-between">
                  <span className="text-[1.5rem] font-semibold text-foreground">
                    Total
                  </span>
                  <span className="text-[1.6rem] font-bold text-brand-accent">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="rounded-xl bg-cards p-6 boty-shadow">
            <h2 className="mb-3 font-serif text-[1.8rem] font-semibold text-foreground">
              <span className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-brand-accent" />
                Envío
              </span>
            </h2>
            <div className="text-[1.3rem] text-foreground">
              <p className="font-medium">{shippingAddress.fullName}</p>
              {shippingAddress.phone && (
                <p className="text-muted-foreground">{shippingAddress.phone}</p>
              )}
              <p className="mt-1 text-muted-foreground">
                {shippingAddress.street}
              </p>
              <p className="text-muted-foreground">
                {shippingAddress.city}, {shippingAddress.state}{" "}
                {shippingAddress.postalCode}
              </p>
            </div>
          </div>

          {/* Status Management */}
          {possibleTransitions.length > 0 && (
            <div className="rounded-xl bg-cards p-6 boty-shadow">
              <h2 className="mb-4 font-serif text-[1.8rem] font-semibold text-foreground">
                Actualizar estado
              </h2>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {possibleTransitions.map((nextStatus) => {
                    const cfg = statusConfig[nextStatus];
                    return (
                      <button
                        key={nextStatus}
                        type="button"
                        onClick={() =>
                          statusMutation.mutate({
                            status: nextStatus,
                            notes: notes || undefined,
                          })
                        }
                        disabled={statusMutation.isPending}
                        className={cn(
                          "flex items-center gap-1.5 rounded-full px-4 py-2 text-[1.2rem] font-medium transition-all disabled:opacity-50",
                          cfg.color,
                        )}
                      >
                        {cfg.icon}
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
                <div>
                  <label
                    htmlFor="status-notes"
                    className="text-[1.2rem] font-medium text-foreground"
                  >
                    Notas (opcional)
                  </label>
                  <textarea
                    id="status-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    placeholder="Notas sobre el cambio de estado..."
                    className="input-field mt-1 w-full resize-none"
                  />
                </div>
              </div>
              {statusMutation.isPending && (
                <div className="mt-3 flex items-center gap-2 text-[1.2rem] text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Actualizando...
                </div>
              )}
              {statusMutation.isError && (
                <p className="mt-2 text-[1.2rem] text-destructive">
                  {statusMutation.error instanceof Error
                    ? statusMutation.error.message
                    : "Error al actualizar"}
                </p>
              )}
            </div>
          )}

          {/* Status Timeline */}
          {order.statusHistory && order.statusHistory.length > 0 && (
            <div className="rounded-xl bg-cards p-6 boty-shadow">
              <h2 className="mb-4 font-serif text-[1.8rem] font-semibold text-foreground">
                Historial
              </h2>
              <div className="space-y-4">
                {order.statusHistory.map((entry) => {
                  const cfg =
                    statusConfig[entry.toStatus] ??
                    statusConfig.AWAITING_PAYMENT;
                  return (
                    <div key={entry.id} className="flex gap-3">
                      <div className="mt-0.5 flex-shrink-0">
                        <span
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-full",
                            cfg.color,
                          )}
                        >
                          {cfg.icon}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground">
                          {cfg.label}
                        </p>
                        <p className="text-[1.1rem] text-muted-foreground">
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
                        {entry.changedBy && (
                          <p className="text-[1.1rem] text-muted-foreground">
                            por {entry.changedBy}
                          </p>
                        )}
                        {entry.notes && (
                          <p className="mt-0.5 text-[1.1rem] text-muted-foreground">
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
  );
}
