package com.restaurant.service;

import com.restaurant.dto.response.OrderResponse;
import com.restaurant.dto.response.PagedResponse;
import com.restaurant.enums.OrderStatus;

import java.time.LocalDate;
import java.util.List;

public interface AdminOrderService {

    PagedResponse<OrderResponse> getAllOrders(int page, int size, OrderStatus status, LocalDate date, String search);

    List<OrderResponse> getPendingOrders();

    OrderResponse getOrderById(Long orderId);

    OrderResponse approveOrder(Long orderId, Long adminId);

    OrderResponse rejectOrder(Long orderId, Long adminId, String reason);

    OrderResponse completeOrder(Long orderId, Long adminId);
}
