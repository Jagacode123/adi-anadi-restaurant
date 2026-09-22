package com.restaurant.service;

import com.restaurant.dto.request.CreateCategoryRequest;
import com.restaurant.dto.request.CreateMenuItemRequest;
import com.restaurant.dto.response.MenuCategoryResponse;
import com.restaurant.dto.response.MenuItemResponse;

import java.util.List;

public interface MenuService {

    List<MenuCategoryResponse> getMenuGroupedByCategory();

    List<MenuCategoryResponse> getAllCategoriesWithItems();

    MenuItemResponse getMenuItemById(Long id);

    // Admin
    MenuItemResponse createMenuItem(CreateMenuItemRequest request);
    MenuItemResponse updateMenuItem(Long id, CreateMenuItemRequest request);
    void             deactivateMenuItem(Long id);

    MenuCategoryResponse createCategory(CreateCategoryRequest request);
    MenuCategoryResponse updateCategory(Long id, CreateCategoryRequest request);
    void                 deactivateCategory(Long id);
}
