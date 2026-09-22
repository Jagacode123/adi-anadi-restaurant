package com.restaurant.controller;

import com.restaurant.dto.response.ApiResponse;
import com.restaurant.dto.response.MenuCategoryResponse;
import com.restaurant.dto.response.MenuItemResponse;
import com.restaurant.service.MenuService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
@Tag(name = "Menu", description = "Public menu endpoints")
public class MenuController {

    private final MenuService menuService;

    @GetMapping
    @Operation(summary = "Get menu grouped by active categories with available items")
    public ResponseEntity<ApiResponse<List<MenuCategoryResponse>>> getMenu() {
        return ResponseEntity.ok(ApiResponse.success("Menu fetched successfully.", menuService.getMenuGroupedByCategory()));
    }

    @GetMapping("/categories")
    @Operation(summary = "Get all categories with their items")
    public ResponseEntity<ApiResponse<List<MenuCategoryResponse>>> getCategories() {
        return ResponseEntity.ok(ApiResponse.success("Categories fetched successfully.", menuService.getAllCategoriesWithItems()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a single menu item by ID")
    public ResponseEntity<ApiResponse<MenuItemResponse>> getMenuItem(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Menu item fetched successfully.", menuService.getMenuItemById(id)));
    }
}
