package com.ecommerce.catalog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record ProductRequest(
    UUID categoryId,
    @NotBlank String name,
    @NotBlank String slug,
    String description,
    String shortDescription,
    String sku,
    String brand,
    @PositiveOrZero BigDecimal basePrice,
    @PositiveOrZero BigDecimal comparePrice,
    @PositiveOrZero Integer stock,
    List<String> tags,
    boolean isFeatured
) {}
