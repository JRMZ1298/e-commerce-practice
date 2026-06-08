"use client";

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  Suspense,
} from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  Package,
} from "lucide-react";
import { productsApi, type ProductsParams } from "@/lib/api/products";
import { cn } from "@/lib/utils/cn";
import { ProductCard } from "@/components/products/ProductCard";

const SORT_OPTIONS = [
  { value: "", label: "Más relevantes" },
  { value: "price_asc", label: "Precio: menor a mayor" },
  { value: "price_desc", label: "Precio: mayor a menor" },
  { value: "name_asc", label: "Nombre A-Z" },
  { value: "name_desc", label: "Nombre Z-A" },
  { value: "newest", label: "Más recientes" },
];

function CatalogPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const brand = searchParams.get("brand") || "";
  const sort = searchParams.get("sort") || "";
  const inStock = searchParams.get("inStock") || "";
  const page = parseInt(searchParams.get("page") || "0", 10);

  const [searchInput, setSearchInput] = useState(q);
  const [categoryInput, setCategoryInput] = useState(category);
  const [minPriceInput, setMinPriceInput] = useState(minPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(maxPrice);
  const [brandInput, setBrandInput] = useState(brand);
  const [sortInput, setSortInput] = useState(sort);
  const [inStockInput, setInStockInput] = useState(inStock === "true");

  useEffect(() => {
    setSearchInput(q);
  }, [q]);
  useEffect(() => {
    setCategoryInput(category);
  }, [category]);
  useEffect(() => {
    setMinPriceInput(minPrice);
  }, [minPrice]);
  useEffect(() => {
    setMaxPriceInput(maxPrice);
  }, [maxPrice]);
  useEffect(() => {
    setBrandInput(brand);
  }, [brand]);
  useEffect(() => {
    setSortInput(sort);
  }, [sort]);
  useEffect(() => {
    setInStockInput(inStock === "true");
  }, [inStock]);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchInput(value);
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        const sp = new URLSearchParams(window.location.search);
        if (value) sp.set("q", value);
        else sp.delete("q");
        sp.set("page", "0");
        const qs = sp.toString();
        router.push(`${pathname}${qs ? `?${qs}` : ""}`);
      }, 400);
    },
    [pathname, router],
  );

  const clearSearch = useCallback(() => {
    setSearchInput("");
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    const sp = new URLSearchParams(window.location.search);
    sp.delete("q");
    sp.set("page", "0");
    const qs = sp.toString();
    router.push(`${pathname}${qs ? `?${qs}` : ""}`);
  }, [pathname, router]);

  const handleFilterChange = useCallback(
    (key: string, value: string) => {
      const sp = new URLSearchParams(window.location.search);
      if (value) sp.set(key, value);
      else sp.delete(key);
      sp.set("page", "0");
      const qs = sp.toString();
      router.push(`${pathname}${qs ? `?${qs}` : ""}`);
    },
    [pathname, router],
  );

  const clearFilters = useCallback(() => {
    setSearchInput("");
    setCategoryInput("");
    setMinPriceInput("");
    setMaxPriceInput("");
    setBrandInput("");
    setSortInput("");
    setInStockInput(false);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    router.push(pathname);
  }, [pathname, router]);

  const goToPage = useCallback(
    (p: number) => {
      const sp = new URLSearchParams(window.location.search);
      if (p > 0) sp.set("page", String(p));
      else sp.delete("page");
      const qs = sp.toString();
      router.push(`${pathname}${qs ? `?${qs}` : ""}`);
    },
    [pathname, router],
  );

  const apiParams: ProductsParams = useMemo(
    () => ({
      page,
      size: 20,
      search: q || undefined,
      category: category || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      brand: brand || undefined,
      sort: sort || undefined,
      inStock: inStock === "true" || undefined,
    }),
    [page, q, category, minPrice, maxPrice, brand, sort, inStock],
  );

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["products", apiParams],
    queryFn: () => productsApi.getProducts(apiParams),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => productsApi.getCategories(),
  });

  const products = productsData?.content ?? [];
  const totalPages = productsData?.totalPages ?? 0;
  const totalElements = productsData?.totalElements ?? 0;
  const currentPage = productsData?.page ?? 0;

  const hasFilters =
    q || category || minPrice || maxPrice || brand || sort || inStock;

  const allCategories = useMemo(() => {
    if (!categories) return [];
    const flat: Array<{ id: string; name: string; slug: string; depth: number }> = [];
    const walk = (items: typeof categories, depth: number) => {
      for (const item of items) {
        flat.push({ id: item.id, name: item.name, slug: item.slug, depth });
        if (item.children?.length) walk(item.children, depth + 1);
      }
    };
    walk(categories, 0);
    return flat;
  }, [categories]);

  const filterContent = (isMobile: boolean) => (
    <div className={cn("space-y-5", isMobile ? "" : "space-y-6")}>
      {/* Category */}
      <div>
        <label className="mb-2 block text-[1.3rem] font-medium text-muted-foreground uppercase tracking-wide">
          Categoría
        </label>
        <div className="relative">
          <select
            value={categoryInput}
            onChange={(e) => {
              setCategoryInput(e.target.value);
              handleFilterChange("category", e.target.value);
            }}
            className="input-field w-full appearance-none px-3 py-2.5 text-[1.4rem] pr-8"
          >
            <option value="">Todas</option>
            {allCategories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.depth > 0 ? `${'\u00A0\u00A0\u00A0\u00A0'}${cat.name}` : cat.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      {/* Brand */}
      <div>
        <label className="mb-2 block text-[1.3rem] font-medium text-muted-foreground uppercase tracking-wide">
          Marca
        </label>
        <input
          type="text"
          placeholder="Buscar marca..."
          value={brandInput}
          onChange={(e) => {
            setBrandInput(e.target.value);
            handleFilterChange("brand", e.target.value);
          }}
          className="input-field w-full px-3 py-2.5 text-[1.4rem]"
        />
      </div>

      {/* Price Range */}
      <div>
        <label className="mb-2 block text-[1.3rem] font-medium text-muted-foreground uppercase tracking-wide">
          Precio
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Mín"
            value={minPriceInput}
            onChange={(e) => {
              setMinPriceInput(e.target.value);
              handleFilterChange("minPrice", e.target.value);
            }}
            className="input-field w-full px-3 py-2.5 text-[1.4rem]"
            min="0"
          />
          <span className="text-muted-foreground">-</span>
          <input
            type="number"
            placeholder="Máx"
            value={maxPriceInput}
            onChange={(e) => {
              setMaxPriceInput(e.target.value);
              handleFilterChange("maxPrice", e.target.value);
            }}
            className="input-field w-full px-3 py-2.5 text-[1.4rem]"
            min="0"
          />
        </div>
      </div>

      {/* In Stock */}
      <div>
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={inStockInput}
            onChange={(e) => {
              setInStockInput(e.target.checked);
              handleFilterChange("inStock", e.target.checked ? "true" : "");
            }}
            className="h-4 w-4 rounded border-border accent-brand-accent"
          />
          <span className="text-[1.4rem] text-foreground">Solo disponible</span>
        </label>
      </div>

      {/* Sort */}
      <div>
        <label className="mb-2 block text-[1.3rem] font-medium text-muted-foreground uppercase tracking-wide">
          Ordenar
        </label>
        <div className="relative">
          <select
            value={sortInput}
            onChange={(e) => {
              setSortInput(e.target.value);
              handleFilterChange("sort", e.target.value);
            }}
            className="input-field w-full appearance-none px-3 py-2.5 text-[1.4rem] pr-8"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-full px-5">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[3.2rem] font-bold text-foreground">Colección</h1>
          <p className="mt-1 text-[1.4rem] text-muted-foreground">
            {totalElements} {totalElements === 1 ? "producto" : "productos"}
          </p>
        </div>

        {/* Search + Mobile Filter Toggle */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="input-field w-full pl-12 pr-10 py-3 text-[1.4rem]"
            />
            {searchInput && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="btn-outline flex items-center gap-2 px-4 py-3 text-[1.4rem] sm:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
          </button>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden w-64 shrink-0 sm:block">
            <div className="sticky top-24 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-[1.6rem] font-semibold text-foreground">
                  Filtros
                </h2>
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-[1.2rem] text-brand-accent hover:underline"
                  >
                    Limpiar
                  </button>
                )}
              </div>
              {filterContent(false)}
            </div>
          </aside>

          {/* Mobile Filter Drawer */}
          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 sm:hidden">
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setMobileFiltersOpen(false)}
              />
              <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-background p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-[1.8rem] font-semibold text-foreground">
                    Filtros
                  </h2>
                  <button onClick={() => setMobileFiltersOpen(false)}>
                    <X className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>

                {/* Search inside mobile drawer */}
                <div className="mb-5">
                  <label className="mb-2 block text-[1.3rem] font-medium text-muted-foreground uppercase tracking-wide">
                    Buscar
                  </label>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Buscar productos..."
                      value={searchInput}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="input-field w-full pl-10 pr-3 py-2.5 text-[1.4rem]"
                    />
                  </div>
                </div>

                {filterContent(true)}

                <div className="mt-6 flex flex-col gap-3">
                  {hasFilters && (
                    <button
                      onClick={() => {
                        clearFilters();
                        setMobileFiltersOpen(false);
                      }}
                      className="btn-primary w-full py-3 text-[1.4rem]"
                    >
                      Limpiar filtros
                    </button>
                  )}
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="btn-black w-full py-3 text-[1.4rem]"
                  >
                    Ver resultados
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-1">
            {productsLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="card-starbucks overflow-hidden rounded-2xl"
                  >
                    <div className="aspect-square bg-muted animate-pulse" />
                    <div className="space-y-3 p-4">
                      <div className="h-3 w-16 rounded bg-muted animate-pulse" />
                      <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                      <div className="h-5 w-20 rounded bg-muted animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
                <Package className="mb-4 h-12 w-12 text-muted-foreground/40" />
                <h3 className="text-[1.8rem] font-semibold text-foreground">
                  No encontramos productos
                </h3>
                <p className="mt-2 text-[1.4rem] text-muted-foreground">
                  Intenta ajustar los filtros o realizar otra búsqueda.
                </p>
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="btn-primary mt-6 px-6 py-3 text-[1.4rem]"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 0}
                      className="btn-outline px-3 py-2 text-[1.4rem] disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      Anterior
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i).map(
                      (p) => {
                        if (
                          p === 0 ||
                          p === totalPages - 1 ||
                          (p >= currentPage - 2 && p <= currentPage + 2)
                        ) {
                          return (
                            <button
                              key={p}
                              onClick={() => goToPage(p)}
                              className={cn(
                                "min-w-[3.6rem] rounded-lg px-3 py-2 text-[1.4rem] boty-transition",
                                p === currentPage
                                  ? "bg-brand-accent text-white"
                                  : "text-foreground hover:bg-muted",
                              )}
                            >
                              {p + 1}
                            </button>
                          );
                        }
                        if (p === currentPage - 3 || p === currentPage + 3) {
                          return (
                            <span
                              key={p}
                              className="px-1 text-muted-foreground"
                            >
                              ...
                            </span>
                          );
                        }
                        return null;
                      },
                    )}
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage >= totalPages - 1}
                      className="btn-outline px-3 py-2 text-[1.4rem] disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center py-32">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-accent border-t-transparent" />
        </div>
      }
    >
      <CatalogPageContent />
    </Suspense>
  );
}
