package com.restaurant.serviceimpl;

import com.restaurant.config.AppConfig;
import com.restaurant.dto.response.DashboardResponse;
import com.restaurant.enums.OrderStatus;
import com.restaurant.repository.OrderRepository;
import com.restaurant.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final OrderRepository orderRepository;
    private final Clock applicationClock;

    @Override
    @Transactional(readOnly = true)
    public DashboardResponse getDashboardStats() {
        LocalDate today = LocalDate.now(applicationClock);

        return DashboardResponse.builder()
            .totalOrders(orderRepository.count())
            .pendingOrders(orderRepository.countByStatus(OrderStatus.PENDING))
            .approvedOrders(orderRepository.countByStatus(OrderStatus.APPROVED))
            .rejectedOrders(orderRepository.countByStatus(OrderStatus.REJECTED))
            .cancelledOrders(orderRepository.countByStatus(OrderStatus.CANCELLED))
            .completedOrders(orderRepository.countByStatus(OrderStatus.COMPLETED))
            .todaysOrders(orderRepository.countByBookingDate(today))
            .upcomingBookings(orderRepository.countUpcomingBookings(today))
            .totalGuestsToday(orderRepository.sumGuestsByBookingDate(today))
            .build();
    }
}
