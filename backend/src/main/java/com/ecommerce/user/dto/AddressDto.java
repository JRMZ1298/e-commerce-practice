package com.ecommerce.user.dto;

import java.util.UUID;

public record AddressDto(
    UUID id,
    String alias,
    String fullName,
    String phone,
    String street,
    String city,
    String state,
    String postalCode,
    String country,
    boolean isDefault
) {}
