import api from './client'
import type { WishlistDto } from '@/types/wishlist'

export const wishlistApi = {
  getWishlist: () =>
    api.get<WishlistDto[]>('/v1/users/me/wishlist').then((r) => r.data),

  addToWishlist: (productId: string) =>
    api.post<WishlistDto>(`/v1/users/me/wishlist/${productId}`).then((r) => r.data),

  removeFromWishlist: (productId: string) =>
    api.delete(`/v1/users/me/wishlist/${productId}`).then((r) => r.data),
}
