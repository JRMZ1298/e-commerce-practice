package com.ecommerce.order.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record OrderItemDto(
    UUID id,
    UUID variantId,
    String productName,
    String variantName,
    String productSlug,
    String imageUrl,
    int quantity,
    BigDecimal unitPrice,
    BigDecimal totalPrice
) {}
