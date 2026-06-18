package com.ecommerce.search.service;

import com.ecommerce.catalog.dto.ProductListDto;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.*;

@Service
@Slf4j
public class SearchService {

    @PersistenceContext
    private EntityManager entityManager;

    public Page<ProductListDto> search(String query, String category, BigDecimal minPrice,
                                        BigDecimal maxPrice, String brand, Boolean inStock,
                                        String sort, int page, int size) {
        try {
            return executeSearch(query, category, minPrice, maxPrice, brand, inStock, sort, page, size, true);
        } catch (DataAccessException e) {
            log.warn("Full-text search failed, falling back to LIKE search for query: {}", query, e);
            return executeSearch(query, category, minPrice, maxPrice, brand, inStock, sort, page, size, false);
        }
    }

    private Page<ProductListDto> executeSearch(String query, String category, BigDecimal minPrice,
                                                BigDecimal maxPrice, String brand, Boolean inStock,
                                                String sort, int page, int size, boolean useFullText) {
        List<Object> whereParams = new ArrayList<>();
        StringBuilder conditions = new StringBuilder("WHERE p.status = 'ACTIVE'");

        if (query != null && !query.isBlank()) {
            if (useFullText) {
                conditions.append(" AND search_vector @@ plainto_tsquery('spanish', ?)");
                whereParams.add(query);
            } else {
                String pattern = "%" + query.toLowerCase() + "%";
                conditions.append(" AND (LOWER(p.name) LIKE ? OR LOWER(p.description) LIKE ? OR LOWER(p.brand) LIKE ?)");
                whereParams.add(pattern);
                whereParams.add(pattern);
                whereParams.add(pattern);
            }
        }

        if (category != null && !category.isBlank()) {
            conditions.append(" AND c.slug = ?");
            whereParams.add(category);
        }

        if (minPrice != null) {
            conditions.append(" AND p.base_price >= ?");
            whereParams.add(minPrice);
        }

        if (maxPrice != null) {
            conditions.append(" AND p.base_price <= ?");
            whereParams.add(maxPrice);
        }

        if (brand != null && !brand.isBlank()) {
            conditions.append(" AND LOWER(p.brand) = LOWER(?)");
            whereParams.add(brand);
        }

        if (Boolean.TRUE.equals(inStock)) {
            conditions.append(" AND (EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = p.id AND pv.stock > 0) OR p.stock > 0)");
        }

        StringBuilder orderBy = new StringBuilder();
        List<Object> orderParams = new ArrayList<>();

        boolean sortByRelevance = useFullText && query != null && !query.isBlank()
            && (sort == null || sort.isBlank() || "relevance".equals(sort));

        if (sortByRelevance) {
            orderBy.append(" ORDER BY ts_rank(p.search_vector, plainto_tsquery('spanish', ?)) DESC");
            orderParams.add(query);
        } else if ("price_asc".equals(sort)) {
            orderBy.append(" ORDER BY p.base_price ASC NULLS LAST");
        } else if ("price_desc".equals(sort)) {
            orderBy.append(" ORDER BY p.base_price DESC NULLS LAST");
        } else if ("newest".equals(sort)) {
            orderBy.append(" ORDER BY p.created_at DESC");
        } else if ("name_asc".equals(sort)) {
            orderBy.append(" ORDER BY p.name ASC");
        } else if ("name_desc".equals(sort)) {
            orderBy.append(" ORDER BY p.name DESC");
        } else {
            orderBy.append(" ORDER BY p.created_at DESC");
        }

        String baseFrom = "FROM products p LEFT JOIN categories c ON p.category_id = c.id";

        String selectColumns = "SELECT p.id, p.name, p.slug, p.brand, p.base_price, p.compare_price, p.stock, p.is_featured, p.created_at, c.name AS category_name, (SELECT pi.url FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.is_primary DESC, pi.sort_order LIMIT 1) AS primary_image, p.genero";

        String countSql = "SELECT COUNT(*) " + baseFrom + " " + conditions;
        Query countQuery = entityManager.createNativeQuery(countSql);
        for (int i = 0; i < whereParams.size(); i++) {
            countQuery.setParameter(i + 1, whereParams.get(i));
        }
        long total = ((Number) countQuery.getSingleResult()).longValue();

        String dataSql = selectColumns + " " + baseFrom + " " + conditions + " " + orderBy + " LIMIT ? OFFSET ?";
        Query dataQuery = entityManager.createNativeQuery(dataSql);

        int paramIdx = 1;
        for (Object param : whereParams) {
            dataQuery.setParameter(paramIdx++, param);
        }
        for (Object param : orderParams) {
            dataQuery.setParameter(paramIdx++, param);
        }
        dataQuery.setParameter(paramIdx++, size);
        dataQuery.setParameter(paramIdx, (long) page * size);

        List<Object[]> rows = dataQuery.getResultList();
        List<ProductListDto> products = new ArrayList<>();

        for (Object[] row : rows) {
            UUID id = (UUID) row[0];
            String name = (String) row[1];
            String slug = (String) row[2];
            String productBrand = (String) row[3];
            BigDecimal basePrice = (BigDecimal) row[4];
            BigDecimal comparePrice = (BigDecimal) row[5];
            int stock = ((Number) row[6]).intValue();
            boolean featured = row[7] != null && (Boolean) row[7];
            Instant createdAt = row[8] != null ? ((Timestamp) row[8]).toInstant() : null;
            String categoryName = (String) row[9];
            String primaryImage = (String) row[10];
            String genero = (String) row[11];

            products.add(new ProductListDto(
                id, name, slug, productBrand, basePrice, comparePrice,
                stock, featured, primaryImage, categoryName, genero, createdAt
            ));
        }

        return new PageImpl<>(products, PageRequest.of(page, size), total);
    }
}
