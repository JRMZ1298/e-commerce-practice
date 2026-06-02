package com.ecommerce.catalog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record VariantRequest(
    @NotBlank String sku,
    String name,
    @PositiveOrZero BigDecimal price,
    @PositiveOrZero BigDecimal comparePrice,
    @PositiveOrZero BigDecimal costPrice,
    @PositiveOrZero Integer stock,
    Integer lowStockThreshold,
    Integer weightGrams,
    boolean isActive,
    Integer sortOrder,
    List<UUID> optionValueIds
) {}
