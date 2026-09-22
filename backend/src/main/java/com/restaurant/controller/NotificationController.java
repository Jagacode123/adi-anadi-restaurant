package com.restaurant.controller;

import com.restaurant.dto.response.ApiResponse;
import com.restaurant.dto.response.NotificationResponse;
import com.restaurant.exception.ResourceNotFoundException;
import com.restaurant.repository.UserRepository;
import com.restaurant.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications", description = "User notification endpoints")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    private Long getUserId(Authentication auth) {
        return userRepository.findByEmail(auth.getName())
            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + auth.getName()))
            .getId();
    }

    @GetMapping
    @Operation(summary = "Get all notifications for the current user")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getNotifications(Authentication auth) {
        Long userId = getUserId(auth);
        return ResponseEntity.ok(ApiResponse.success("Notifications fetched.", notificationService.getNotificationsForUser(userId)));
    }

    @PutMapping("/{id}/read")
    @Operation(summary = "Mark a notification as read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable Long id, Authentication auth) {
        Long userId = getUserId(auth);
        notificationService.markAsRead(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read."));
    }

    @PutMapping("/read-all")
    @Operation(summary = "Mark all notifications as read for current user")
    public ResponseEntity<ApiResponse<Void>> markAllRead(Authentication auth) {
        Long userId = getUserId(auth);
        notificationService.markAllRead(userId);
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read."));
    }
}
