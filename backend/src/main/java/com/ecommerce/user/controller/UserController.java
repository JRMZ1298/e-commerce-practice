package com.ecommerce.user.controller;

import com.ecommerce.auth.dto.UserDto;
import com.ecommerce.catalog.dto.WishlistDto;
import com.ecommerce.catalog.service.WishlistService;
import com.ecommerce.user.dto.*;
import com.ecommerce.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/users/me")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<UserDto> getProfile(@AuthenticationPrincipal UUID userId) {
        return ResponseEntity.ok(userService.getProfile(userId));
    }

    @PatchMapping
    public ResponseEntity<UserDto> updateProfile(@AuthenticationPrincipal UUID userId,
                                                  @Valid @RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(userService.updateProfile(userId, request));
    }

    @PutMapping("/password")
    public ResponseEntity<Void> changePassword(@AuthenticationPrincipal UUID userId,
                                                @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(userId, request);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/addresses")
    public ResponseEntity<List<AddressDto>> getAddresses(@AuthenticationPrincipal UUID userId) {
        return ResponseEntity.ok(userService.getAddresses(userId));
    }

    @PostMapping("/addresses")
    public ResponseEntity<AddressDto> createAddress(@AuthenticationPrincipal UUID userId,
                                                     @Valid @RequestBody AddressRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(userService.createAddress(userId, request));
    }

    @PutMapping("/addresses/{id}")
    public ResponseEntity<AddressDto> updateAddress(@AuthenticationPrincipal UUID userId,
                                                     @PathVariable UUID id,
                                                     @Valid @RequestBody AddressRequest request) {
        return ResponseEntity.ok(userService.updateAddress(userId, id, request));
    }

    @DeleteMapping("/addresses/{id}")
    public ResponseEntity<Void> deleteAddress(@AuthenticationPrincipal UUID userId,
                                               @PathVariable UUID id) {
        userService.deleteAddress(userId, id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/wishlist")
    public ResponseEntity<List<WishlistDto>> getWishlist(@AuthenticationPrincipal UUID userId) {
        return ResponseEntity.ok(wishlistService.getWishlist(userId));
    }

    @PostMapping("/wishlist/{productId}")
    public ResponseEntity<WishlistDto> addToWishlist(@AuthenticationPrincipal UUID userId,
                                                      @PathVariable UUID productId) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(wishlistService.addToWishlist(userId, productId));
    }

    @DeleteMapping("/wishlist/{productId}")
    public ResponseEntity<Void> removeFromWishlist(@AuthenticationPrincipal UUID userId,
                                                    @PathVariable UUID productId) {
        wishlistService.removeFromWishlist(userId, productId);
        return ResponseEntity.noContent().build();
    }
}
