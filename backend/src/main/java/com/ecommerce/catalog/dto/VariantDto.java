package com.ecommerce.catalog.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record VariantDto(
    UUID id,
    String sku,
    String name,
    BigDecimal price,
    BigDecimal comparePrice,
    int stock,
    int stockReserved,
    boolean isActive,
    int sortOrder,
    List<VariantOptionValueDto> optionValues
) {}
