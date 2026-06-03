package com.ecommerce.order.dto;

import com.ecommerce.order.entity.Coupon;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.Instant;

public record CouponRequest(
    @NotBlank String code,
    @NotNull Coupon.Type type,
    @NotNull BigDecimal value,
    BigDecimal minPurchase,
    int maxUses,
    Instant expiresAt,
    boolean isActive
) {}
