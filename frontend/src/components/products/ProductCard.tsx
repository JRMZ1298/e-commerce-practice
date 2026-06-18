"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice } from "@/lib/utils/formatPrice";
import { cn } from "@/lib/utils/cn";
import type { ProductListDto } from "@/types/product";

export function ProductCard({ product }: { product: ProductListDto }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();

  const badge =
    product.comparePrice && product.comparePrice > product.basePrice
      ? "Oferta"
      : product.isFeatured
        ? "Destacado"
        : null;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="card-starbucks boty-shadow boty-transition group-hover:scale-[1.02] overflow-hidden rounded-2xl bg-background">
        <div className="relative aspect-square bg-muted overflow-hidden">
          {product.primaryImage ? (
            <Image
              src={product.primaryImage}
              alt={product.name}
              fill
              className="object-cover boty-transition group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground/20">
              <ShoppingBag className="h-16 w-16" />
            </div>
          )}
          {product.stock === 0 ? (
            <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-[1.2rem] text-white">
              Agotado
            </span>
          ) : badge ? (
            <span
              className={cn(
                "absolute left-3 top-3 rounded-full px-3 py-1 text-[1.2rem] tracking-wide",
                badge === "Oferta"
                  ? "bg-red-50 text-red-500"
                  : "bg-brand-accent/10 text-brand-accent",
              )}
            >
              {badge}
            </span>
          ) : null}
          {product.stock > 0 && (
            <button
              type="button"
              className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-background backdrop-blur-sm opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 boty-transition boty-shadow"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isAuthenticated) {
                  router.push(
                    `/auth?mode=login&redirect=/products/${product.slug}`,
                  );
                  return;
                }
                addItem({
                  id: product.id,
                  productName: product.name,
                  variantName: product.brand ?? "",
                  unitPrice: product.basePrice,
                  imageUrl: product.primaryImage || "",
                  quantity: 1,
                  totalPrice: product.basePrice,
                  variantId: product.id,
                });
              }}
              aria-label="Añadir al carrito"
            >
              <ShoppingBag className="h-4 w-4 text-foreground" />
            </button>
          )}
        </div>
        <div className="p-4">
          {product.brand && (
            <p className="text-[1.2rem] text-muted-foreground mb-1 uppercase tracking-wide">
              {product.brand}
            </p>
          )}
          <h3 className="text-[1.5rem] font-semibold text-foreground mb-1 line-clamp-2">
            {product.name}
          </h3>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[1.6rem] font-bold text-brand-accent">
              {formatPrice(product.basePrice)}
            </span>
            {product.comparePrice &&
              product.comparePrice > product.basePrice && (
                <span className="text-[1.3rem] text-muted-foreground line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
          </div>
        </div>
      </div>
    </Link>
  );
}
