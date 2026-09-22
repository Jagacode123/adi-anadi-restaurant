package com.restaurant.serviceimpl;

import com.restaurant.dto.response.PagedResponse;
import com.restaurant.dto.response.UserResponse;
import com.restaurant.entity.Role;
import com.restaurant.entity.User;
import com.restaurant.exception.ResourceNotFoundException;
import com.restaurant.repository.UserRepository;
import com.restaurant.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public UserResponse getProfile(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return toResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateProfile(Long userId, Map<String, String> request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (request.containsKey("name") && request.get("name") != null && !request.get("name").isBlank()) {
            user.setName(request.get("name").trim());
        }
        if (request.containsKey("mobile") && request.get("mobile") != null && !request.get("mobile").isBlank()) {
            user.setMobile(request.get("mobile").trim());
        }
        if (request.containsKey("password") && request.get("password") != null && !request.get("password").isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(request.get("password")));
        }

        return toResponse(userRepository.save(user));
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<UserResponse> getCustomers(int page, int size, String search) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<User> userPage = userRepository.searchCustomers(search, pageable);

        List<UserResponse> content = userPage.getContent()
            .stream().map(this::toResponse).collect(Collectors.toList());

        return PagedResponse.<UserResponse>builder()
            .content(content)
            .page(page)
            .size(size)
            .totalElements(userPage.getTotalElements())
            .totalPages(userPage.getTotalPages())
            .last(userPage.isLast())
            .build();
    }

    private UserResponse toResponse(User user) {
        String role = user.getRoles().stream()
            .map(Role::getName)
            .findFirst()
            .orElse("CUSTOMER");

        return UserResponse.builder()
            .id(user.getId())
            .name(user.getName())
            .email(user.getEmail())
            .mobile(user.getMobile())
            .role(role)
            .createdAt(user.getCreatedAt())
            .build();
    }
}
