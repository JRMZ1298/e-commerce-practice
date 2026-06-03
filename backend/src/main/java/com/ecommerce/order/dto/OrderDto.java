package com.ecommerce.order.dto;

import com.ecommerce.order.entity.OrderStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record OrderDto(
    UUID id,
    String orderNumber,
    OrderStatus status,
    BigDecimal subtotal,
    BigDecimal discount,
    BigDecimal total,
    String couponCode,
    String shippingAddress,
    String notes,
    List<OrderItemDto> items,
    List<OrderStatusDto> statusHistory,
    Instant createdAt,
    Instant updatedAt
) {}
