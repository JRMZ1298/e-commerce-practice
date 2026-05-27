package com.ecommerce.auth.dto;

import com.ecommerce.auth.entity.User;
import java.util.UUID;

public record UserDto(
    UUID id,
    String email,
    String firstName,
    String lastName,
    User.Role role,
    String avatarUrl
) {
    public static UserDto from(User user) {
        return new UserDto(
            user.getId(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getRole(),
            user.getAvatarUrl()
        );
    }
}
