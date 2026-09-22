package com.restaurant.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Getter @Setter
public class CreateOrderRequest {

    @Min(value = 1, message = "At least 1 guest is required")
    private int guestCount;

    @NotNull(message = "Booking date is required")
    @FutureOrPresent(message = "Booking date cannot be in the past")
    private LocalDate bookingDate;

    @NotNull(message = "Booking time is required")
    private LocalTime bookingTime;

    @NotBlank(message = "Mobile number is mandatory")
    @Pattern(regexp = "^[0-9]{10}$", message = "Mobile number must be a valid 10-digit number")
    private String mobile;

    private String customerName;

    private String email;

    private String specialInstructions;

    @NotEmpty(message = "Please select at least one food item")
    @Valid
    private List<OrderItemRequest> items = new ArrayList<>();

    @Valid
    private List<OrderExtraItemRequest> extraItems = new ArrayList<>();
}
