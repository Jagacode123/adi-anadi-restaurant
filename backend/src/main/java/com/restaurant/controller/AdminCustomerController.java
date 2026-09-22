package com.restaurant.controller;

import com.restaurant.dto.response.ApiResponse;
import com.restaurant.dto.response.PagedResponse;
import com.restaurant.dto.response.UserResponse;
import com.restaurant.service.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/customers")
@RequiredArgsConstructor
@Tag(name = "Admin Customers", description = "Admin customer directory endpoints")
public class AdminCustomerController {

    private final CustomerService customerService;

    @GetMapping
    @Operation(summary = "Get paginated list of customers")
    public ResponseEntity<ApiResponse<PagedResponse<UserResponse>>> getCustomers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        PagedResponse<UserResponse> response = customerService.getCustomers(page, size, search);
        return ResponseEntity.ok(ApiResponse.success("Customers fetched.", response));
    }
}
