package com.ecommerce.catalog.repository;

import com.ecommerce.catalog.entity.VariantOptionValue;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface VariantOptionValueRepository extends JpaRepository<VariantOptionValue, UUID> {
    List<VariantOptionValue> findByTypeIdOrderBySortOrder(UUID typeId);
}
