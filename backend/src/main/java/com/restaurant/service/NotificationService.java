package com.restaurant.service;

import com.restaurant.dto.response.NotificationResponse;
import com.restaurant.entity.Order;

import java.util.List;

public interface NotificationService {

    void notifyAdmin(Order order, String title, String message);

    void notifyCustomer(Order order, String title, String message);

    List<NotificationResponse> getNotificationsForUser(Long userId);

    void markAsRead(Long notificationId, Long userId);

    void markAllRead(Long userId);
}
