package com.restaurant.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter @Builder
public class OrderItemResponse {
    private Long       id;
    private Long       menuItemId;
    private String     itemName;
    private int        quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;
}
