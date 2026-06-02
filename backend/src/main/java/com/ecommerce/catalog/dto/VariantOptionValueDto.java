package com.ecommerce.catalog.dto;

import java.util.UUID;

public record VariantOptionValueDto(
    UUID id,
    String value,
    int sortOrder
) {}
