package com.ecommerce.user.service;

import com.ecommerce.auth.dto.UserDto;
import com.ecommerce.auth.entity.User;
import com.ecommerce.auth.repository.UserRepository;
import com.ecommerce.common.exception.BusinessException;
import com.ecommerce.common.exception.ResourceNotFoundException;
import com.ecommerce.common.util.SlugUtil;
import com.ecommerce.user.dto.*;
import com.ecommerce.user.entity.Address;
import com.ecommerce.user.repository.AddressRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final PasswordEncoder passwordEncoder;

    public UserDto getProfile(UUID userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        return UserDto.from(user);
    }

    @Transactional
    public UserDto updateProfile(UUID userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        if (request.firstName() != null) user.setFirstName(request.firstName());
        if (request.lastName() != null) user.setLastName(request.lastName());
        if (request.phone() != null) user.setPhone(request.phone());

        user = userRepository.save(user);
        return UserDto.from(user);
    }

    @Transactional
    public void changePassword(UUID userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new BusinessException("Current password is incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
        log.info("Password changed for user: {}", userId);
    }

    public List<AddressDto> getAddresses(UUID userId) {
        return addressRepository.findByUserId(userId).stream()
            .map(this::toAddressDto)
            .toList();
    }

    @Transactional
    public AddressDto createAddress(UUID userId, AddressRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        if (request.isDefault()) {
            addressRepository.findByUserIdAndIsDefaultTrue(userId)
                .ifPresent(addr -> addr.setDefault(false));
        }

        Address address = Address.builder()
            .user(user)
            .alias(request.alias())
            .fullName(request.fullName())
            .phone(request.phone())
            .street(request.street())
            .city(request.city())
            .state(request.state())
            .postalCode(request.postalCode())
            .country(request.country().toUpperCase())
            .isDefault(request.isDefault())
            .build();

        if (addressRepository.findByUserId(userId).isEmpty()) {
            address.setDefault(true);
        }

        address = addressRepository.save(address);
        return toAddressDto(address);
    }

    @Transactional
    public AddressDto updateAddress(UUID userId, UUID addressId, AddressRequest request) {
        Address address = addressRepository.findById(addressId)
            .orElseThrow(() -> new ResourceNotFoundException("Address", addressId));

        if (!address.getUser().getId().equals(userId)) {
            throw new BusinessException("Address does not belong to this user");
        }

        if (request.isDefault() && !address.isDefault()) {
            addressRepository.findByUserIdAndIsDefaultTrue(userId)
                .ifPresent(addr -> addr.setDefault(false));
        }

        address.setAlias(request.alias());
        address.setFullName(request.fullName());
        address.setPhone(request.phone());
        address.setStreet(request.street());
        address.setCity(request.city());
        address.setState(request.state());
        address.setPostalCode(request.postalCode());
        address.setCountry(request.country().toUpperCase());
        address.setDefault(request.isDefault());

        address = addressRepository.save(address);
        return toAddressDto(address);
    }

    @Transactional
    public void deleteAddress(UUID userId, UUID addressId) {
        Address address = addressRepository.findById(addressId)
            .orElseThrow(() -> new ResourceNotFoundException("Address", addressId));

        if (!address.getUser().getId().equals(userId)) {
            throw new BusinessException("Address does not belong to this user");
        }

        addressRepository.delete(address);
    }

    private AddressDto toAddressDto(Address address) {
        return new AddressDto(
            address.getId(),
            address.getAlias(),
            address.getFullName(),
            address.getPhone(),
            address.getStreet(),
            address.getCity(),
            address.getState(),
            address.getPostalCode(),
            address.getCountry(),
            address.isDefault()
        );
    }
}
