package com.ecommerce.catalog.dto;

import java.util.List;
import java.util.UUID;

public record CategoryDto(
    UUID id,
    String name,
    String slug,
    String description,
    String imageUrl,
    UUID parentId,
    List<CategoryDto> children
) {}
