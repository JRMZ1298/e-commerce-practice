package com.ecommerce.catalog.dto;

import com.ecommerce.catalog.entity.Product;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record ProductDto(
    UUID id,
    String name,
    String slug,
    String description,
    String shortDescription,
    String sku,
    String brand,
    BigDecimal basePrice,
    BigDecimal comparePrice,
    int stock,
    Product.Status status,
    boolean isFeatured,
    List<ProductImageDto> images,
    CategorySummaryDto category,
    Instant createdAt
) {

    public record ProductImageDto(UUID id, String url, String altText, int sortOrder, boolean isPrimary) {}

    public record CategorySummaryDto(UUID id, String name, String slug) {}
}
