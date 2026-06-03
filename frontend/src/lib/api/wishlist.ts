import api from "./client";
import type { WishlistDto } from "@/types/wishlist";

export const wishlistApi = {
  getWishlist: () =>
    api.get<WishlistDto[]>("/users/me/wishlist").then((r) => r.data),

  addToWishlist: (productId: string) =>
    api
      .post<WishlistDto>(`/users/me/wishlist/${productId}`)
      .then((r) => r.data),

  removeFromWishlist: (productId: string) =>
    api.delete(`/users/me/wishlist/${productId}`).then((r) => r.data),
};
