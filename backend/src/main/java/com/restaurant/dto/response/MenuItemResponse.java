package com.restaurant.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter @Builder
public class MenuItemResponse {
    private Long       id;
    private Long       categoryId;
    private String     categoryName;
    private String     name;
    private String     description;
    private BigDecimal price;
    private String     imageUrl;
    private boolean    vegetarian;
    private boolean    available;
    private int        displayOrder;
}
