package com.restaurant.serviceimpl;

import com.restaurant.dto.request.CreateReviewRequest;
import com.restaurant.dto.response.ReviewResponse;
import com.restaurant.dto.response.ReviewSummaryResponse;
import com.restaurant.entity.Review;
import com.restaurant.exception.ResourceNotFoundException;
import com.restaurant.repository.ReviewRepository;
import com.restaurant.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;

    @Override
    @Transactional
    public ReviewResponse createReview(CreateReviewRequest request) {
        Review review = new Review();
        review.setCustomerName(request.getCustomerName().trim());
        review.setMobile(request.getMobile() != null ? request.getMobile().trim() : null);
        review.setRating(request.getRating());
        review.setTitle(request.getTitle() != null && !request.getTitle().isBlank() ? request.getTitle().trim() : null);
        review.setComment(request.getComment().trim());
        review.setVisitType(request.getVisitType() != null && !request.getVisitType().isBlank() ? request.getVisitType().trim() : "Dine-in");
        review.setLikes(0);
        review.setApproved(true);

        Review saved = reviewRepository.save(review);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviews(Integer rating, String sort) {
        String sortOption = sort != null ? sort.toLowerCase().trim() : "newest";
        List<Review> list;
        switch (sortOption) {
            case "highest":
                list = reviewRepository.findFilteredHighestRated(rating);
                break;
            case "lowest":
                list = reviewRepository.findFilteredLowestRated(rating);
                break;
            case "helpful":
                list = reviewRepository.findFilteredMostHelpful(rating);
                break;
            case "newest":
            default:
                list = reviewRepository.findFilteredNewest(rating);
                break;
        }

        return list.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ReviewSummaryResponse getSummary() {
        Double avg = reviewRepository.calculateAverageRating();
        double roundedAvg = 0.0;
        if (avg != null) {
            roundedAvg = BigDecimal.valueOf(avg).setScale(1, RoundingMode.HALF_UP).doubleValue();
        }

        long total = reviewRepository.countByApprovedTrue();
        Map<Integer, Long> counts = new HashMap<>();
        for (int i = 1; i <= 5; i++) {
            counts.put(i, reviewRepository.countByApprovedTrueAndRating(i));
        }

        return ReviewSummaryResponse.builder()
            .averageRating(roundedAvg)
            .totalReviews(total)
            .ratingCounts(counts)
            .build();
    }

    @Override
    @Transactional
    public ReviewResponse likeReview(Long id) {
        Review review = reviewRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + id));
        review.setLikes(review.getLikes() + 1);
        Review saved = reviewRepository.save(review);
        return toResponse(saved);
    }

    private ReviewResponse toResponse(Review r) {
        return ReviewResponse.builder()
            .id(r.getId())
            .customerName(r.getCustomerName())
            .rating(r.getRating())
            .title(r.getTitle())
            .comment(r.getComment())
            .visitType(r.getVisitType())
            .likes(r.getLikes())
            .createdAt(r.getCreatedAt())
            .build();
    }
}
