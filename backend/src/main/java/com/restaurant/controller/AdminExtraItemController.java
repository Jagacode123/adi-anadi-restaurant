package com.restaurant.controller;

import com.restaurant.dto.request.CreateExtraItemRequest;
import com.restaurant.dto.response.ApiResponse;
import com.restaurant.dto.response.ExtraItemResponse;
import com.restaurant.service.ExtraItemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/extra-items")
@RequiredArgsConstructor
@Tag(name = "Admin Extra Items", description = "Admin extra items management endpoints")
public class AdminExtraItemController {

    private final ExtraItemService extraItemService;

    @PostMapping
    @Operation(summary = "Create a new extra item")
    public ResponseEntity<ApiResponse<ExtraItemResponse>> createExtraItem(@Valid @RequestBody CreateExtraItemRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Extra item created.", extraItemService.createExtraItem(request)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an extra item")
    public ResponseEntity<ApiResponse<ExtraItemResponse>> updateExtraItem(
            @PathVariable Long id,
            @RequestBody CreateExtraItemRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Extra item updated.", extraItemService.updateExtraItem(id, request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deactivate an extra item")
    public ResponseEntity<ApiResponse<Void>> deactivateExtraItem(@PathVariable Long id) {
        extraItemService.deactivateExtraItem(id);
        return ResponseEntity.ok(ApiResponse.success("Extra item deactivated."));
    }
}
