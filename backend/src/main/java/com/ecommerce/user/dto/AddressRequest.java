package com.ecommerce.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AddressRequest(
    String alias,
    @NotBlank String fullName,
    String phone,
    @NotBlank String street,
    @NotBlank String city,
    String state,
    @NotBlank String postalCode,
    @NotBlank @Size(min = 2, max = 2) String country,
    boolean isDefault
) {}
