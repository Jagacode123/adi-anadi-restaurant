package com.restaurant.dto.request;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter @Setter
public class CreateExtraItemRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 200)
    private String name;

    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.00", inclusive = true)
    private BigDecimal price;

    private boolean available = true;
}
