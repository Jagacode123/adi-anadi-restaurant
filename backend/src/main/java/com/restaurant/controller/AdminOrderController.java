package com.restaurant.controller;

import com.restaurant.dto.request.RejectOrderRequest;
import com.restaurant.dto.response.ApiResponse;
import com.restaurant.dto.response.OrderResponse;
import com.restaurant.dto.response.PagedResponse;
import com.restaurant.enums.OrderStatus;
import com.restaurant.exception.ResourceNotFoundException;
import com.restaurant.repository.UserRepository;
import com.restaurant.service.AdminOrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@Tag(name = "Admin Orders", description = "Admin order management endpoints")
public class AdminOrderController {

    private final AdminOrderService adminOrderService;
    private final UserRepository userRepository;

    private Long getAdminId(Authentication auth) {
        return userRepository.findByEmail(auth.getName())
            .orElseThrow(() -> new ResourceNotFoundException("Admin user not found: " + auth.getName()))
            .getId();
    }

    @GetMapping
    @Operation(summary = "Get paginated orders with optional filters")
    public ResponseEntity<ApiResponse<PagedResponse<OrderResponse>>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) String search) {
        PagedResponse<OrderResponse> response = adminOrderService.getAllOrders(page, size, status, date, search);
        return ResponseEntity.ok(ApiResponse.success("Orders fetched.", response));
    }

    @GetMapping("/pending")
    @Operation(summary = "Get all pending orders")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getPendingOrders() {
        return ResponseEntity.ok(ApiResponse.success("Pending orders fetched.", adminOrderService.getPendingOrders()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order details by ID for admin")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrder(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Order details fetched.", adminOrderService.getOrderById(id)));
    }

    @PutMapping("/{id}/approve")
    @Operation(summary = "Approve a pending order")
    public ResponseEntity<ApiResponse<OrderResponse>> approveOrder(@PathVariable Long id, Authentication auth) {
        Long adminId = getAdminId(auth);
        return ResponseEntity.ok(ApiResponse.success("Order approved.", adminOrderService.approveOrder(id, adminId)));
    }

    @PutMapping("/{id}/reject")
    @Operation(summary = "Reject a pending order")
    public ResponseEntity<ApiResponse<OrderResponse>> rejectOrder(
            @PathVariable Long id,
            @RequestBody(required = false) RejectOrderRequest request,
            Authentication auth) {
        Long adminId = getAdminId(auth);
        String reason = request != null ? request.getReason() : null;
        return ResponseEntity.ok(ApiResponse.success("Order rejected.", adminOrderService.rejectOrder(id, adminId, reason)));
    }

    @PutMapping("/{id}/complete")
    @Operation(summary = "Mark an approved order as completed")
    public ResponseEntity<ApiResponse<OrderResponse>> completeOrder(@PathVariable Long id, Authentication auth) {
        Long adminId = getAdminId(auth);
        return ResponseEntity.ok(ApiResponse.success("Order marked as completed.", adminOrderService.completeOrder(id, adminId)));
    }
}
