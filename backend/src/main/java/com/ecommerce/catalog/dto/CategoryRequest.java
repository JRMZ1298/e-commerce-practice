package com.ecommerce.catalog.dto;

import java.util.UUID;

public record CategoryRequest(
    String name,
    String slug,
    String description,
    UUID parentId,
    String imageUrl,
    Integer sortOrder
) {}
