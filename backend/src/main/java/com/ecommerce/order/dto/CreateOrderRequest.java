package com.ecommerce.order.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record CreateOrderRequest(
    @NotNull UUID addressId,
    String couponCode,
    String notes
) {}
