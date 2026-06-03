package com.ecommerce.order.dto;

import com.ecommerce.order.entity.OrderStatus;

import java.time.Instant;
import java.util.UUID;

public record OrderStatusDto(
    UUID id,
    OrderStatus fromStatus,
    OrderStatus toStatus,
    String changedBy,
    String notes,
    Instant createdAt
) {}
