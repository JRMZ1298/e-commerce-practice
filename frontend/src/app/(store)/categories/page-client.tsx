"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Tag, ChevronRight, Loader2, ShoppingBag } from "lucide-react";
import { productsApi } from "@/lib/api/products";

export default function CategoriesPageClient() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => productsApi.getCategories(),
  });

  return (
    <main className="min-h-screen pt-20 pb-20">
      <div className="mx-auto px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-7xl font-bold text-foreground mb-4">
            Explora por categoría
          </h1>
          <p className="text-[1.6rem] text-muted-foreground max-w-md mx-auto">
            Encuentra lo que buscas en nuestra colección organizada
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-brand-accent" />
          </div>
        ) : !categories || categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Tag className="mb-4 h-12 w-12 text-muted-foreground/30" />
            <p className="text-[1.6rem] text-muted-foreground">
              No hay categorías disponibles
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-background rounded-3xl overflow-hidden boty-shadow boty-transition group"
              >
                <Link href={`/categories/${cat.slug}`}>
                  {/* Image placeholder */}
                  <div
                    className="relative aspect-[4/3] bg-muted flex items-center justify-center"
                    style={{ backgroundColor: "#edebe9" }}
                  >
                    {cat.imageUrl ? (
                      <Image
                        src={cat.imageUrl}
                        alt={cat.name}
                        fill
                        className="object-cover group-hover:scale-105 boty-transition"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <Tag className="w-16 h-16 text-muted-foreground/20" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-[2rem] font-semibold text-foreground">
                        {cat.name}
                      </h3>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 boty-transition" />
                    </div>
                    {cat.description && (
                      <p className="text-[1.4rem] text-muted-foreground mb-4">
                        {cat.description}
                      </p>
                    )}

                    {/* Subcategories */}
                    {cat.children && cat.children.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {cat.children.map((child) => (
                          <Link
                            key={child.id}
                            href={`/categories/${child.slug}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-muted text-[1.2rem] text-muted-foreground hover:text-foreground hover:bg-muted/80 boty-transition"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ShoppingBag className="w-3 h-3" />
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
