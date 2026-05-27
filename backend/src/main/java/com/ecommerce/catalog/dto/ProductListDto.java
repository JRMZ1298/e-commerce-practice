package com.ecommerce.catalog.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record ProductListDto(
    UUID id,
    String name,
    String slug,
    String brand,
    BigDecimal basePrice,
    BigDecimal comparePrice,
    int stock,
    boolean isFeatured,
    String primaryImage,
    String categoryName,
    Instant createdAt
) {}
