package com.ecommerce.admin.dto;

import java.math.BigDecimal;

public record DashboardStatsDto(
    long totalOrders,
    long totalProducts,
    long totalUsers,
    BigDecimal totalRevenue,
    long pendingOrders,
    long lowStockProducts
) {}
