package com.ecommerce.admin.dto;

import com.ecommerce.auth.entity.User;
import java.time.Instant;
import java.util.UUID;

public record AdminUserDto(
    UUID id,
    String email,
    String firstName,
    String lastName,
    String phone,
    User.Role role,
    User.Status status,
    boolean emailVerified,
    User.Provider provider,
    Instant createdAt,
    Instant lastLoginAt
) {
    public static AdminUserDto from(User user) {
        return new AdminUserDto(
            user.getId(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getPhone(),
            user.getRole(),
            user.getStatus(),
            user.isEmailVerified(),
            user.getProvider(),
            user.getCreatedAt(),
            user.getLastLoginAt()
        );
    }
}
