package com.restaurant.service;

import com.restaurant.dto.response.PagedResponse;
import com.restaurant.dto.response.UserResponse;

import java.util.Map;

public interface CustomerService {
    UserResponse getProfile(Long userId);
    UserResponse updateProfile(Long userId, Map<String, String> request);
    PagedResponse<UserResponse> getCustomers(int page, int size, String search);
}
