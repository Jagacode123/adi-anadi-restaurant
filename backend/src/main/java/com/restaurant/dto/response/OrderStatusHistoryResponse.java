package com.restaurant.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter @Builder
public class OrderStatusHistoryResponse {
    private String    oldStatus;
    private String    newStatus;
    private String    changedBy;
    private String    reason;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Kolkata")
    private LocalDateTime changedAt;
}
