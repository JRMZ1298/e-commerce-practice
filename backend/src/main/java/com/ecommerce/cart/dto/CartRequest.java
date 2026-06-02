package com.ecommerce.cart.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record CartRequest(
    @NotNull UUID variantId,
    @Min(1) int quantity
) {}
