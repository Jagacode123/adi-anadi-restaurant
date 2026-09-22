package com.restaurant.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter @Builder
public class ExtraItemResponse {
    private Long       id;
    private String     name;
    private String     description;
    private BigDecimal price;
    private boolean    available;
}
