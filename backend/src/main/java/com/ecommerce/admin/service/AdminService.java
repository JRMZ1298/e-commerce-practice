package com.ecommerce.admin.service;

import com.ecommerce.admin.dto.AdminUserDto;
import com.ecommerce.admin.dto.DashboardStatsDto;
import com.ecommerce.auth.entity.User;
import com.ecommerce.auth.repository.UserRepository;
import com.ecommerce.catalog.dto.*;
import com.ecommerce.catalog.entity.*;
import com.ecommerce.catalog.repository.*;
import com.ecommerce.catalog.service.CatalogService;
import com.ecommerce.common.exception.BusinessException;
import com.ecommerce.common.exception.ResourceNotFoundException;
import com.ecommerce.order.dto.*;
import com.ecommerce.order.entity.*;
import com.ecommerce.order.repository.*;
import com.ecommerce.order.service.OrderService;
import java.math.BigDecimal;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
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
    private final ProductImageRepository productImageRepository;
    private final ProductVariantRepository productVariantRepository;
    private final VariantOptionTypeRepository variantOptionTypeRepository;
    private final VariantOptionValueRepository variantOptionValueRepository;
    private final OrderService orderService;
    private final OrderRepository orderRepository;
    private final CouponRepository couponRepository;

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

    public List<OrderDto> getAllOrders(OrderStatus status) {
        return orderService.getAllOrders(status);
    }

    public OrderDto getOrderByNumber(String orderNumber) {
        return orderService.getOrderByNumberForAdmin(orderNumber);
    }

    @Transactional
    public OrderDto updateOrderStatus(UUID adminId, String orderNumber, OrderStatus newStatus, String notes) {
        return orderService.updateOrderStatus(adminId, orderNumber, newStatus, notes);
    }

    public List<CouponDto> getAllCoupons() {
        return couponRepository.findAll().stream()
            .map(this::toCouponDto)
            .toList();
    }

    @Transactional
    public CouponDto createCoupon(CouponRequest request) {
        if (couponRepository.findByCode(request.code().trim().toUpperCase()).isPresent()) {
            throw new BusinessException("Coupon code already exists: " + request.code());
        }

        Coupon coupon = Coupon.builder()
            .code(request.code().trim().toUpperCase())
            .type(request.type())
            .value(request.value())
            .minPurchase(request.minPurchase() != null ? request.minPurchase() : BigDecimal.ZERO)
            .maxUses(request.maxUses())
            .expiresAt(request.expiresAt())
            .isActive(request.isActive())
            .build();

        coupon = couponRepository.save(coupon);
        return toCouponDto(coupon);
    }

    @Transactional
    public CouponDto updateCoupon(UUID id, CouponRequest request) {
        Coupon coupon = couponRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Coupon", id));

        couponRepository.findByCode(request.code().trim().toUpperCase())
            .ifPresent(existing -> {
                if (!existing.getId().equals(id)) {
                    throw new BusinessException("Coupon code already exists: " + request.code());
                }
            });

        coupon.setCode(request.code().trim().toUpperCase());
        coupon.setType(request.type());
        coupon.setValue(request.value());
        if (request.minPurchase() != null) coupon.setMinPurchase(request.minPurchase());
        coupon.setMaxUses(request.maxUses());
        coupon.setExpiresAt(request.expiresAt());
        coupon.setActive(request.isActive());

        coupon = couponRepository.save(coupon);
        return toCouponDto(coupon);
    }

    @Transactional
    public void deleteCoupon(UUID id) {
        Coupon coupon = couponRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Coupon", id));
        couponRepository.delete(coupon);
    }

    private CouponDto toCouponDto(Coupon c) {
        return new CouponDto(
            c.getId(), c.getCode(), c.getType(), c.getValue(),
            c.getMinPurchase(), c.getMaxUses(), c.getUsedCount(),
            c.getExpiresAt(), c.isActive(), c.getCreatedAt()
        );
    }

    // ── Dashboard ──────────────────────────────────────────────

    public DashboardStatsDto getDashboardStats() {
        long totalOrders = orderRepository.count();
        long totalProducts = productRepository.count();
        long totalUsers = userRepository.count();

        BigDecimal totalRevenue = orderRepository.findAll().stream()
            .filter(o -> o.getStatus() == OrderStatus.DELIVERED)
            .map(Order::getTotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        long pendingOrders = orderRepository.findByStatusOrderByCreatedAtDesc(OrderStatus.AWAITING_PAYMENT).size();
        long lowStockProducts = productVariantRepository.findByStockLessThanEqual(5).size();

        return new DashboardStatsDto(totalOrders, totalProducts, totalUsers, totalRevenue, pendingOrders, lowStockProducts);
    }

    // ── Users ──────────────────────────────────────────────────

    public List<AdminUserDto> getAllUsers() {
        return userRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
            .stream()
            .map(AdminUserDto::from)
            .toList();
    }

    public AdminUserDto getUserById(UUID id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User", id));
        return AdminUserDto.from(user);
    }

    @Transactional
    public AdminUserDto updateUserStatus(UUID id, String status) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User", id));
        user.setStatus(User.Status.valueOf(status));
        user = userRepository.save(user);
        return AdminUserDto.from(user);
    }

    // ── Product Images ───────────────────────────────────────────

    @Transactional
    public ProductDto addProductImage(UUID productId, String url, String altText, Boolean primary) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new ResourceNotFoundException("Product", productId));

        List<ProductImage> existing = productImageRepository.findByProductIdOrderBySortOrder(productId);
        int nextSortOrder = existing.stream().mapToInt(ProductImage::getSortOrder).max().orElse(-1) + 1;

        boolean isPrimary = Boolean.TRUE.equals(primary) || existing.isEmpty();

        if (isPrimary) {
            existing.forEach(img -> img.setPrimary(false));
            productImageRepository.saveAll(existing);
        }

        ProductImage image = ProductImage.builder()
            .product(product)
            .url(url)
            .altText(altText)
            .sortOrder(nextSortOrder)
            .isPrimary(isPrimary)
            .build();

        productImageRepository.save(image);
        return catalogService.toProductDto(product);
    }

    @Transactional
    public ProductDto deleteProductImage(UUID productId, UUID imageId) {
        ProductImage image = productImageRepository.findById(imageId)
            .orElseThrow(() -> new ResourceNotFoundException("ProductImage", imageId));

        if (!image.getProduct().getId().equals(productId)) {
            throw new BusinessException("Image does not belong to this product");
        }

        boolean wasPrimary = image.isPrimary();
        productImageRepository.delete(image);

        if (wasPrimary) {
            List<ProductImage> remaining = productImageRepository.findByProductIdOrderBySortOrder(productId);
            if (!remaining.isEmpty()) {
                ProductImage newPrimary = remaining.getFirst();
                newPrimary.setPrimary(true);
                productImageRepository.save(newPrimary);
            }
        }

        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new ResourceNotFoundException("Product", productId));
        return catalogService.toProductDto(product);
    }

    @Transactional
    public ProductDto setPrimaryImage(UUID productId, UUID imageId) {
        ProductImage image = productImageRepository.findById(imageId)
            .orElseThrow(() -> new ResourceNotFoundException("ProductImage", imageId));

        if (!image.getProduct().getId().equals(productId)) {
            throw new BusinessException("Image does not belong to this product");
        }

        List<ProductImage> all = productImageRepository.findByProductIdOrderBySortOrder(productId);
        all.forEach(img -> img.setPrimary(img.getId().equals(imageId)));
        productImageRepository.saveAll(all);

        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new ResourceNotFoundException("Product", productId));
        return catalogService.toProductDto(product);
    }

    // ── Products (admin) ────────────────────────────────────────

    public Page<ProductListDto> getAllProducts(int page, int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return productRepository.findAll(pageable)
            .map(catalogService::toProductListDto);
    }

    public ProductDto getProductById(UUID id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product", id));
        return catalogService.toProductDto(product);
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
