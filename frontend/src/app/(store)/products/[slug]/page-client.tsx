"use client";

import { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { useParams, notFound, useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Heart,
  ShoppingBag,
  Minus,
  Plus,
  ChevronLeft,
  Truck,
  Shield,
  RotateCcw,
  Package,
  Check,
  Star,
} from "lucide-react";
import { productsApi } from "@/lib/api/products";
import { wishlistApi } from "@/lib/api/wishlist";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice } from "@/lib/utils/formatPrice";
import { cn } from "@/lib/utils/cn";
import type {
  Product,
  ProductImage,
  ProductVariant,
  VariantOptionType,
} from "@/types/product";
import type { CartItem } from "@/types/cart";

function getPrimaryImage(product: Product): ProductImage | undefined {
  return product.images.find((img) => img.isPrimary) ?? product.images[0];
}

function findMatchingVariant(
  variants: ProductVariant[],
  selection: Record<string, string>,
): ProductVariant | undefined {
  const selectedIds = Object.values(selection).filter(Boolean);
  if (selectedIds.length === 0) return undefined;
  return variants.find((v) => {
    const variantValueIds = v.optionValues.map((ov) => ov.id).sort();
    const matchIds = [...selectedIds].sort();
    return (
      variantValueIds.length === matchIds.length &&
      variantValueIds.every((id) => matchIds.includes(id))
    );
  });
}

function buildInitialSelection(
  optionTypes: VariantOptionType[],
): Record<string, string> {
  const selection: Record<string, string> = {};
  for (const ot of optionTypes) {
    if (ot.values.length > 0) {
      selection[ot.id] = ot.values[0].id;
    }
  }
  return selection;
}

export default function ProductDetailPageClient() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => productsApi.getProductBySlug(slug),
    enabled: !!slug,
  });

  const { data: wishlist } = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => wishlistApi.getWishlist(),
    enabled: isAuthenticated,
  });

  const addToWishlistMutation = useMutation({
    mutationFn: (productId: string) => wishlistApi.addToWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: (productId: string) =>
      wishlistApi.removeFromWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  const [userSelection, setUserSelection] = useState<Record<
    string,
    string
  > | null>(null);

  const variantSelection = useMemo(() => {
    return (
      userSelection ??
      (product ? buildInitialSelection(product.optionTypes) : {})
    );
  }, [userSelection, product]);

  const selectedVariant = useMemo(() => {
    if (!product || product.variants.length === 0) return undefined;
    if (Object.keys(variantSelection).length === 0) return undefined;
    return findMatchingVariant(product.variants, variantSelection);
  }, [product, variantSelection]);

  const displayPrice = selectedVariant?.price ?? product?.basePrice ?? 0;
  const displayComparePrice =
    selectedVariant?.comparePrice ?? product?.comparePrice ?? null;
  const displayStock = selectedVariant?.stock ?? product?.stock ?? 0;
  const displayName = selectedVariant?.name ?? product?.name ?? "";

  const images = useMemo(() => {
    if (!product?.images) return [];
    return [...product.images].sort((a, b) => {
      if (a.isPrimary === b.isPrimary) return 0;
      return a.isPrimary ? -1 : 1;
    });
  }, [product?.images]);

  const primaryImage = product ? getPrimaryImage(product) : undefined;
  const currentImage = images[selectedImageIndex] ?? primaryImage;

  const isInWishlist = useMemo(() => {
    if (!wishlist || !product) return false;
    return wishlist.some((w) => w.productId === product.id);
  }, [wishlist, product]);

  const handleVariantSelect = useCallback(
    (optionTypeId: string, valueId: string) => {
      setUserSelection((prev) => ({
        ...(prev ?? variantSelection),
        [optionTypeId]: valueId,
      }));
      setQuantity(1);
    },
    [variantSelection],
  );

  const handleAddToCart = useCallback(() => {
    if (!product || displayStock === 0) return;
    if (!isAuthenticated) {
      router.push(`/auth?mode=login&redirect=/products/${slug}`);
      return;
    }
    const item: CartItem = {
      id: selectedVariant?.id ?? product.id,
      variantId: selectedVariant?.id ?? product.id,
      productName: product.name,
      variantName: displayName,
      quantity,
      unitPrice: displayPrice,
      totalPrice: displayPrice * quantity,
      imageUrl: primaryImage?.url ?? "",
    };
    addItem(item);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  }, [
    product,
    selectedVariant,
    displayName,
    displayPrice,
    displayStock,
    quantity,
    primaryImage,
    addItem,
    isAuthenticated,
    router,
    slug,
  ]);

  const handleWishlistToggle = useCallback(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!product) return;
    if (isInWishlist) {
      removeFromWishlistMutation.mutate(product.id);
    } else {
      addToWishlistMutation.mutate(product.id);
    }
  }, [
    isAuthenticated,
    product,
    isInWishlist,
    router,
    removeFromWishlistMutation,
    addToWishlistMutation,
  ]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
      </div>
    );
  }

  if (isError || !product) {
    notFound();
  }

  const maxQuantity = displayStock;

  return (
    <div className="bg-cards">
      <div className="mx-auto max-w-col-xl px-6 lg:px-8">
        <nav className="flex items-center gap-2 py-6 text-[1.4rem] text-muted-foreground">
          <Link href="/" className="hover:text-brand-accent boty-transition">
            Inicio
          </Link>
          <ChevronLeft className="h-3 w-3 rotate-180" />
          <Link
            href="/products"
            className="hover:text-brand-accent boty-transition"
          >
            Colección
          </Link>
          <ChevronLeft className="h-3 w-3 rotate-180" />
          <span className="text-foreground truncate min-w-0">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-8 pb-12 lg:grid-cols-12 lg:gap-12">
          <ImageGallery
            images={images}
            currentImage={currentImage}
            selectedImageIndex={selectedImageIndex}
            productName={product.name}
            onSelectImage={setSelectedImageIndex}
          />

          <div className="lg:col-span-5">
            <ProductInfoSection
              brand={product.brand ?? undefined}
              name={product.name}
              displayPrice={displayPrice}
              displayComparePrice={displayComparePrice}
              displayStock={displayStock}
              shortDescription={product.shortDescription}
              description={product.description}
              descriptionExpanded={descriptionExpanded}
              onToggleDescription={() =>
                setDescriptionExpanded(!descriptionExpanded)
              }
            />

            <VariantSelector
              optionTypes={product.optionTypes}
              variantSelection={variantSelection}
              selectedVariant={selectedVariant}
              onSelectVariant={handleVariantSelect}
            />

            <AddToCartSection
              quantity={quantity}
              maxQuantity={maxQuantity}
              displayStock={displayStock}
              addedFeedback={addedFeedback}
              isInWishlist={isInWishlist}
              onQuantityChange={setQuantity}
              onAddToCart={handleAddToCart}
              onWishlistToggle={handleWishlistToggle}
            />

            <TrustBadgesSection />
          </div>
        </div>
      </div>
    </div>
  );
}

function ImageGallery({
  images,
  currentImage,
  selectedImageIndex,
  productName,
  onSelectImage,
}: {
  images: Array<{ id: string; url: string; altText?: string }>;
  currentImage?: { url: string; altText?: string };
  selectedImageIndex: number;
  productName: string;
  onSelectImage: (index: number) => void;
}) {
  return (
    <div className="lg:col-span-7">
      <div
        className="relative overflow-hidden rounded-3xl bg-ceramic"
        style={{ aspectRatio: "4 / 5", maxHeight: "680px" }}
      >
        {currentImage ? (
          <Image
            src={currentImage.url}
            alt={currentImage.altText || productName}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 58vw"
          />
        ) : (
          <div
            className="flex items-center justify-center text-muted-foreground/20"
            style={{ aspectRatio: "4 / 5", maxHeight: "680px" }}
          >
            <Package className="h-20 w-20" />
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={img.id}
              type="button"
              onClick={() => onSelectImage(idx)}
              className={cn(
                "relative flex-shrink-0 overflow-hidden rounded-xl border-2 boty-transition w-20 h-20",
                idx === selectedImageIndex
                  ? "border-brand-accent"
                  : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              <Image
                src={img.url}
                alt={img.altText || `${productName} ${idx + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductInfoSection({
  brand,
  name,
  displayPrice,
  displayComparePrice,
  displayStock,
  shortDescription,
  description,
  descriptionExpanded,
  onToggleDescription,
}: {
  brand?: string;
  name: string;
  displayPrice: number;
  displayComparePrice: number | null;
  displayStock: number;
  shortDescription?: string;
  description?: string;
  descriptionExpanded: boolean;
  onToggleDescription: () => void;
}) {
  return (
    <>
      {brand && (
        <p className="mb-2 text-[1.4rem] font-medium uppercase tracking-wide text-brand-accent">
          {brand}
        </p>
      )}

      <h1 className="font-serif text-[3.2rem] leading-tight text-foreground md:text-[4rem]">
        {name}
      </h1>

      <div className="mt-4 flex items-center gap-3">
        <span className="text-[2.8rem] font-semibold text-foreground">
          {formatPrice(displayPrice)}
        </span>
        {displayComparePrice && displayComparePrice > displayPrice && (
          <span className="text-[1.8rem] text-muted-foreground line-through">
            {formatPrice(displayComparePrice)}
          </span>
        )}
        {displayStock === 0 && (
          <span className="rounded-full bg-red-50 px-3 py-1 text-[1.2rem] font-semibold text-red-500">
            Agotado
          </span>
        )}
      </div>

      {shortDescription && (
        <p className="mt-4 text-[1.6rem] leading-relaxed text-muted-foreground">
          {shortDescription}
        </p>
      )}

      {description && (
        <div className="mt-4">
          <div
            className={cn(
              "text-[1.5rem] leading-relaxed text-muted-foreground overflow-hidden boty-transition",
              !descriptionExpanded && "line-clamp-3",
            )}
          >
            {description}
          </div>
          <button
            type="button"
            onClick={onToggleDescription}
            className="mt-2 text-[1.4rem] font-medium text-brand-accent hover:underline"
          >
            {descriptionExpanded ? "Ver menos" : "Ver más"}
          </button>
        </div>
      )}
    </>
  );
}

function VariantSelector({
  optionTypes,
  variantSelection,
  selectedVariant,
  onSelectVariant,
}: {
  optionTypes: Array<{
    id: string;
    name: string;
    values: Array<{ id: string; value: string }>;
  }>;
  variantSelection: Record<string, string>;
  selectedVariant?: { name?: string };
  onSelectVariant: (optionTypeId: string, valueId: string) => void;
}) {
  if (optionTypes.length === 0) return null;

  return (
    <div className="mt-6 space-y-5">
      {optionTypes.map((optionType) => (
        <div key={optionType.id}>
          <p className="mb-2 text-[1.4rem] font-medium text-foreground">
            {optionType.name}
          </p>
          <div className="flex flex-wrap gap-2">
            {optionType.values.map((value) => {
              const isSelected = variantSelection[optionType.id] === value.id;
              return (
                <button
                  key={value.id}
                  type="button"
                  onClick={() => onSelectVariant(optionType.id, value.id)}
                  className={cn(
                    "rounded-full border px-5 py-2 text-[1.3rem] font-medium boty-transition",
                    isSelected
                      ? "border-brand-accent bg-brand-accent text-white"
                      : "border-border bg-white text-foreground-muted hover:border-brand-accent/50",
                  )}
                >
                  {value.value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {selectedVariant?.name && (
        <p className="text-[1.4rem] text-muted-foreground">
          Variante:{" "}
          <span className="font-medium text-foreground">
            {selectedVariant.name}
          </span>
        </p>
      )}
    </div>
  );
}

function AddToCartSection({
  quantity,
  maxQuantity,
  displayStock,
  addedFeedback,
  isInWishlist,
  onQuantityChange,
  onAddToCart,
  onWishlistToggle,
}: {
  quantity: number;
  maxQuantity: number;
  displayStock: number;
  addedFeedback: boolean;
  isInWishlist: boolean;
  onQuantityChange: (q: number | ((prev: number) => number)) => void;
  onAddToCart: () => void;
  onWishlistToggle: () => void;
}) {
  return (
    <div className="mt-8 flex items-center gap-4 flex-wrap">
      <div className="flex items-center rounded-full border border-border">
        <button
          type="button"
          onClick={() => onQuantityChange((q) => Math.max(1, q - 1))}
          disabled={quantity <= 1}
          className="flex h-11 w-11 items-center justify-center text-foreground disabled:text-muted-foreground/40 boty-transition hover:text-brand-accent"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="flex h-11 w-14 items-center justify-center text-[1.6rem] font-medium text-foreground select-none">
          {quantity}
        </span>
        <button
          type="button"
          onClick={() => onQuantityChange((q) => Math.min(maxQuantity, q + 1))}
          disabled={quantity >= maxQuantity}
          className="flex h-11 w-11 items-center justify-center text-foreground disabled:text-muted-foreground/40 boty-transition hover:text-brand-accent"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <button
        type="button"
        disabled={displayStock === 0}
        onClick={onAddToCart}
        className={cn(
          "btn-primary flex-1 gap-2 px-6 py-3 text-[1.5rem]",
          displayStock === 0 && "pointer-events-none opacity-50",
        )}
      >
        {addedFeedback ? (
          <>
            <Check className="h-5 w-5" /> Agregado
          </>
        ) : (
          <>
            <ShoppingBag className="h-5 w-5" /> Agregar al carrito
          </>
        )}
      </button>

      <button
        type="button"
        onClick={onWishlistToggle}
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-full border-none boty-transition",
          isInWishlist
            ? "border-red-200 bg-red-50 text-red-500"
            : "border-border text-muted-foreground hover:border-red-200 hover:text-red-400",
        )}
      >
        <Heart className={cn("h-5 w-5", isInWishlist && "fill-red-500")} />
      </button>
    </div>
  );
}

function TrustBadgesSection() {
  return (
    <div className="mt-10 grid grid-cols-1 gap-4 rounded-2xl bg-background p-6 sm:grid-cols-2">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-green-light/30">
          <Truck className="h-5 w-5 text-brand-green" />
        </div>
        <div>
          <p className="text-[1.3rem] font-semibold text-foreground">
            Envío gratis
          </p>
          <p className="text-[1.2rem] text-muted-foreground">
            En pedidos +$999
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-green-light/30">
          <Shield className="h-5 w-5 text-brand-green" />
        </div>
        <div>
          <p className="text-[1.3rem] font-semibold text-foreground">
            Pago seguro
          </p>
          <p className="text-[1.2rem] text-muted-foreground">
            Datos protegidos
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-green-light/30">
          <RotateCcw className="h-5 w-5 text-brand-green" />
        </div>
        <div>
          <p className="text-[1.3rem] font-semibold text-foreground">
            Devolución gratis
          </p>
          <p className="text-[1.2rem] text-muted-foreground">30 días</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-green-light/30">
          <Star className="h-5 w-5 text-brand-green" />
        </div>
        <div>
          <p className="text-[1.3rem] font-semibold text-foreground">
            Calidad premium
          </p>
          <p className="text-[1.2rem] text-muted-foreground">
            Materiales seleccionados
          </p>
        </div>
      </div>
    </div>
  );
}
