package com.restaurant.service;

import com.restaurant.dto.request.CreateOrderRequest;
import com.restaurant.dto.response.OrderResponse;

import java.util.List;

public interface OrderService {

    OrderResponse createOrder(CreateOrderRequest request, Long customerId);

    List<OrderResponse> getMyOrders(Long customerId);

    OrderResponse getOrderById(Long orderId, Long customerId);

    OrderResponse getOrderById(Long orderId);

    OrderResponse cancelOrder(Long orderId, Long customerId);
}
