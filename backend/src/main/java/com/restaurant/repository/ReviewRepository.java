package com.restaurant.repository;

import com.restaurant.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByApprovedTrueOrderByCreatedAtDesc();

    List<Review> findByApprovedTrueAndRatingOrderByCreatedAtDesc(int rating);

    @Query("SELECT r FROM Review r WHERE r.approved = true AND (:rating IS NULL OR r.rating = :rating) ORDER BY r.createdAt DESC")
    List<Review> findFilteredNewest(@Param("rating") Integer rating);

    @Query("SELECT r FROM Review r WHERE r.approved = true AND (:rating IS NULL OR r.rating = :rating) ORDER BY r.rating DESC, r.createdAt DESC")
    List<Review> findFilteredHighestRated(@Param("rating") Integer rating);

    @Query("SELECT r FROM Review r WHERE r.approved = true AND (:rating IS NULL OR r.rating = :rating) ORDER BY r.rating ASC, r.createdAt DESC")
    List<Review> findFilteredLowestRated(@Param("rating") Integer rating);

    @Query("SELECT r FROM Review r WHERE r.approved = true AND (:rating IS NULL OR r.rating = :rating) ORDER BY r.likes DESC, r.createdAt DESC")
    List<Review> findFilteredMostHelpful(@Param("rating") Integer rating);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.approved = true")
    Double calculateAverageRating();

    long countByApprovedTrue();

    long countByApprovedTrueAndRating(int rating);
}
