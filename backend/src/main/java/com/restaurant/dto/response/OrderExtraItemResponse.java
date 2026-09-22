package com.restaurant.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter @Builder
public class OrderExtraItemResponse {
    private Long       id;
    private Long       extraItemId;
    private String     itemName;
    private int        quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;
}
