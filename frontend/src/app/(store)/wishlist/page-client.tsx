'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Heart, ShoppingBag, Trash2, Share2 } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/hooks/useAuth'
import { wishlistApi } from '@/lib/api/wishlist'
import { formatDate } from '@/lib/utils/formatDate'
import { cn } from '@/lib/utils/cn'
import type { WishlistDto } from '@/types/wishlist'

export default function WishlistPageClient() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuth()

  const { data: wishlist, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: wishlistApi.getWishlist,
    enabled: isAuthenticated,
  })

  const removeMutation = useMutation({
    mutationFn: (productId: string) => wishlistApi.removeFromWishlist(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ['wishlist'] })
      const previous = queryClient.getQueryData<WishlistDto[]>(['wishlist'])
      queryClient.setQueryData<WishlistDto[]>(['wishlist'], (old) =>
        old?.filter((item) => item.productId !== productId) ?? []
      )
      return { previous }
    },
    onError: (_err, _productId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['wishlist'], context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
    },
  })

  if (!isAuthenticated) {
    return (
      <section className="section-padding">
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <Heart className="mb-6 h-12 w-12 text-brand-green-light/40" />
          <h1 className="font-sans text-[2.4rem] font-bold text-brand-green">
            Mis Favoritos
          </h1>
          <p className="mt-2 text-[1.4rem] text-muted-foreground">
            Inicia sesión para guardar tus favoritos
          </p>
          <Link href="/login" className="btn-primary mt-6">
            Iniciar sesión
          </Link>
        </div>
      </section>
    )
  }

  if (isLoading) {
    return (
      <section className="section-padding">
        <div className="flex min-h-[60vh] flex-col items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
        </div>
      </section>
    )
  }

  if (!wishlist?.length) {
    return (
      <section className="section-padding">
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <Heart className="mb-6 h-12 w-12 text-brand-green-light/40" />
          <h1 className="font-sans text-[2.4rem] font-bold text-brand-green">
            Mis Favoritos
          </h1>
          <p className="mt-2 text-[1.4rem] text-muted-foreground">
            No tienes productos favoritos
          </p>
          <Link href="/products" className="btn-primary mt-6">
            Explorar productos
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="section-padding">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-sans text-[2.4rem] font-bold text-brand-green">
              Mis Favoritos
            </h1>
            <p className="mt-1 text-[1.4rem] text-muted-foreground">
              {wishlist.length} {wishlist.length === 1 ? 'producto' : 'productos'}
            </p>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 rounded-full border border-brand-accent/20 px-4 py-2 text-[1.4rem] text-foreground transition-all hover:bg-brand-green/5"
          >
            <Share2 className="h-4 w-4" />
            Compartir
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="group overflow-hidden rounded-3xl bg-white boty-shadow boty-transition hover:scale-[1.02]"
            >
              <Link
                href={`/products/${item.productSlug}`}
                className="relative block aspect-square overflow-hidden bg-muted"
              >
                {item.productImage ? (
                  <Image
                    src={item.productImage}
                    alt={item.productName}
                    fill
                    className="object-cover boty-transition group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground/20">
                    <ShoppingBag className="h-16 w-16" />
                  </div>
                )}
              </Link>

              <div className="p-4">
                <Link
                  href={`/products/${item.productSlug}`}
                  className="text-[1.5rem] font-semibold text-foreground transition-colors hover:text-brand-accent"
                >
                  {item.productName}
                </Link>
                <p className="mt-1 text-[1.3rem] text-muted-foreground">
                  Agregado {formatDate(item.addedAt)}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    className={cn('btn-primary flex-1 text-[1.2rem] py-[6px]')}
                    onClick={() => router.push(`/products/${item.productSlug}`)}
                  >
                    <ShoppingBag className="mr-1.5 inline h-3.5 w-3.5" />
                    Agregar al carrito
                  </button>
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-red-200 text-red-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                    onClick={() => removeMutation.mutate(item.productId)}
                    disabled={removeMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}