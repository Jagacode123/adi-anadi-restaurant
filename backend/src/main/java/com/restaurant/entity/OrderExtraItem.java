package com.restaurant.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "order_extra_items")
@Getter @Setter @NoArgsConstructor
public class OrderExtraItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "extra_item_id", nullable = false)
    private ExtraItem extraItem;

    /** Snapshot of extra item name at order time */
    @Column(name = "item_name", nullable = false, length = 200)
    private String itemName;

    @Column(name = "quantity", nullable = false)
    private int quantity;

    /** Snapshot of unit price at order time */
    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "total_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;
}
