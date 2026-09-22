package com.restaurant.controller;

import com.restaurant.dto.response.ApiResponse;
import com.restaurant.dto.response.ExtraItemResponse;
import com.restaurant.service.ExtraItemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/extra-items")
@RequiredArgsConstructor
@Tag(name = "Extra Items", description = "Public extra items endpoints")
public class ExtraItemController {

    private final ExtraItemService extraItemService;

    @GetMapping
    @Operation(summary = "Get all available extra items")
    public ResponseEntity<ApiResponse<List<ExtraItemResponse>>> getAvailableExtraItems() {
        return ResponseEntity.ok(ApiResponse.success("Extra items fetched successfully.", extraItemService.getAvailableExtraItems()));
    }
}
