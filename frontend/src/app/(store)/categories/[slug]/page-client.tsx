"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, Loader2, Package } from "lucide-react";
import { productsApi } from "@/lib/api/products";
import { ProductCard } from "@/components/products/ProductCard";

export default function CategoryPageClient() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => productsApi.getCategories(),
  });

  const category = categories?.find((c) => c.slug === slug);
  const categoryName = category?.name ?? slug;

  const { data, isLoading } = useQuery({
    queryKey: ["products", "category", slug],
    queryFn: () => productsApi.getProducts({ category: slug, size: 50 }),
    enabled: !!slug,
  });

  const products = data?.content ?? [];

  return (
    <div className="section-padding">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-[1.4rem] text-brand-accent hover:underline"
          >
            <ChevronLeft className="h-4 w-4" />
            Categorías
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="font-serif text-[3.2rem] font-bold text-brand-green sm:text-[4rem]">
            {categoryName.toUpperCase()}
          </h1>
          <p className="mt-1 text-[1.4rem] text-muted-foreground">
            {isLoading
              ? "Cargando..."
              : `${products.length} producto${products.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-brand-accent" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Package className="mb-4 h-12 w-12 text-muted-foreground/30" />
            <p className="text-[1.6rem] text-muted-foreground">
              No hay productos en esta categoría
            </p>
            <Link
              href="/products"
              className="btn-primary mt-6 px-8 py-4 text-[1.4rem]"
            >
              Ver todos los productos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
