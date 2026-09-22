package com.restaurant.service;

import com.restaurant.dto.request.CreateReviewRequest;
import com.restaurant.dto.response.ReviewResponse;
import com.restaurant.dto.response.ReviewSummaryResponse;

import java.util.List;

public interface ReviewService {

    ReviewResponse createReview(CreateReviewRequest request);

    List<ReviewResponse> getReviews(Integer rating, String sort);

    ReviewSummaryResponse getSummary();

    ReviewResponse likeReview(Long id);
}
