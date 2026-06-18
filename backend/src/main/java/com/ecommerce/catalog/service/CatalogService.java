package com.ecommerce.catalog.service;

import com.ecommerce.auth.entity.User;
import com.ecommerce.catalog.dto.*;
import com.ecommerce.catalog.entity.*;
import com.ecommerce.catalog.repository.*;
import com.ecommerce.common.exception.BusinessException;
import com.ecommerce.common.exception.ResourceNotFoundException;
import com.ecommerce.common.util.SlugUtil;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CatalogService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final ProductVariantRepository productVariantRepository;
    private final VariantOptionTypeRepository variantOptionTypeRepository;
    private final VariantOptionValueRepository variantOptionValueRepository;

    public List<CategoryDto> getCategories() {
        List<Category> rootCategories = categoryRepository.findByParentIdIsNull();
        return rootCategories.stream()
            .map(this::buildCategoryTree)
            .toList();
    }

    private CategoryDto buildCategoryTree(Category category) {
        List<Category> children = categoryRepository.findByParentId(category.getId());
        return new CategoryDto(
            category.getId(),
            category.getName(),
            category.getSlug(),
            category.getDescription(),
            category.getImageUrl(),
            category.getParent() != null ? category.getParent().getId() : null,
            children.stream().map(this::buildCategoryTree).toList()
        );
    }

    @Transactional
    public CategoryDto createCategory(CategoryRequest request) {
        if (categoryRepository.findBySlug(request.slug()).isPresent()) {
            throw new BusinessException("Category slug already exists: " + request.slug());
        }

        Category parent = null;
        if (request.parentId() != null) {
            parent = categoryRepository.findById(request.parentId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", request.parentId()));
        }

        Category category = Category.builder()
            .parent(parent)
            .name(request.name())
            .slug(request.slug())
            .description(request.description())
            .imageUrl(request.imageUrl())
            .sortOrder(request.sortOrder() != null ? request.sortOrder() : 0)
            .build();

        category = categoryRepository.save(category);
        return toCategoryDto(category);
    }

    @Transactional
    public CategoryDto updateCategory(UUID id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Category", id));

        if (request.name() != null) category.setName(request.name());
        if (request.slug() != null && !request.slug().equals(category.getSlug())) {
            if (categoryRepository.findBySlug(request.slug()).isPresent()) {
                throw new BusinessException("Category slug already exists: " + request.slug());
            }
            category.setSlug(request.slug());
        }
        if (request.description() != null) category.setDescription(request.description());
        if (request.imageUrl() != null) category.setImageUrl(request.imageUrl());
        if (request.sortOrder() != null) category.setSortOrder(request.sortOrder());

        if (request.parentId() != null) {
            Category parent = categoryRepository.findById(request.parentId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", request.parentId()));
            if (parent.getId().equals(id)) {
                throw new BusinessException("Category cannot be its own parent");
            }
            category.setParent(parent);
        }

        category = categoryRepository.save(category);
        return toCategoryDto(category);
    }

    @Transactional
    public void deleteCategory(UUID id) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Category", id));
        category.setActive(false);
        categoryRepository.save(category);
    }

    public Page<ProductListDto> getProducts(int page, int size, String category, BigDecimal minPrice,
                                            BigDecimal maxPrice, String search, String sort,
                                            String brand, String tag, Boolean inStock, Boolean featured,
                                            String genero) {
        Pageable pageable = createPageable(page, size, sort);
        Specification<Product> spec = buildProductSpecification(category, minPrice, maxPrice, search, brand, tag, inStock, featured, genero);

        return productRepository.findAll(spec, pageable)
            .map(this::toProductListDto);
    }

    public ProductDto getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
            .orElseThrow(() -> new ResourceNotFoundException("Product", slug));

        if (product.getStatus() != Product.Status.ACTIVE) {
            throw new ResourceNotFoundException("Product", slug);
        }

        return toProductDto(product);
    }

    public Page<ProductListDto> getProductsByCategory(String slug, Pageable pageable) {
        Category category = categoryRepository.findBySlug(slug)
            .orElseThrow(() -> new ResourceNotFoundException("Category", slug));

        Specification<Product> spec = (root, query, cb) -> {
            Join<Product, Category> categoryJoin = root.join("category");
            return cb.equal(categoryJoin.get("id"), category.getId());
        };

        return productRepository.findAll(spec, pageable)
            .map(this::toProductListDto);
    }

    @Transactional
    public ProductDto createProduct(ProductRequest request, User createdBy) {
        if (productRepository.findBySlug(request.slug()).isPresent()) {
            throw new BusinessException("Product slug already exists: " + request.slug());
        }

        Category category = null;
        if (request.categoryId() != null) {
            category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", request.categoryId()));
        }

        Product product = Product.builder()
            .category(category)
            .name(request.name())
            .slug(request.slug())
            .description(request.description())
            .shortDescription(request.shortDescription())
            .sku(request.sku())
            .brand(request.brand())
            .basePrice(request.basePrice() != null ? request.basePrice() : BigDecimal.ZERO)
            .comparePrice(request.comparePrice())
            .stock(request.stock() != null ? request.stock() : 0)
            .isFeatured(request.isFeatured())
            .tags(request.tags() != null ? request.tags().toArray(String[]::new) : null)
            .genero(request.genero())
            .createdBy(createdBy)
            .build();

        product = productRepository.save(product);
        return toProductDto(product);
    }

    @Transactional
    public ProductDto updateProduct(UUID id, ProductRequest request) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product", id));

        if (request.name() != null) product.setName(request.name());
        if (request.slug() != null && !request.slug().equals(product.getSlug())) {
            if (productRepository.findBySlug(request.slug()).isPresent()) {
                throw new BusinessException("Product slug already exists: " + request.slug());
            }
            product.setSlug(request.slug());
        }
        if (request.description() != null) product.setDescription(request.description());
        if (request.shortDescription() != null) product.setShortDescription(request.shortDescription());
        if (request.sku() != null) product.setSku(request.sku());
        if (request.brand() != null) product.setBrand(request.brand());
        if (request.basePrice() != null) product.setBasePrice(request.basePrice());
        if (request.comparePrice() != null) product.setComparePrice(request.comparePrice());
        if (request.stock() != null) product.setStock(request.stock());
        if (request.tags() != null) product.setTags(request.tags().toArray(String[]::new));
        if (request.genero() != null) product.setGenero(request.genero());

        if (request.categoryId() != null) {
            Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", request.categoryId()));
            product.setCategory(category);
        }

        product = productRepository.save(product);
        return toProductDto(product);
    }

    @Transactional
    public void deleteProduct(UUID id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product", id));
        product.setStatus(Product.Status.ARCHIVED);
        productRepository.save(product);
    }

    private Specification<Product> buildProductSpecification(String category, BigDecimal minPrice,
                                                              BigDecimal maxPrice, String search,
                                                              String brand, String tag, Boolean inStock,
                                                              Boolean featured, String genero) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.equal(root.get("status"), Product.Status.ACTIVE));

            if (category != null && !category.isBlank()) {
                Optional<Category> catOpt = categoryRepository.findBySlug(category);
                if (catOpt.isPresent()) {
                    Set<UUID> categoryIds = new HashSet<>();
                    collectCategoryIds(catOpt.get(), categoryIds);
                    Join<Product, Category> categoryJoin = root.join("category");
                    predicates.add(categoryJoin.get("id").in(categoryIds));
                } else {
                    predicates.add(cb.equal(root.get("category"), null));
                }
            }

            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("basePrice"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("basePrice"), maxPrice));
            }

            if (search != null && !search.isBlank()) {
                String pattern = "%" + search.toLowerCase() + "%";
                predicates.add(cb.or(
                    cb.like(cb.lower(root.get("name")), pattern),
                    cb.like(cb.lower(root.get("description")), pattern),
                    cb.like(cb.lower(root.get("brand")), pattern)
                ));
            }

            if (brand != null && !brand.isBlank()) {
                predicates.add(cb.equal(root.get("brand"), brand));
            }

            if (tag != null && !tag.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("tags").as(String.class)), "%" + tag.toLowerCase() + "%"));
            }

            if (Boolean.TRUE.equals(inStock)) {
                predicates.add(cb.greaterThan(root.get("stock"), 0));
            }

            if (Boolean.TRUE.equals(featured)) {
                predicates.add(cb.isTrue(root.get("isFeatured")));
            }

            if (genero != null && !genero.isBlank()) {
                predicates.add(cb.equal(root.get("genero"), genero));
            }

            if (!query.getResultType().equals(Long.class)) {
                query.distinct(true);
            }

            return cb.and(predicates.toArray(Predicate[]::new));
        };
    }

    private Pageable createPageable(int page, int size, String sort) {
        if (sort == null || sort.isBlank()) {
            return PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        }

        return switch (sort) {
            case "price_asc" -> PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "basePrice"));
            case "price_desc" -> PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "basePrice"));
            case "name_asc" -> PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "name"));
            case "name_desc" -> PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "name"));
            case "newest" -> PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
            default -> {
                String[] parts = sort.split(",");
                String field = parts[0];
                Sort.Direction direction = parts.length > 1 && parts[1].equalsIgnoreCase("asc")
                    ? Sort.Direction.ASC : Sort.Direction.DESC;
                yield PageRequest.of(page, size, Sort.by(direction, field));
            }
        };
    }

    private void collectCategoryIds(Category category, Set<UUID> ids) {
        ids.add(category.getId());
        List<Category> children = categoryRepository.findByParentId(category.getId());
        for (Category child : children) {
            collectCategoryIds(child, ids);
        }
    }

    public ProductListDto toProductListDto(Product product) {
        String primaryImage = productImageRepository.findByProductIdOrderBySortOrder(product.getId())
            .stream()
            .filter(ProductImage::isPrimary)
            .findFirst()
            .map(ProductImage::getUrl)
            .orElse(null);

        List<ProductVariant> variants = productVariantRepository.findByProductIdAndIsActiveTrue(product.getId());
        BigDecimal effectiveBasePrice = variants.isEmpty()
            ? product.getBasePrice()
            : variants.stream().map(ProductVariant::getPrice).min(BigDecimal::compareTo).orElse(product.getBasePrice());
        int effectiveStock = variants.isEmpty()
            ? product.getStock()
            : variants.stream().mapToInt(v -> v.getStock() - v.getStockReserved()).sum();

        return new ProductListDto(
            product.getId(),
            product.getName(),
            product.getSlug(),
            product.getBrand(),
            effectiveBasePrice,
            product.getComparePrice(),
            effectiveStock,
            product.isFeatured(),
            primaryImage,
            product.getCategory() != null ? product.getCategory().getName() : null,
            product.getGenero(),
            product.getCreatedAt()
        );
    }

    public ProductDto toProductDto(Product product) {
        List<ProductDto.ProductImageDto> images = productImageRepository
            .findByProductIdOrderBySortOrder(product.getId())
            .stream()
            .map(img -> new ProductDto.ProductImageDto(
                img.getId(), img.getUrl(), img.getAltText(), img.getSortOrder(), img.isPrimary()))
            .toList();

        ProductDto.CategorySummaryDto categorySummary = product.getCategory() != null
            ? new ProductDto.CategorySummaryDto(
                product.getCategory().getId(),
                product.getCategory().getName(),
                product.getCategory().getSlug())
            : null;

        List<VariantOptionTypeDto> optionTypes = variantOptionTypeRepository
            .findByProductIdOrderBySortOrder(product.getId())
            .stream()
            .map(type -> {
                List<VariantOptionValueDto> values = variantOptionValueRepository
                    .findByTypeIdOrderBySortOrder(type.getId())
                    .stream()
                    .map(val -> new VariantOptionValueDto(val.getId(), val.getValue(), val.getSortOrder()))
                    .toList();
                return new VariantOptionTypeDto(type.getId(), type.getName(), type.getSortOrder(), values);
            })
            .toList();

        List<VariantDto> variants = productVariantRepository
            .findByProductIdOrderBySortOrder(product.getId())
            .stream()
            .map(v -> new VariantDto(
                v.getId(), v.getSku(), v.getName(), v.getPrice(), v.getComparePrice(),
                v.getStock(), v.getStockReserved(), v.isActive(), v.getSortOrder(),
                v.getOptionValues().stream()
                    .map(ov -> new VariantOptionValueDto(ov.getId(), ov.getValue(), ov.getSortOrder()))
                    .toList()
            ))
            .toList();

        return new ProductDto(
            product.getId(),
            product.getName(),
            product.getSlug(),
            product.getDescription(),
            product.getShortDescription(),
            product.getSku(),
            product.getBrand(),
            product.getBasePrice(),
            product.getComparePrice(),
            product.getStock(),
            product.getStatus(),
            product.isFeatured(),
            product.getGenero(),
            images,
            categorySummary,
            variants,
            optionTypes,
            product.getCreatedAt()
        );
    }

    private CategoryDto toCategoryDto(Category category) {
        return new CategoryDto(
            category.getId(),
            category.getName(),
            category.getSlug(),
            category.getDescription(),
            category.getImageUrl(),
            category.getParent() != null ? category.getParent().getId() : null,
            List.of()
        );
    }
}
