package com.restaurant.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter @Builder
public class DashboardResponse {
    private long totalOrders;
    private long pendingOrders;
    private long approvedOrders;
    private long rejectedOrders;
    private long cancelledOrders;
    private long completedOrders;
    private long todaysOrders;
    private long upcomingBookings;
    private long totalGuestsToday;
}
