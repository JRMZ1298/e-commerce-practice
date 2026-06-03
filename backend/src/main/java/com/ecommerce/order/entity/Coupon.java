package com.ecommerce.order.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "coupons")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Coupon {

    public enum Type {
        PERCENTAGE, FIXED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Type type = Type.PERCENTAGE;

    @Column(nullable = false)
    private BigDecimal value;

    @Column(name = "min_purchase")
    @Builder.Default
    private BigDecimal minPurchase = BigDecimal.ZERO;

    @Column(name = "max_uses")
    @Builder.Default
    private int maxUses = 0;

    @Column(name = "used_count")
    @Builder.Default
    private int usedCount = 0;

    @Column(name = "expires_at")
    private Instant expiresAt;

    @Column(name = "is_active")
    @Builder.Default
    private boolean isActive = true;

    @CreatedDate
    @Column(name = "created_at", updatable = false, nullable = false)
    private Instant createdAt;
}
