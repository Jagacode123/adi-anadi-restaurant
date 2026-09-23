package com.restaurant.controller;

import com.restaurant.dto.request.CreateOrderRequest;
import com.restaurant.dto.response.ApiResponse;
import com.restaurant.dto.response.OrderResponse;
import com.restaurant.exception.ResourceNotFoundException;
import com.restaurant.repository.UserRepository;
import com.restaurant.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "Customer order booking endpoints")
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    private Long getUserId(Authentication auth) {
        return userRepository.findByEmail(auth.getName())
            .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + auth.getName()))
            .getId();
    }

    @PostMapping
    @Operation(summary = "Create a new booking and food order")
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @Valid @RequestBody CreateOrderRequest request,
            Authentication auth) {
        Long customerId = null;
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
            if (!isAdmin) {
                customerId = userRepository.findByEmail(auth.getName())
                    .map(com.restaurant.entity.User::getId)
                    .orElse(null);
            }
        }
        OrderResponse response = orderService.createOrder(request, customerId);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Order created successfully.", response));
    }

    @GetMapping("/my-orders")
    @Operation(summary = "Get all orders for the current customer")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getMyOrders(Authentication auth) {
        Long customerId = getUserId(auth);
        return ResponseEntity.ok(ApiResponse.success("Orders fetched successfully.", orderService.getMyOrders(customerId)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order details by ID")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrder(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Order details fetched.", orderService.getOrderById(id)));
    }

    @PutMapping("/{id}/cancel")
    @Operation(summary = "Cancel a pending order")
    public ResponseEntity<ApiResponse<OrderResponse>> cancelOrder(@PathVariable Long id, Authentication auth) {
        Long customerId = getUserId(auth);
        return ResponseEntity.ok(ApiResponse.success("Order cancelled successfully.", orderService.cancelOrder(id, customerId)));
    }
}
