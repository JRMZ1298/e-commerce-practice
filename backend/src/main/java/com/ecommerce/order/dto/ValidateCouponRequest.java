package com.ecommerce.order.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record ValidateCouponRequest(
    @NotBlank String code,
    @NotNull BigDecimal subtotal
) {}
