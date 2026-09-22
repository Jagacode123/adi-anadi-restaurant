package com.restaurant.controller;

import com.restaurant.dto.request.CreateCategoryRequest;
import com.restaurant.dto.request.CreateMenuItemRequest;
import com.restaurant.dto.response.ApiResponse;
import com.restaurant.dto.response.MenuCategoryResponse;
import com.restaurant.dto.response.MenuItemResponse;
import com.restaurant.service.MenuService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/menu")
@RequiredArgsConstructor
@Tag(name = "Admin Menu", description = "Admin menu management endpoints")
public class AdminMenuController {

    private final MenuService menuService;

    @PostMapping
    @Operation(summary = "Create a new menu item")
    public ResponseEntity<ApiResponse<MenuItemResponse>> createMenuItem(@Valid @RequestBody CreateMenuItemRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Menu item created.", menuService.createMenuItem(request)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing menu item")
    public ResponseEntity<ApiResponse<MenuItemResponse>> updateMenuItem(
            @PathVariable Long id,
            @RequestBody CreateMenuItemRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Menu item updated.", menuService.updateMenuItem(id, request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deactivate a menu item")
    public ResponseEntity<ApiResponse<Void>> deactivateMenuItem(@PathVariable Long id) {
        menuService.deactivateMenuItem(id);
        return ResponseEntity.ok(ApiResponse.success("Menu item deactivated."));
    }

    @PostMapping("/categories")
    @Operation(summary = "Create a new menu category")
    public ResponseEntity<ApiResponse<MenuCategoryResponse>> createCategory(@Valid @RequestBody CreateCategoryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Category created.", menuService.createCategory(request)));
    }

    @PutMapping("/categories/{id}")
    @Operation(summary = "Update an existing menu category")
    public ResponseEntity<ApiResponse<MenuCategoryResponse>> updateCategory(
            @PathVariable Long id,
            @RequestBody CreateCategoryRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Category updated.", menuService.updateCategory(id, request)));
    }

    @DeleteMapping("/categories/{id}")
    @Operation(summary = "Deactivate a menu category")
    public ResponseEntity<ApiResponse<Void>> deactivateCategory(@PathVariable Long id) {
        menuService.deactivateCategory(id);
        return ResponseEntity.ok(ApiResponse.success("Category deactivated."));
    }
}
