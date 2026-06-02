package com.ecommerce.catalog.repository;

import com.ecommerce.catalog.entity.VariantOptionType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface VariantOptionTypeRepository extends JpaRepository<VariantOptionType, UUID> {
    List<VariantOptionType> findByProductIdOrderBySortOrder(UUID productId);
}
