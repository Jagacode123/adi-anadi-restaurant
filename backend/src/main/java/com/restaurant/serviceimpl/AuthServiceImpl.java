package com.restaurant.serviceimpl;

import com.restaurant.dto.request.LoginRequest;
import com.restaurant.dto.request.RegisterRequest;
import com.restaurant.dto.response.AuthResponse;
import com.restaurant.dto.response.UserResponse;
import com.restaurant.entity.Role;
import com.restaurant.entity.User;
import com.restaurant.repository.RoleRepository;
import com.restaurant.repository.UserRepository;
import com.restaurant.security.JwtTokenProvider;
import com.restaurant.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository       userRepository;
    private final RoleRepository       roleRepository;
    private final PasswordEncoder      passwordEncoder;
    private final JwtTokenProvider     jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Validate passwords match
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match.");
        }
        // Check uniqueness
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("An account with this email already exists.");
        }
        if (userRepository.existsByMobile(request.getMobile())) {
            throw new IllegalArgumentException("An account with this mobile number already exists.");
        }

        Role customerRole = roleRepository.findByName("CUSTOMER")
            .orElseThrow(() -> new RuntimeException("CUSTOMER role not found. Please run data.sql seed."));

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail().toLowerCase().trim());
        user.setMobile(request.getMobile().trim());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.getRoles().add(customerRole);
        userRepository.save(user);

        String token = jwtTokenProvider.generateToken(user.getEmail());
        return buildAuthResponse(token, user);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail() != null ? request.getEmail().toLowerCase().trim() : "";
        Authentication auth = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(email, request.getPassword())
        );
        String token = jwtTokenProvider.generateToken(auth);
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found after authentication"));
        return buildAuthResponse(token, user);
    }

    private AuthResponse buildAuthResponse(String token, User user) {
        String role = user.getRoles().stream()
            .map(Role::getName)
            .findFirst()
            .orElse("CUSTOMER");

        UserResponse userResponse = UserResponse.builder()
            .id(user.getId())
            .name(user.getName())
            .email(user.getEmail())
            .mobile(user.getMobile())
            .role(role)
            .createdAt(user.getCreatedAt())
            .build();

        return AuthResponse.builder()
            .token(token)
            .user(userResponse)
            .build();
    }
}
