package com.ecommerce.catalog.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record VariantOptionTypeRequest(
    @NotBlank String name,
    List<String> values
) {}
