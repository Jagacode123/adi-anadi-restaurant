package com.restaurant.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_name", nullable = false, length = 100)
    private String customerName;

    @Column(name = "mobile", length = 15)
    private String mobile;

    @Column(name = "rating", nullable = false)
    private int rating;

    @Column(name = "title", length = 200)
    private String title;

    @Column(name = "comment", nullable = false, columnDefinition = "TEXT")
    private String comment;

    @Column(name = "visit_type", length = 50)
    private String visitType;

    @Column(name = "likes", nullable = false)
    private int likes = 0;

    @Column(name = "is_approved", nullable = false)
    private boolean approved = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Review(String customerName, String mobile, int rating, String title, String comment, String visitType, int likes) {
        this.customerName = customerName;
        this.mobile = mobile;
        this.rating = rating;
        this.title = title;
        this.comment = comment;
        this.visitType = visitType;
        this.likes = likes;
        this.approved = true;
    }
}
