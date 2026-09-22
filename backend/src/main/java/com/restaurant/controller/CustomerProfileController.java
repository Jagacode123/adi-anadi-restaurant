package com.restaurant.controller;

import com.restaurant.dto.response.ApiResponse;
import com.restaurant.dto.response.UserResponse;
import com.restaurant.exception.ResourceNotFoundException;
import com.restaurant.repository.UserRepository;
import com.restaurant.service.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
@Tag(name = "Customer Profile", description = "Customer profile management endpoints")
public class CustomerProfileController {

    private final CustomerService customerService;
    private final UserRepository userRepository;

    private Long getUserId(Authentication auth) {
        return userRepository.findByEmail(auth.getName())
            .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + auth.getName()))
            .getId();
    }

    @GetMapping("/profile")
    @Operation(summary = "Get current customer profile")
    public ResponseEntity<ApiResponse<UserResponse>> getProfile(Authentication auth) {
        Long userId = getUserId(auth);
        return ResponseEntity.ok(ApiResponse.success("Profile fetched.", customerService.getProfile(userId)));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update current customer profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            @RequestBody Map<String, String> request,
            Authentication auth) {
        Long userId = getUserId(auth);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully.", customerService.updateProfile(userId, request)));
    }
}
