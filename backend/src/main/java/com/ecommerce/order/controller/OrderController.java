package com.ecommerce.order.controller;

import com.ecommerce.order.dto.*;
import com.ecommerce.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderDto> createOrder(
            @AuthenticationPrincipal UUID userId,
            @Valid @RequestBody CreateOrderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(orderService.createOrder(userId, request));
    }

    @GetMapping
    public ResponseEntity<List<OrderDto>> getUserOrders(
            @AuthenticationPrincipal UUID userId) {
        return ResponseEntity.ok(orderService.getUserOrders(userId));
    }

    @GetMapping("/{orderNumber}")
    public ResponseEntity<OrderDto> getOrderByNumber(
            @AuthenticationPrincipal UUID userId,
            @PathVariable String orderNumber) {
        return ResponseEntity.ok(orderService.getOrderByNumber(userId, orderNumber));
    }

    @PostMapping("/{orderNumber}/cancel")
    public ResponseEntity<Void> cancelOrder(
            @AuthenticationPrincipal UUID userId,
            @PathVariable String orderNumber) {
        orderService.cancelOrder(userId, orderNumber);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/validate-coupon")
    public ResponseEntity<ValidateCouponResponse> validateCoupon(
            @Valid @RequestBody ValidateCouponRequest request) {
        return ResponseEntity.ok(orderService.validateCoupon(request));
    }
}
