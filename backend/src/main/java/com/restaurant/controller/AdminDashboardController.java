package com.restaurant.controller;

import com.restaurant.dto.response.ApiResponse;
import com.restaurant.dto.response.DashboardResponse;
import com.restaurant.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@Tag(name = "Admin Dashboard", description = "Admin dashboard statistics endpoints")
public class AdminDashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    @Operation(summary = "Get admin dashboard statistics and KPI metrics")
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.success("Dashboard statistics fetched.", dashboardService.getDashboardStats()));
    }
}
