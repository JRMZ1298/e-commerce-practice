package com.ecommerce.search.dto;

import com.ecommerce.catalog.dto.ProductListDto;
import java.util.List;
import java.util.Map;

public record SearchResultDto(
    List<ProductListDto> products,
    long total,
    int page,
    int size,
    Map<String, List<FacetDto>> facets
) {}
