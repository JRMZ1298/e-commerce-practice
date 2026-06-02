package com.ecommerce.catalog.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "variant_option_types")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VariantOptionType {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private String name;

    @Column(name = "sort_order")
    @Builder.Default
    private int sortOrder = 0;
}
