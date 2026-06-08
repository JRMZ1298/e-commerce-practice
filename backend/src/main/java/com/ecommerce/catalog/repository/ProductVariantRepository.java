package com.ecommerce.catalog.repository;

import com.ecommerce.catalog.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, UUID> {
    List<ProductVariant> findByProductIdOrderBySortOrder(UUID productId);
    Optional<ProductVariant> findBySku(String sku);
    List<ProductVariant> findByProductIdAndIsActiveTrue(UUID productId);
    List<ProductVariant> findByStockLessThanEqual(int threshold);
}
