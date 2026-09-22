package com.restaurant.controller;

import com.restaurant.dto.request.CreateReviewRequest;
import com.restaurant.dto.response.ApiResponse;
import com.restaurant.dto.response.ReviewResponse;
import com.restaurant.dto.response.ReviewSummaryResponse;
import com.restaurant.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@Tag(name = "Reviews", description = "Customer reviews and feedback endpoints")
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping
    @Operation(summary = "Get list of customer reviews with optional rating filter and sorting")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getReviews(
            @RequestParam(required = false) Integer rating,
            @RequestParam(required = false, defaultValue = "newest") String sort) {
        List<ReviewResponse> list = reviewService.getReviews(rating, sort);
        return ResponseEntity.ok(ApiResponse.success("Reviews fetched successfully.", list));
    }

    @GetMapping("/summary")
    @Operation(summary = "Get overall review summary, average rating, and counts")
    public ResponseEntity<ApiResponse<ReviewSummaryResponse>> getSummary() {
        ReviewSummaryResponse summary = reviewService.getSummary();
        return ResponseEntity.ok(ApiResponse.success("Review summary fetched successfully.", summary));
    }

    @PostMapping
    @Operation(summary = "Submit a new customer review")
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(@Valid @RequestBody CreateReviewRequest request) {
        ReviewResponse created = reviewService.createReview(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Thank you! Your review has been submitted successfully.", created));
    }

    @PostMapping("/{id}/like")
    @Operation(summary = "Like / mark a review as helpful")
    public ResponseEntity<ApiResponse<ReviewResponse>> likeReview(@PathVariable Long id) {
        ReviewResponse updated = reviewService.likeReview(id);
        return ResponseEntity.ok(ApiResponse.success("Thank you for your feedback!", updated));
    }
}
