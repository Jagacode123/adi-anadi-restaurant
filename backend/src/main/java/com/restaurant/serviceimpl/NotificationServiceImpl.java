package com.restaurant.serviceimpl;

import com.restaurant.dto.response.NotificationResponse;
import com.restaurant.entity.Notification;
import com.restaurant.entity.Order;
import com.restaurant.entity.User;
import com.restaurant.exception.ResourceNotFoundException;
import com.restaurant.exception.UnauthorizedException;
import com.restaurant.repository.NotificationRepository;
import com.restaurant.repository.UserRepository;
import com.restaurant.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository         userRepository;

    @Override
    @Transactional
    public void notifyAdmin(Order order, String title, String message) {
        // Find all admin users and notify each
        userRepository.findAll().stream()
            .filter(u -> u.getRoles().stream().anyMatch(r -> r.getName().equals("ADMIN")))
            .forEach(admin -> createNotification(admin, order, title, message));
    }

    @Override
    @Transactional
    public void notifyCustomer(Order order, String title, String message) {
        createNotification(order.getCustomer(), order, title, message);
    }

    private void createNotification(User user, Order order, String title, String message) {
        Notification n = new Notification();
        n.setUser(user);
        n.setOrder(order);
        n.setTitle(title);
        n.setMessage(message);
        n.setRead(false);
        notificationRepository.save(n);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotificationsForUser(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        Notification n = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new ResourceNotFoundException("Notification not found."));
        if (!n.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Access denied.");
        }
        n.setRead(true);
        notificationRepository.save(n);
    }

    @Override
    @Transactional
    public void markAllRead(Long userId) {
        notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId)
            .forEach(n -> {
                n.setRead(true);
                notificationRepository.save(n);
            });
    }

    private NotificationResponse toResponse(Notification n) {
        return NotificationResponse.builder()
            .id(n.getId())
            .orderId(n.getOrder() != null ? n.getOrder().getId() : null)
            .title(n.getTitle())
            .message(n.getMessage())
            .isRead(n.isRead())
            .createdAt(n.getCreatedAt())
            .build();
    }
}
