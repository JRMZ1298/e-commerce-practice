package com.ecommerce.order.dto;

import java.math.BigDecimal;

public record ValidateCouponResponse(
    boolean valid,
    String message,
    BigDecimal discount
) {}
