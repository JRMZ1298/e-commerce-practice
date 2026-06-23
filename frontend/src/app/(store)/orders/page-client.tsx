"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Package,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Loader2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
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

export default function OrdersPageClient() {
  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: ordersApi.getOrders,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <XCircle className="mb-6 h-12 w-12 text-destructive/40" />
        <h1 className="font-sans text-[2.4rem] font-bold text-brand-green">
          Error al cargar pedidos
        </h1>
        <p className="mt-2 text-[1.4rem] text-muted-foreground">
          No pudimos cargar tus pedidos. Intenta de nuevo más tarde.
        </p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <Package className="mb-6 h-16 w-16 text-brand-green-light/40" />
        <h1 className="font-sans text-[2.4rem] font-bold text-brand-green">
          No tienes pedidos aún
        </h1>
        <p className="mt-2 text-[1.4rem] text-muted-foreground">
          Realiza tu primera compra para ver tus pedidos aquí
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

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-col-lg">
        <div className="mb-8">
          <h1 className="font-serif text-[3.2rem] font-bold text-brand-green sm:text-[4rem]">
            Mis pedidos
          </h1>
          <p className="mt-1 text-[1.4rem] text-muted-foreground">
            {orders.length} {orders.length === 1 ? "pedido" : "pedidos"}
          </p>
        </div>

        <div className="space-y-4">
          {orders.map((order) => {
            const status =
              statusConfig[order.status] ?? statusConfig.AWAITING_PAYMENT;
            return (
              <Link
                key={order.id}
                href={`/orders/${order.orderNumber}`}
                className="card-starbucks flex items-center gap-4 p-5 transition-all hover:shadow-md sm:p-6 border border-border"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <p className="font-mono text-[1.4rem] font-semibold text-foreground truncate min-w-0">
                      {order.orderNumber}
                    </p>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-[1.1rem] font-medium",
                        status.color,
                      )}
                    >
                      {status.icon}
                      {status.label}
                    </span>
                  </div>
                  <p className="mt-2 text-[1.3rem] text-muted-foreground">
                    {order.items.length}{" "}
                    {order.items.length === 1 ? "artículo" : "artículos"}
                    {" — "}
                    {formatPrice(order.total)}
                  </p>
                  <p className="mt-0.5 text-[1.2rem] text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("es-MX", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
