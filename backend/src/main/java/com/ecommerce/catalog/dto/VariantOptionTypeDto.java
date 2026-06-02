package com.ecommerce.catalog.dto;

import java.util.List;
import java.util.UUID;

public record VariantOptionTypeDto(
    UUID id,
    String name,
    int sortOrder,
    List<VariantOptionValueDto> values
) {}
