package com.restaurant.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateReviewRequest {

    @NotBlank(message = "Your name is required")
    @Size(max = 100, message = "Name must be under 100 characters")
    private String customerName;

    private String mobile;

    @Min(value = 1, message = "Rating must be at least 1 star")
    @Max(value = 5, message = "Rating cannot exceed 5 stars")
    private int rating;

    @Size(max = 200, message = "Title must be under 200 characters")
    private String title;

    @NotBlank(message = "Review comment is required")
    @Size(max = 2000, message = "Review comment must be under 2000 characters")
    private String comment;

    private String visitType;
}
