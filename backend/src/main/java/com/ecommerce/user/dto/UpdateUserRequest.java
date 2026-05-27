package com.ecommerce.user.dto;

public record UpdateUserRequest(
    String firstName,
    String lastName,
    String phone
) {}
