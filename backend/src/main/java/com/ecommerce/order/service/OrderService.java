package com.ecommerce.order.service;

import com.ecommerce.auth.entity.User;
import com.ecommerce.auth.repository.UserRepository;
import com.ecommerce.cart.dto.CartDto;
import com.ecommerce.cart.dto.CartItemDto;
import com.ecommerce.cart.service.CartService;
import com.ecommerce.catalog.entity.ProductVariant;
import com.ecommerce.catalog.repository.ProductVariantRepository;
import com.ecommerce.common.exception.BusinessException;
import com.ecommerce.common.exception.ResourceNotFoundException;
import com.ecommerce.notification.service.EmailService;
import com.ecommerce.order.dto.*;
import com.ecommerce.order.entity.*;
import com.ecommerce.order.repository.*;
import com.ecommerce.user.entity.Address;
import com.ecommerce.user.repository.AddressRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderStatusHistoryRepository statusHistoryRepository;
    private final CouponRepository couponRepository;
    private final ProductVariantRepository variantRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final CartService cartService;
    private final OrderNumberService orderNumberService;
    private final EmailService emailService;
    private final ObjectMapper objectMapper;

    @Transactional
    public OrderDto createOrder(UUID userId, CreateOrderRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        CartDto cart = cartService.getCart(null, userId);
        if (cart.items() == null || cart.items().isEmpty()) {
            throw new BusinessException("Cart is empty");
        }

        Address address = addressRepository.findById(request.addressId())
            .orElseThrow(() -> new ResourceNotFoundException("Address", request.addressId()));

        if (!address.getUser().getId().equals(userId)) {
            throw new BusinessException("Address does not belong to this user");
        }

        String shippingAddressJson;
        try {
            shippingAddressJson = objectMapper.writeValueAsString(new java.util.HashMap<>(java.util.Map.of(
                "fullName", address.getFullName(),
                "phone", address.getPhone(),
                "street", address.getStreet(),
                "city", address.getCity(),
                "state", address.getState(),
                "postalCode", address.getPostalCode(),
                "country", address.getCountry()
            )));
        } catch (JsonProcessingException e) {
            throw new BusinessException("Failed to serialize shipping address");
        }

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;

        for (CartItemDto item : cart.items()) {
            ProductVariant variant = variantRepository.findById(item.variantId())
                .orElseThrow(() -> new ResourceNotFoundException("ProductVariant", item.variantId()));

            int availableStock = variant.getStock() - variant.getStockReserved();
            if (availableStock < item.quantity()) {
                throw new BusinessException("Insufficient stock for " + item.productName()
                    + ". Available: " + availableStock + ", requested: " + item.quantity());
            }

            variant.setStockReserved(variant.getStockReserved() + item.quantity());
            variantRepository.save(variant);

            OrderItem orderItem = OrderItem.builder()
                .variantId(variant.getId())
                .productName(item.productName())
                .variantName(item.variantName())
                .productSlug(item.productSlug())
                .imageUrl(item.imageUrl())
                .quantity(item.quantity())
                .unitPrice(item.unitPrice())
                .totalPrice(item.totalPrice())
                .build();
            orderItems.add(orderItem);
            subtotal = subtotal.add(item.totalPrice());
        }

        BigDecimal discount = BigDecimal.ZERO;
        String couponCode = null;

        if (request.couponCode() != null && !request.couponCode().isBlank()) {
            Coupon coupon = couponRepository.findByCodeAndIsActiveTrue(request.couponCode().trim().toUpperCase())
                .orElseThrow(() -> new BusinessException("Invalid or expired coupon code"));

            discount = calculateDiscount(coupon, subtotal);
            if (discount.compareTo(BigDecimal.ZERO) > 0) {
                coupon.setUsedCount(coupon.getUsedCount() + 1);
                couponRepository.save(coupon);
                couponCode = coupon.getCode();
            }
        }

        BigDecimal total = subtotal.subtract(discount);
        if (total.compareTo(BigDecimal.ZERO) < 0) {
            total = BigDecimal.ZERO;
        }

        String orderNumber = orderNumberService.generateOrderNumber();

        Order order = Order.builder()
            .user(user)
            .orderNumber(orderNumber)
            .status(OrderStatus.AWAITING_PAYMENT)
            .subtotal(subtotal)
            .discount(discount)
            .total(total)
            .couponCode(couponCode)
            .shippingAddress(shippingAddressJson)
            .notes(request.notes())
            .build();

        Order finalOrder = order;
        orderItems.forEach(item -> item.setOrder(finalOrder));
        order.setItems(orderItems);

        OrderStatusHistory history = OrderStatusHistory.builder()
            .order(order)
            .toStatus(OrderStatus.AWAITING_PAYMENT)
            .notes("Order created")
            .build();
        order.setStatusHistory(List.of(history));

        order = orderRepository.save(order);

        cartService.clearCart(null, userId);

        try {
            emailService.sendOrderConfirmation(
                user.getEmail(), orderNumber, user.getFirstName() + " " + user.getLastName());
        } catch (Exception e) {
            log.warn("Failed to send order confirmation email: {}", e.getMessage());
        }

        log.info("Order created: {} for user: {}", orderNumber, userId);
        return toDto(order);
    }

    public List<OrderDto> getUserOrders(UUID userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
            .map(this::toDto)
            .toList();
    }

    public OrderDto getOrderByNumber(UUID userId, String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
            .orElseThrow(() -> new ResourceNotFoundException("Order", orderNumber));

        if (!order.getUser().getId().equals(userId)) {
            throw new BusinessException("Order does not belong to this user");
        }

        return toDto(order);
    }

    @Transactional
    public void cancelOrder(UUID userId, String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
            .orElseThrow(() -> new ResourceNotFoundException("Order", orderNumber));

        if (!order.getUser().getId().equals(userId)) {
            throw new BusinessException("Order does not belong to this user");
        }

        if (order.getStatus() != OrderStatus.AWAITING_PAYMENT) {
            throw new BusinessException("Only orders in AWAITING_PAYMENT status can be cancelled");
        }

        releaseStock(order);
        order.setStatus(OrderStatus.CANCELLED);

        OrderStatusHistory history = OrderStatusHistory.builder()
            .order(order)
            .fromStatus(OrderStatus.AWAITING_PAYMENT)
            .toStatus(OrderStatus.CANCELLED)
            .notes("Cancelled by user")
            .build();
        order.getStatusHistory().add(history);

        orderRepository.save(order);
        log.info("Order cancelled: {} by user: {}", orderNumber, userId);
    }

    @Transactional
    public List<OrderDto> getAllOrders(OrderStatus status) {
        if (status != null) {
            return orderRepository.findByStatusOrderByCreatedAtDesc(status).stream()
                .map(this::toDto)
                .toList();
        }
        return orderRepository.findAll().stream()
            .map(this::toDto)
            .toList();
    }

    @Transactional
    public OrderDto updateOrderStatus(UUID adminId, String orderNumber, OrderStatus newStatus, String notes) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
            .orElseThrow(() -> new ResourceNotFoundException("Order", orderNumber));

        OrderStatus oldStatus = order.getStatus();
        validateStatusTransition(oldStatus, newStatus);

        if (newStatus == OrderStatus.CONFIRMED && oldStatus == OrderStatus.AWAITING_PAYMENT) {
            commitStock(order);
        }

        if (newStatus == OrderStatus.CANCELLED) {
            releaseStock(order);
        }

        order.setStatus(newStatus);

        User admin = userRepository.findById(adminId)
            .orElseThrow(() -> new ResourceNotFoundException("User", adminId));

        OrderStatusHistory history = OrderStatusHistory.builder()
            .order(order)
            .fromStatus(oldStatus)
            .toStatus(newStatus)
            .changedBy(admin)
            .notes(notes)
            .build();
        order.getStatusHistory().add(history);

        order = orderRepository.save(order);

        try {
            emailService.sendOrderStatusUpdate(
                order.getUser().getEmail(), orderNumber,
                order.getUser().getFirstName() + " " + order.getUser().getLastName(),
                newStatus.name());
        } catch (Exception e) {
            log.warn("Failed to send order status email: {}", e.getMessage());
        }

        return toDto(order);
    }

    public List<OrderDto> getAllOrders() {
        return getAllOrders(null);
    }

    public OrderDto getOrderByNumberAdmin(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
            .orElseThrow(() -> new ResourceNotFoundException("Order", orderNumber));
        return toDto(order);
    }

    private void commitStock(Order order) {
        for (OrderItem item : order.getItems()) {
            if (item.getVariantId() != null) {
                variantRepository.findById(item.getVariantId()).ifPresent(variant -> {
                    variant.setStock(variant.getStock() - item.getQuantity());
                    variant.setStockReserved(variant.getStockReserved() - item.getQuantity());
                    variantRepository.save(variant);
                });
            }
        }
    }

    private void releaseStock(Order order) {
        for (OrderItem item : order.getItems()) {
            if (item.getVariantId() != null) {
                variantRepository.findById(item.getVariantId()).ifPresent(variant -> {
                    variant.setStockReserved(Math.max(0, variant.getStockReserved() - item.getQuantity()));
                    variantRepository.save(variant);
                });
            }
        }
    }

    private BigDecimal calculateDiscount(Coupon coupon, BigDecimal subtotal) {
        if (coupon.getExpiresAt() != null && java.time.Instant.now().isAfter(coupon.getExpiresAt())) {
            return BigDecimal.ZERO;
        }
        if (coupon.getMaxUses() > 0 && coupon.getUsedCount() >= coupon.getMaxUses()) {
            return BigDecimal.ZERO;
        }
        if (subtotal.compareTo(coupon.getMinPurchase()) < 0) {
            return BigDecimal.ZERO;
        }

        if (coupon.getType() == Coupon.Type.FIXED) {
            return coupon.getValue().min(subtotal);
        } else {
            BigDecimal discount = subtotal.multiply(coupon.getValue())
                .divide(BigDecimal.valueOf(100));
            return discount.min(subtotal);
        }
    }

    private void validateStatusTransition(OrderStatus from, OrderStatus to) {
        boolean valid = switch (from) {
            case AWAITING_PAYMENT -> to == OrderStatus.CONFIRMED || to == OrderStatus.CANCELLED;
            case CONFIRMED -> to == OrderStatus.SHIPPED || to == OrderStatus.CANCELLED;
            case SHIPPED -> to == OrderStatus.DELIVERED;
            case DELIVERED, CANCELLED -> false;
        };

        if (!valid) {
            throw new BusinessException("Invalid status transition from " + from + " to " + to);
        }
    }

    private OrderDto toDto(Order order) {
        List<OrderItemDto> itemDtos = order.getItems().stream()
            .map(this::toItemDto)
            .toList();

        List<OrderStatusDto> historyDtos = order.getStatusHistory().stream()
            .map(this::toStatusDto)
            .toList();

        return new OrderDto(
            order.getId(),
            order.getOrderNumber(),
            order.getStatus(),
            order.getSubtotal(),
            order.getDiscount(),
            order.getTotal(),
            order.getCouponCode(),
            order.getShippingAddress(),
            order.getNotes(),
            itemDtos,
            historyDtos,
            order.getCreatedAt(),
            order.getUpdatedAt()
        );
    }

    private OrderItemDto toItemDto(OrderItem item) {
        return new OrderItemDto(
            item.getId(),
            item.getVariantId(),
            item.getProductName(),
            item.getVariantName(),
            item.getProductSlug(),
            item.getImageUrl(),
            item.getQuantity(),
            item.getUnitPrice(),
            item.getTotalPrice()
        );
    }

    private OrderStatusDto toStatusDto(OrderStatusHistory history) {
        return new OrderStatusDto(
            history.getId(),
            history.getFromStatus(),
            history.getToStatus(),
            history.getChangedBy() != null
                ? history.getChangedBy().getFirstName() + " " + history.getChangedBy().getLastName()
                : null,
            history.getNotes(),
            history.getCreatedAt()
        );
    }

    public OrderDto getOrderByNumberForAdmin(String orderNumber) {
        return getOrderByNumberAdmin(orderNumber);
    }

    public ValidateCouponResponse validateCoupon(ValidateCouponRequest request) {
        Coupon coupon = couponRepository.findByCodeAndIsActiveTrue(request.code().trim().toUpperCase())
            .orElse(null);

        if (coupon == null) {
            return new ValidateCouponResponse(false, "Invalid or expired coupon code", BigDecimal.ZERO);
        }

        if (coupon.getExpiresAt() != null && java.time.Instant.now().isAfter(coupon.getExpiresAt())) {
            return new ValidateCouponResponse(false, "Coupon has expired", BigDecimal.ZERO);
        }

        if (coupon.getMaxUses() > 0 && coupon.getUsedCount() >= coupon.getMaxUses()) {
            return new ValidateCouponResponse(false, "Coupon usage limit reached", BigDecimal.ZERO);
        }

        if (request.subtotal().compareTo(coupon.getMinPurchase()) < 0) {
            return new ValidateCouponResponse(false,
                "Minimum purchase of " + coupon.getMinPurchase() + " required", BigDecimal.ZERO);
        }

        BigDecimal discount = calculateDiscount(coupon, request.subtotal());

        String typeLabel = coupon.getType() == Coupon.Type.PERCENTAGE
            ? coupon.getValue() + "% off"
            : "$" + coupon.getValue() + " off";

        return new ValidateCouponResponse(true, typeLabel + " applied", discount);
    }
}
