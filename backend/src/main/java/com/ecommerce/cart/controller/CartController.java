package com.ecommerce.cart.controller;

import com.ecommerce.cart.dto.CartDto;
import com.ecommerce.cart.dto.CartRequest;
import com.ecommerce.cart.service.CartService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/v1/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartDto> getCart(
            @AuthenticationPrincipal UUID userId,
            HttpServletRequest request) {
        String sessionId = resolveSessionId(request, userId);
        return ResponseEntity.ok(cartService.getCart(sessionId, userId));
    }

    @PostMapping("/items")
    public ResponseEntity<CartDto> addItem(
            @AuthenticationPrincipal UUID userId,
            @Valid @RequestBody CartRequest cartRequest,
            HttpServletRequest request) {
        String sessionId = resolveSessionId(request, userId);
        return ResponseEntity.ok(cartService.addItem(sessionId, userId,
            cartRequest.variantId(), cartRequest.quantity()));
    }

    @PatchMapping("/items/{variantId}")
    public ResponseEntity<CartDto> updateItemQuantity(
            @AuthenticationPrincipal UUID userId,
            @PathVariable UUID variantId,
            @RequestParam int quantity,
            HttpServletRequest request) {
        String sessionId = resolveSessionId(request, userId);
        return ResponseEntity.ok(cartService.updateItemQuantity(sessionId, userId, variantId, quantity));
    }

    @DeleteMapping("/items/{variantId}")
    public ResponseEntity<CartDto> removeItem(
            @AuthenticationPrincipal UUID userId,
            @PathVariable UUID variantId,
            HttpServletRequest request) {
        String sessionId = resolveSessionId(request, userId);
        return ResponseEntity.ok(cartService.removeItem(sessionId, userId, variantId));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(
            @AuthenticationPrincipal UUID userId,
            HttpServletRequest request) {
        String sessionId = resolveSessionId(request, userId);
        cartService.clearCart(sessionId, userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/merge")
    public ResponseEntity<CartDto> mergeCart(
            @AuthenticationPrincipal UUID userId,
            HttpServletRequest request) {
        String sessionId = resolveSessionId(request, userId);
        return ResponseEntity.ok(cartService.mergeGuestCart(sessionId, userId));
    }

    private String resolveSessionId(HttpServletRequest request, UUID userId) {
        if (userId != null) {
            return null;
        }
        String sessionId = request.getHeader("X-Session-Id");
        if (sessionId == null || sessionId.isBlank()) {
            Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if ("session_id".equals(cookie.getName())) {
                        sessionId = cookie.getValue();
                        break;
                    }
                }
            }
        }
        if (sessionId == null || sessionId.isBlank()) {
            sessionId = UUID.randomUUID().toString();
        }
        return sessionId;
    }
}
