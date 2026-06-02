package com.ecommerce.catalog.dto;

import java.time.Instant;
import java.util.UUID;

public record WishlistDto(
    UUID id,
    UUID productId,
    String productName,
    String productSlug,
    String productImage,
    Instant addedAt
) {}
