package com.restaurant.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Getter @Builder
public class OrderResponse {
    private Long        id;
    private String      orderNumber;
    private UserResponse customer;
    private int         guestCount;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate   bookingDate;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime   bookingTime;

    private String      specialInstructions;
    private BigDecimal  subtotal;
    private BigDecimal  extraTotal;
    private BigDecimal  grandTotal;
    private String      status;
    private String      rejectionReason;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Kolkata")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Kolkata")
    private LocalDateTime updatedAt;

    private List<OrderItemResponse>       items;
    private List<OrderExtraItemResponse>  extraItems;
    private List<OrderStatusHistoryResponse> statusHistory;
}
