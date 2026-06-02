package com.ecommerce.cart.service;

import com.ecommerce.cart.dto.CartDto;
import com.ecommerce.cart.dto.CartItemDto;
import com.ecommerce.cart.entity.Cart;
import com.ecommerce.cart.entity.CartItem;
import com.ecommerce.cart.repository.CartRepository;
import com.ecommerce.catalog.entity.Product;
import com.ecommerce.catalog.entity.ProductImage;
import com.ecommerce.catalog.entity.ProductVariant;
import com.ecommerce.catalog.repository.ProductImageRepository;
import com.ecommerce.catalog.repository.ProductVariantRepository;
import com.ecommerce.common.exception.BusinessException;
import com.ecommerce.common.exception.ResourceNotFoundException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartService {

    private final CartRepository cartRepository;
    private final ProductVariantRepository variantRepository;
    private final ProductImageRepository productImageRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;

    @PersistenceContext
    private EntityManager entityManager;

    private static final String CART_CACHE_PREFIX = "cart:";
    private static final long CART_CACHE_TTL = 6;

    public CartDto getCart(String sessionId, UUID userId) {
        Cart cart = resolveCart(sessionId, userId);
        return getCachedOrCompute(cart);
    }

    @Transactional
    public CartDto addItem(String sessionId, UUID userId, UUID variantId, int quantity) {
        ProductVariant variant = variantRepository.findById(variantId)
            .orElseThrow(() -> new ResourceNotFoundException("ProductVariant", variantId));

        if (!variant.isActive()) {
            throw new BusinessException("Variant is not available: " + variantId);
        }

        int availableStock = variant.getStock() - variant.getStockReserved();
        if (availableStock < quantity) {
            throw new BusinessException("Insufficient stock for variant: " + variantId);
        }

        Cart cart = resolveCart(sessionId, userId);

        Optional<CartItem> existingItem = cart.getItems().stream()
            .filter(item -> item.getVariant().getId().equals(variantId))
            .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            int newQty = item.getQuantity() + quantity;
            if (availableStock < newQty) {
                throw new BusinessException("Insufficient stock for variant: " + variantId);
            }
            item.setQuantity(newQty);
            item.setUnitPrice(variant.getPrice());
        } else {
            CartItem item = CartItem.builder()
                .cart(cart)
                .variant(variant)
                .quantity(quantity)
                .unitPrice(variant.getPrice())
                .build();
            cart.getItems().add(item);
        }

        cart = cartRepository.save(cart);
        evictCache(cart.getId());
        return toDto(cart);
    }

    @Transactional
    public CartDto updateItemQuantity(String sessionId, UUID userId, UUID variantId, int quantity) {
        Cart cart = resolveCart(sessionId, userId);

        CartItem item = cart.getItems().stream()
            .filter(i -> i.getVariant().getId().equals(variantId))
            .findFirst()
            .orElseThrow(() -> new ResourceNotFoundException("CartItem", variantId));

        if (quantity <= 0) {
            cart.getItems().remove(item);
        } else {
            ProductVariant variant = item.getVariant();
            int availableStock = variant.getStock() - variant.getStockReserved();
            if (availableStock < quantity) {
                throw new BusinessException("Insufficient stock for variant: " + variantId);
            }
            item.setQuantity(quantity);
            item.setUnitPrice(variant.getPrice());
        }

        cart = cartRepository.save(cart);
        evictCache(cart.getId());
        return toDto(cart);
    }

    @Transactional
    public CartDto removeItem(String sessionId, UUID userId, UUID variantId) {
        Cart cart = resolveCart(sessionId, userId);

        cart.getItems().removeIf(item -> item.getVariant().getId().equals(variantId));
        cart = cartRepository.save(cart);
        evictCache(cart.getId());
        return toDto(cart);
    }

    @Transactional
    public void clearCart(String sessionId, UUID userId) {
        Cart cart = resolveCart(sessionId, userId);
        cart.getItems().clear();
        cartRepository.save(cart);
        evictCache(cart.getId());
    }

    @Transactional
    public CartDto mergeGuestCart(String sessionId, UUID userId) {
        Cart guestCart = cartRepository.findBySessionIdAndStatus(sessionId, "ACTIVE").orElse(null);
        if (guestCart == null || guestCart.getItems().isEmpty()) {
            return getCart(null, userId);
        }

        Cart userCart = resolveCart(null, userId);

        for (CartItem guestItem : guestCart.getItems()) {
            UUID variantId = guestItem.getVariant().getId();
            Optional<CartItem> existing = userCart.getItems().stream()
                .filter(i -> i.getVariant().getId().equals(variantId))
                .findFirst();

            if (existing.isPresent()) {
                CartItem existingItem = existing.get();
                if (guestItem.getQuantity() > existingItem.getQuantity()) {
                    existingItem.setQuantity(guestItem.getQuantity());
                }
            } else {
                guestItem.setCart(userCart);
                userCart.getItems().add(guestItem);
            }
        }

        guestCart.getItems().clear();
        guestCart.setStatus("MERGED");
        cartRepository.save(guestCart);

        userCart = cartRepository.save(userCart);
        evictCache(userCart.getId());
        evictCache(guestCart.getId());
        return toDto(userCart);
    }

    Cart resolveCart(String sessionId, UUID userId) {
        if (userId != null) {
            return cartRepository.findByUserIdAndStatus(userId, "ACTIVE")
                .orElseGet(() -> createNewCart(sessionId, userId));
        }
        if (sessionId != null) {
            return cartRepository.findBySessionIdAndStatus(sessionId, "ACTIVE")
                .orElseGet(() -> createNewCart(sessionId, null));
        }
        return createNewCart(UUID.randomUUID().toString(), null);
    }

    private Cart createNewCart(String sessionId, UUID userId) {
        Cart cart = Cart.builder()
            .sessionId(sessionId)
            .status("ACTIVE")
            .build();
        if (userId != null) {
            cart.setUser(entityManager.getReference(com.ecommerce.auth.entity.User.class, userId));
        }
        return cartRepository.save(cart);
    }

    @SuppressWarnings("unchecked")
    private CartDto getCachedOrCompute(Cart cart) {
        String cacheKey = CART_CACHE_PREFIX + cart.getId();
        try {
            Object cached = redisTemplate.opsForValue().get(cacheKey);
            if (cached != null) {
                return objectMapper.readValue((String) cached, CartDto.class);
            }
        } catch (Exception e) {
            log.warn("Failed to read cart from cache: {}", e.getMessage());
        }

        CartDto dto = toDto(cart);
        try {
            String json = objectMapper.writeValueAsString(dto);
            redisTemplate.opsForValue().set(cacheKey, json, CART_CACHE_TTL, TimeUnit.HOURS);
        } catch (Exception e) {
            log.warn("Failed to cache cart: {}", e.getMessage());
        }
        return dto;
    }

    @SuppressWarnings("unchecked")
    private void evictCache(UUID cartId) {
        try {
            redisTemplate.delete(CART_CACHE_PREFIX + cartId);
        } catch (Exception e) {
            log.warn("Failed to evict cart cache: {}", e.getMessage());
        }
    }

    public CartDto toDto(Cart cart) {
        List<CartItemDto> items = cart.getItems().stream()
            .map(this::toItemDto)
            .toList();

        BigDecimal subtotal = items.stream()
            .map(CartItemDto::totalPrice)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalItems = items.stream()
            .mapToInt(CartItemDto::quantity)
            .sum();

        return new CartDto(
            cart.getId(),
            items,
            subtotal,
            subtotal,
            totalItems
        );
    }

    private CartItemDto toItemDto(CartItem item) {
        ProductVariant variant = item.getVariant();
        Product product = variant.getProduct();

        String imageUrl = productImageRepository.findByProductIdOrderBySortOrder(product.getId())
            .stream()
            .filter(ProductImage::isPrimary)
            .findFirst()
            .map(ProductImage::getUrl)
            .orElse(null);

        BigDecimal totalPrice = item.getUnitPrice()
            .multiply(BigDecimal.valueOf(item.getQuantity()));

        return new CartItemDto(
            item.getId(),
            variant.getId(),
            product.getName(),
            variant.getName() != null ? variant.getName() : product.getName(),
            product.getSlug(),
            imageUrl,
            item.getQuantity(),
            item.getUnitPrice(),
            totalPrice
        );
    }
}
