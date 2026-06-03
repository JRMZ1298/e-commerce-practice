package com.ecommerce.order.dto;

import com.ecommerce.order.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record AdminOrderStatusRequest(
    @NotNull OrderStatus status,
    String notes
) {}
