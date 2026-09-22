package com.restaurant.serviceimpl;

import com.restaurant.config.AppConfig;
import com.restaurant.dto.response.OrderResponse;
import com.restaurant.dto.response.PagedResponse;
import com.restaurant.entity.Order;
import com.restaurant.entity.OrderStatusHistory;
import com.restaurant.entity.User;
import com.restaurant.enums.OrderStatus;
import com.restaurant.exception.OrderAlreadyProcessedException;
import com.restaurant.exception.ResourceNotFoundException;
import com.restaurant.repository.OrderRepository;
import com.restaurant.repository.OrderStatusHistoryRepository;
import com.restaurant.repository.UserRepository;
import com.restaurant.service.AdminOrderService;
import com.restaurant.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminOrderServiceImpl implements AdminOrderService {

    private final OrderRepository              orderRepository;
    private final OrderStatusHistoryRepository historyRepository;
    private final UserRepository               userRepository;
    private final NotificationService          notificationService;
    private final OrderServiceImpl             orderServiceImpl; // reuse toResponse mapping
    private final Clock                        applicationClock;

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<OrderResponse> getAllOrders(
            int page, int size, OrderStatus status, LocalDate date, String search) {

        PageRequest pageable = PageRequest.of(page, size,
            Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<Order> orderPage = orderRepository.searchOrders(status, date, search, pageable);

        List<OrderResponse> content = orderPage.getContent()
            .stream().map(orderServiceImpl::toResponse).collect(Collectors.toList());

        return PagedResponse.<OrderResponse>builder()
            .content(content)
            .page(page)
            .size(size)
            .totalElements(orderPage.getTotalElements())
            .totalPages(orderPage.getTotalPages())
            .last(orderPage.isLast())
            .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getPendingOrders() {
        return orderRepository.findByStatusOrderByCreatedAtAsc(OrderStatus.PENDING)
            .stream().map(orderServiceImpl::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        return orderServiceImpl.toResponse(order);
    }

    @Override
    @Transactional
    public OrderResponse approveOrder(Long orderId, Long adminId) {
        Order order = getOrderOrThrow(orderId);
        validateTransition(order, OrderStatus.PENDING, "approve");

        String oldStatus = order.getStatus().name();
        order.setStatus(OrderStatus.APPROVED);
        orderRepository.save(order);

        recordHistory(order, oldStatus, OrderStatus.APPROVED.name(), adminId, null);

        notificationService.notifyCustomer(
            order,
            "Order Confirmed! 🎉",
            String.format("Your order %s for %s at %s has been approved.",
                order.getOrderNumber(), order.getBookingDate(), order.getBookingTime())
        );

        return orderServiceImpl.toResponse(order);
    }

    @Override
    @Transactional
    public OrderResponse rejectOrder(Long orderId, Long adminId, String reason) {
        Order order = getOrderOrThrow(orderId);
        validateTransition(order, OrderStatus.PENDING, "reject");

        String oldStatus = order.getStatus().name();
        order.setStatus(OrderStatus.REJECTED);
        order.setRejectionReason(reason);
        orderRepository.save(order);

        recordHistory(order, oldStatus, OrderStatus.REJECTED.name(), adminId, reason);

        notificationService.notifyCustomer(
            order,
            "Order Request Rejected",
            String.format("Your order %s was rejected. Reason: %s",
                order.getOrderNumber(),
                reason != null && !reason.isBlank() ? reason : "No reason provided.")
        );

        return orderServiceImpl.toResponse(order);
    }

    @Override
    @Transactional
    public OrderResponse completeOrder(Long orderId, Long adminId) {
        Order order = getOrderOrThrow(orderId);
        if (order.getStatus() != OrderStatus.APPROVED) {
            throw new OrderAlreadyProcessedException(
                "Only APPROVED orders can be marked as COMPLETED. Current status: " + order.getStatus());
        }

        String oldStatus = order.getStatus().name();
        order.setStatus(OrderStatus.COMPLETED);
        orderRepository.save(order);

        recordHistory(order, oldStatus, OrderStatus.COMPLETED.name(), adminId, null);

        return orderServiceImpl.toResponse(order);
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private Order getOrderOrThrow(Long orderId) {
        return orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
    }

    private void validateTransition(Order order, OrderStatus expectedCurrent, String action) {
        if (order.getStatus() != expectedCurrent) {
            throw new OrderAlreadyProcessedException(
                String.format("Cannot %s order. Current status is %s (expected %s).",
                    action, order.getStatus(), expectedCurrent));
        }
    }

    private void recordHistory(Order order, String oldStatus, String newStatus, Long adminId, String reason) {
        User admin = userRepository.findById(adminId)
            .orElseThrow(() -> new ResourceNotFoundException("Admin user not found."));

        OrderStatusHistory history = new OrderStatusHistory();
        history.setOrder(order);
        history.setOldStatus(oldStatus);
        history.setNewStatus(newStatus);
        history.setChangedBy(admin);
        history.setReason(reason);
        history.setChangedAt(LocalDateTime.now(applicationClock));
        historyRepository.save(history);
    }
}
