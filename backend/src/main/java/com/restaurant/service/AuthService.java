package com.restaurant.service;

import com.restaurant.dto.request.LoginRequest;
import com.restaurant.dto.request.RegisterRequest;
import com.restaurant.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
