package com.ecommerce.catalog.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "variant_option_values")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VariantOptionValue {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "type_id", nullable = false)
    private VariantOptionType type;

    @Column(nullable = false)
    private String value;

    @Column(name = "sort_order")
    @Builder.Default
    private int sortOrder = 0;
}
