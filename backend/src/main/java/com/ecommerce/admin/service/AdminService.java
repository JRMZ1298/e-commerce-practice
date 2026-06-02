package com.ecommerce.admin.service;

import com.ecommerce.auth.entity.User;
import com.ecommerce.auth.repository.UserRepository;
import com.ecommerce.catalog.dto.*;
import com.ecommerce.catalog.entity.*;
import com.ecommerce.catalog.repository.*;
import com.ecommerce.catalog.service.CatalogService;
import com.ecommerce.common.exception.BusinessException;
import com.ecommerce.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final CatalogService catalogService;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final VariantOptionTypeRepository variantOptionTypeRepository;
    private final VariantOptionValueRepository variantOptionValueRepository;

    @Transactional
    public CategoryDto createCategory(CategoryRequest request) {
        return catalogService.createCategory(request);
    }

    @Transactional
    public CategoryDto updateCategory(UUID id, CategoryRequest request) {
        return catalogService.updateCategory(id, request);
    }

    @Transactional
    public void deleteCategory(UUID id) {
        catalogService.deleteCategory(id);
    }

    @Transactional
    public ProductDto createProduct(ProductRequest request, UUID userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        return catalogService.createProduct(request, user);
    }

    @Transactional
    public ProductDto updateProduct(UUID id, ProductRequest request) {
        return catalogService.updateProduct(id, request);
    }

    @Transactional
    public void deleteProduct(UUID id) {
        catalogService.deleteProduct(id);
    }

    @Transactional
    public List<VariantOptionTypeDto> updateOptionTypes(UUID productId, List<VariantOptionTypeRequest> types) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new ResourceNotFoundException("Product", productId));

        List<VariantOptionType> existing = variantOptionTypeRepository.findByProductIdOrderBySortOrder(productId);
        List<VariantOptionType> updated = new java.util.ArrayList<>();

        for (int i = 0; i < types.size(); i++) {
            VariantOptionTypeRequest req = types.get(i);
            VariantOptionType type;
            if (i < existing.size()) {
                type = existing.get(i);
                type.setName(req.name());
            } else {
                type = VariantOptionType.builder()
                    .product(product)
                    .name(req.name())
                    .sortOrder(i)
                    .build();
            }
            type = variantOptionTypeRepository.save(type);

            List<VariantOptionValue> existingValues = variantOptionValueRepository.findByTypeIdOrderBySortOrder(type.getId());
            var finalType = type;
            if (req.values() != null) {
                for (int j = 0; j < req.values().size(); j++) {
                    String val = req.values().get(j);
                    VariantOptionValue value;
                    if (j < existingValues.size()) {
                        value = existingValues.get(j);
                        value.setValue(val);
                    } else {
                        value = VariantOptionValue.builder()
                            .type(finalType)
                            .value(val)
                            .sortOrder(j)
                            .build();
                    }
                    variantOptionValueRepository.save(value);
                }
                existingValues.stream().skip(req.values().size()).forEach(v -> variantOptionValueRepository.delete(v));
            }

            updated.add(type);
        }

        existing.stream().skip(types.size()).forEach(t -> {
            variantOptionValueRepository.findByTypeIdOrderBySortOrder(t.getId())
                .forEach(v -> variantOptionValueRepository.delete(v));
            variantOptionTypeRepository.delete(t);
        });

        return updated.stream()
            .map(t -> {
                List<VariantOptionValueDto> values = variantOptionValueRepository
                    .findByTypeIdOrderBySortOrder(t.getId())
                    .stream()
                    .map(v -> new VariantOptionValueDto(v.getId(), v.getValue(), v.getSortOrder()))
                    .toList();
                return new VariantOptionTypeDto(t.getId(), t.getName(), t.getSortOrder(), values);
            })
            .toList();
    }

    @Transactional
    public VariantDto createVariant(UUID productId, VariantRequest request) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new ResourceNotFoundException("Product", productId));

        if (productVariantRepository.findBySku(request.sku()).isPresent()) {
            throw new BusinessException("Variant SKU already exists: " + request.sku());
        }

        ProductVariant variant = ProductVariant.builder()
            .product(product)
            .sku(request.sku())
            .name(request.name())
            .price(request.price() != null ? request.price() : product.getBasePrice())
            .comparePrice(request.comparePrice())
            .costPrice(request.costPrice())
            .stock(request.stock() != null ? request.stock() : 0)
            .lowStockThreshold(request.lowStockThreshold() != null ? request.lowStockThreshold() : 5)
            .weightGrams(request.weightGrams())
            .isActive(request.isActive())
            .sortOrder(request.sortOrder() != null ? request.sortOrder() : 0)
            .build();

        if (request.optionValueIds() != null) {
            request.optionValueIds().forEach(id -> {
                VariantOptionValue val = variantOptionValueRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("VariantOptionValue", id));
                variant.getOptionValues().add(val);
            });
        }

        ProductVariant saved = productVariantRepository.save(variant);
        return toVariantDto(saved);
    }

    @Transactional
    public VariantDto updateVariant(UUID variantId, VariantRequest request) {
        ProductVariant variant = productVariantRepository.findById(variantId)
            .orElseThrow(() -> new ResourceNotFoundException("Variant", variantId));

        if (request.sku() != null && !request.sku().equals(variant.getSku())) {
            if (productVariantRepository.findBySku(request.sku()).isPresent()) {
                throw new BusinessException("Variant SKU already exists: " + request.sku());
            }
            variant.setSku(request.sku());
        }
        if (request.name() != null) variant.setName(request.name());
        if (request.price() != null) variant.setPrice(request.price());
        if (request.comparePrice() != null) variant.setComparePrice(request.comparePrice());
        if (request.costPrice() != null) variant.setCostPrice(request.costPrice());
        if (request.stock() != null) variant.setStock(request.stock());
        if (request.lowStockThreshold() != null) variant.setLowStockThreshold(request.lowStockThreshold());
        if (request.weightGrams() != null) variant.setWeightGrams(request.weightGrams());
        variant.setActive(request.isActive());
        if (request.sortOrder() != null) variant.setSortOrder(request.sortOrder());

        if (request.optionValueIds() != null) {
            variant.getOptionValues().clear();
            request.optionValueIds().forEach(id -> {
                VariantOptionValue val = variantOptionValueRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("VariantOptionValue", id));
                variant.getOptionValues().add(val);
            });
        }

        ProductVariant saved = productVariantRepository.save(variant);
        return toVariantDto(saved);
    }

    @Transactional
    public void deleteVariant(UUID variantId) {
        ProductVariant variant = productVariantRepository.findById(variantId)
            .orElseThrow(() -> new ResourceNotFoundException("Variant", variantId));
        variant.setActive(false);
        productVariantRepository.save(variant);
    }

    private VariantDto toVariantDto(ProductVariant v) {
        return new VariantDto(
            v.getId(), v.getSku(), v.getName(), v.getPrice(), v.getComparePrice(),
            v.getStock(), v.getStockReserved(), v.isActive(), v.getSortOrder(),
            v.getOptionValues().stream()
                .map(ov -> new VariantOptionValueDto(ov.getId(), ov.getValue(), ov.getSortOrder()))
                .toList()
        );
    }
}
