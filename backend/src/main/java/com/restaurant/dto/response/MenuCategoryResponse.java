package com.restaurant.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter @Builder
public class MenuCategoryResponse {
    private Long                   categoryId;
    private String                 categoryName;
    private String                 description;
    private int                    displayOrder;
    private List<MenuItemResponse> items;
}
