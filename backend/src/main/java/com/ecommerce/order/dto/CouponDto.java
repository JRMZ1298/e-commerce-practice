package com.ecommerce.order.dto;

import com.ecommerce.order.entity.Coupon;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record CouponDto(
    UUID id,
    String code,
    Coupon.Type type,
    BigDecimal value,
    BigDecimal minPurchase,
    int maxUses,
    int usedCount,
    Instant expiresAt,
    boolean isActive,
    Instant createdAt
) {}
