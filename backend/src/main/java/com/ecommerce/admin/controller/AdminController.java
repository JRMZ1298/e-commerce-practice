package com.ecommerce.admin.controller;

import com.ecommerce.admin.service.AdminService;
import com.ecommerce.catalog.dto.*;
import com.ecommerce.order.dto.*;
import com.ecommerce.order.entity.OrderStatus;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/categories")
    public ResponseEntity<CategoryDto> createCategory(@Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(adminService.createCategory(request));
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<CategoryDto> updateCategory(@PathVariable UUID id,
                                                       @Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.ok(adminService.updateCategory(id, request));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable UUID id) {
        adminService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/products")
    public ResponseEntity<ProductDto> createProduct(@Valid @RequestBody ProductRequest request,
                                                     @AuthenticationPrincipal UUID userId) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(adminService.createProduct(request, userId));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<ProductDto> updateProduct(@PathVariable UUID id,
                                                     @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(adminService.updateProduct(id, request));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable UUID id) {
        adminService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/products/{productId}/option-types")
    public ResponseEntity<List<VariantOptionTypeDto>> updateOptionTypes(
            @PathVariable UUID productId,
            @Valid @RequestBody List<VariantOptionTypeRequest> types) {
        return ResponseEntity.ok(adminService.updateOptionTypes(productId, types));
    }

    @PostMapping("/products/{productId}/variants")
    public ResponseEntity<VariantDto> createVariant(@PathVariable UUID productId,
                                                     @Valid @RequestBody VariantRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(adminService.createVariant(productId, request));
    }

    @PutMapping("/variants/{variantId}")
    public ResponseEntity<VariantDto> updateVariant(@PathVariable UUID variantId,
                                                     @Valid @RequestBody VariantRequest request) {
        return ResponseEntity.ok(adminService.updateVariant(variantId, request));
    }

    @DeleteMapping("/variants/{variantId}")
    public ResponseEntity<Void> deleteVariant(@PathVariable UUID variantId) {
        adminService.deleteVariant(variantId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/orders")
    public ResponseEntity<List<OrderDto>> getOrders(
            @RequestParam(required = false) OrderStatus status) {
        return ResponseEntity.ok(adminService.getAllOrders(status));
    }

    @GetMapping("/orders/{orderNumber}")
    public ResponseEntity<OrderDto> getOrderByNumber(@PathVariable String orderNumber) {
        return ResponseEntity.ok(adminService.getOrderByNumber(orderNumber));
    }

    @PutMapping("/orders/{orderNumber}/status")
    public ResponseEntity<OrderDto> updateOrderStatus(
            @AuthenticationPrincipal UUID adminId,
            @PathVariable String orderNumber,
            @Valid @RequestBody AdminOrderStatusRequest request) {
        return ResponseEntity.ok(
            adminService.updateOrderStatus(adminId, orderNumber, request.status(), request.notes()));
    }

    @GetMapping("/coupons")
    public ResponseEntity<List<CouponDto>> getCoupons() {
        return ResponseEntity.ok(adminService.getAllCoupons());
    }

    @PostMapping("/coupons")
    public ResponseEntity<CouponDto> createCoupon(@Valid @RequestBody CouponRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(adminService.createCoupon(request));
    }

    @PutMapping("/coupons/{id}")
    public ResponseEntity<CouponDto> updateCoupon(@PathVariable UUID id,
                                                    @Valid @RequestBody CouponRequest request) {
        return ResponseEntity.ok(adminService.updateCoupon(id, request));
    }

    @DeleteMapping("/coupons/{id}")
    public ResponseEntity<Void> deleteCoupon(@PathVariable UUID id) {
        adminService.deleteCoupon(id);
        return ResponseEntity.noContent().build();
    }
}
