package com.restaurant.controller;

import com.restaurant.dto.request.RestaurantConfigRequest;
import com.restaurant.dto.response.ApiResponse;
import com.restaurant.dto.response.RestaurantResponse;
import com.restaurant.entity.TimeSlotCapacity;
import com.restaurant.service.RestaurantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/restaurant")
@RequiredArgsConstructor
@Tag(name = "Admin Restaurant", description = "Admin restaurant settings and capacity endpoints")
public class AdminRestaurantController {

    private final RestaurantService restaurantService;

    @GetMapping
    @Operation(summary = "Get current restaurant configuration")
    public ResponseEntity<ApiResponse<RestaurantResponse>> getRestaurantConfig() {
        return ResponseEntity.ok(ApiResponse.success("Configuration fetched.", restaurantService.getRestaurantInfo()));
    }

    @PutMapping
    @Operation(summary = "Update restaurant configuration")
    public ResponseEntity<ApiResponse<RestaurantResponse>> updateRestaurantConfig(
            @RequestBody RestaurantConfigRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Configuration updated.", restaurantService.updateRestaurantConfig(request)));
    }

    @GetMapping("/slots")
    @Operation(summary = "Get all configured time slot capacities")
    public ResponseEntity<ApiResponse<List<TimeSlotCapacity>>> getTimeSlots() {
        return ResponseEntity.ok(ApiResponse.success("Time slots fetched.", restaurantService.getTimeSlots()));
    }

    @PostMapping("/slots")
    @Operation(summary = "Save or update a time slot capacity")
    public ResponseEntity<ApiResponse<TimeSlotCapacity>> saveTimeSlot(@RequestBody TimeSlotCapacity slot) {
        return ResponseEntity.ok(ApiResponse.success("Time slot saved.", restaurantService.saveTimeSlot(slot)));
    }
}
