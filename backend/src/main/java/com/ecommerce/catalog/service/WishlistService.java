package com.ecommerce.catalog.service;

import com.ecommerce.auth.entity.User;
import com.ecommerce.auth.repository.UserRepository;
import com.ecommerce.catalog.dto.WishlistDto;
import com.ecommerce.catalog.entity.Product;
import com.ecommerce.catalog.entity.ProductImage;
import com.ecommerce.catalog.entity.Wishlist;
import com.ecommerce.catalog.repository.ProductImageRepository;
import com.ecommerce.catalog.repository.ProductRepository;
import com.ecommerce.catalog.repository.WishlistRepository;
import com.ecommerce.common.exception.BusinessException;
import com.ecommerce.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<WishlistDto> getWishlist(UUID userId) {
        return wishlistRepository.findByUserIdOrderByAddedAtDesc(userId)
            .stream()
            .map(this::toWishlistDto)
            .toList();
    }

    @Transactional
    public WishlistDto addToWishlist(UUID userId, UUID productId) {
        if (wishlistRepository.existsByUserIdAndProductId(userId, productId)) {
            throw new BusinessException("Product is already in the wishlist");
        }

        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new ResourceNotFoundException("Product", productId));

        User user = userRepository.getReferenceById(userId);

        Wishlist wishlist = Wishlist.builder()
            .user(user)
            .product(product)
            .build();

        wishlist = wishlistRepository.save(wishlist);
        return toWishlistDto(wishlist);
    }

    @Transactional
    public void removeFromWishlist(UUID userId, UUID productId) {
        wishlistRepository.deleteByUserIdAndProductId(userId, productId);
    }

    @Transactional(readOnly = true)
    public boolean isInWishlist(UUID userId, UUID productId) {
        return wishlistRepository.existsByUserIdAndProductId(userId, productId);
    }

    private WishlistDto toWishlistDto(Wishlist wishlist) {
        Product product = wishlist.getProduct();
        String primaryImage = productImageRepository.findByProductIdOrderBySortOrder(product.getId())
            .stream()
            .filter(ProductImage::isPrimary)
            .findFirst()
            .map(ProductImage::getUrl)
            .orElse(null);

        return new WishlistDto(
            wishlist.getId(),
            product.getId(),
            product.getName(),
            product.getSlug(),
            primaryImage,
            wishlist.getAddedAt()
        );
    }
}
