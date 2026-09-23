package com.restaurant.serviceimpl;

import com.restaurant.config.AppConfig;
import com.restaurant.dto.request.CreateOrderRequest;
import com.restaurant.dto.request.OrderExtraItemRequest;
import com.restaurant.dto.request.OrderItemRequest;
import com.restaurant.dto.response.OrderResponse;
import com.restaurant.entity.*;
import com.restaurant.enums.OrderStatus;
import com.restaurant.exception.*;
import com.restaurant.repository.*;
import com.restaurant.service.NotificationService;
import com.restaurant.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository             orderRepository;
    private final UserRepository              userRepository;
    private final RoleRepository              roleRepository;
    private final PasswordEncoder             passwordEncoder;
    private final RestaurantRepository        restaurantRepository;
    private final MenuItemRepository          menuItemRepository;
    private final ExtraItemRepository         extraItemRepository;
    private final OrderStatusHistoryRepository historyRepository;
    private final TimeSlotCapacityRepository  slotCapacityRepository;
    private final NotificationService         notificationService;
    private final Clock                       applicationClock;

    // Helper: get the only restaurant
    private Restaurant getRestaurant() {
        return restaurantRepository.findAll().stream()
            .findFirst()
            .orElseThrow(() -> new ResourceNotFoundException("Restaurant not configured."));
    }

    @Override
    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request, Long customerId) {
        String reqMobile = request.getMobile() != null ? request.getMobile().trim() : "";
        String reqName   = request.getCustomerName() != null ? request.getCustomerName().trim() : "";
        String reqEmail  = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";

        User customer;
        if (customerId != null) {
            customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found."));
            if (!reqName.isBlank() && (customer.getName() == null || !customer.getName().equals(reqName))) {
                customer.setName(reqName);
                userRepository.save(customer);
            }
        } else {
            if (reqMobile.isEmpty()) {
                throw new InvalidOrderException("Mobile number is mandatory to book an order.");
            }
            Optional<User> existingUser = userRepository.findByMobile(reqMobile);
            if (existingUser.isPresent()) {
                customer = existingUser.get();
                boolean isAdmin = customer.getRoles().stream()
                    .anyMatch(r -> "ADMIN".equalsIgnoreCase(r.getName()));
                if (!isAdmin) {
                    if (!reqName.isBlank()) {
                        customer.setName(reqName);
                    }
                    if (!reqEmail.isBlank() && !reqEmail.equalsIgnoreCase(customer.getEmail())) {
                        if (!userRepository.existsByEmail(reqEmail)) {
                            customer.setEmail(reqEmail);
                        }
                    }
                    customer = userRepository.save(customer);
                }
            } else {
                Role customerRole = roleRepository.findByName("CUSTOMER")
                    .orElseGet(() -> roleRepository.save(new Role("CUSTOMER")));
                User newUser = new User();
                String name = !reqName.isBlank()
                    ? reqName
                    : ("Guest " + (reqMobile.length() >= 4 ? reqMobile.substring(reqMobile.length() - 4) : reqMobile));
                newUser.setName(name);
                newUser.setMobile(reqMobile);
                String email = !reqEmail.isBlank()
                    ? reqEmail
                    : ("guest_" + reqMobile + "@adianadi.com");
                if (userRepository.existsByEmail(email)) {
                    email = "guest_" + System.currentTimeMillis() + "_" + reqMobile + "@adianadi.com";
                }
                newUser.setEmail(email);
                newUser.setPasswordHash(passwordEncoder.encode(UUID.randomUUID().toString()));
                newUser.setActive(true);
                newUser.getRoles().add(customerRole);
                customer = userRepository.save(newUser);
            }
        }
        Restaurant restaurant = getRestaurant();

        // --- Validate guest count ---
        if (request.getGuestCount() < restaurant.getMinGuests() ||
            request.getGuestCount() > restaurant.getMaxGuests()) {
            throw new InvalidOrderException(
                String.format("Guest count must be between %d and %d.",
                    restaurant.getMinGuests(), restaurant.getMaxGuests()));
        }

        // --- Capacity check ---
        Optional<TimeSlotCapacity> slotOpt = slotCapacityRepository
            .findByRestaurantIdAndSlotTime(restaurant.getId(), request.getBookingTime());

        if (slotOpt.isPresent()) {
            int booked = orderRepository.sumGuestCountForSlot(
                restaurant.getId(), request.getBookingDate(), request.getBookingTime());
            int remaining = slotOpt.get().getMaxGuests() - booked;
            if (request.getGuestCount() > remaining) {
                throw new CapacityExceededException(
                    String.format(
                        "Not enough capacity for this time slot. Available seats: %d.", remaining));
            }
        }

        // --- Build order ---
        Order order = new Order();
        order.setCustomer(customer);
        order.setCustomerName(!reqName.isBlank() ? reqName : customer.getName());
        order.setCustomerMobile(!reqMobile.isBlank() ? reqMobile : customer.getMobile());
        order.setCustomerEmail(!reqEmail.isBlank() ? reqEmail : customer.getEmail());
        order.setRestaurant(restaurant);
        order.setGuestCount(request.getGuestCount());
        order.setBookingDate(request.getBookingDate());
        order.setBookingTime(request.getBookingTime());
        order.setSpecialInstructions(request.getSpecialInstructions());
        order.setStatus(OrderStatus.PENDING);
        // Server-generated timestamp — never from client
        order.setCreatedAt(LocalDateTime.now(applicationClock));

        // --- Calculate prices (backend only — frontend totals are never used) ---
        BigDecimal subtotal = BigDecimal.ZERO;
        for (OrderItemRequest itemReq : request.getItems()) {
            MenuItem menuItem = menuItemRepository.findById(itemReq.getMenuItemId())
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Menu item not found: " + itemReq.getMenuItemId()));
            if (!menuItem.isAvailable()) {
                throw new MenuItemUnavailableException(
                    menuItem.getName() + " is currently not available.");
            }
            BigDecimal unitPrice  = menuItem.getPrice();
            BigDecimal totalPrice = unitPrice.multiply(BigDecimal.valueOf(itemReq.getQuantity()));

            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            oi.setMenuItem(menuItem);
            oi.setItemName(menuItem.getName());       // snapshot
            oi.setQuantity(itemReq.getQuantity());
            oi.setUnitPrice(unitPrice);               // snapshot
            oi.setTotalPrice(totalPrice);
            order.getItems().add(oi);
            subtotal = subtotal.add(totalPrice);
        }

        BigDecimal extraTotal = BigDecimal.ZERO;
        for (OrderExtraItemRequest extraReq : request.getExtraItems()) {
            ExtraItem extraItem = extraItemRepository.findById(extraReq.getExtraItemId())
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Extra item not found: " + extraReq.getExtraItemId()));
            if (!extraItem.isAvailable()) {
                throw new MenuItemUnavailableException(
                    extraItem.getName() + " is currently not available.");
            }
            BigDecimal unitPrice  = extraItem.getPrice();
            BigDecimal totalPrice = unitPrice.multiply(BigDecimal.valueOf(extraReq.getQuantity()));

            OrderExtraItem oei = new OrderExtraItem();
            oei.setOrder(order);
            oei.setExtraItem(extraItem);
            oei.setItemName(extraItem.getName());     // snapshot
            oei.setQuantity(extraReq.getQuantity());
            oei.setUnitPrice(unitPrice);              // snapshot
            oei.setTotalPrice(totalPrice);
            order.getExtraItems().add(oei);
            extraTotal = extraTotal.add(totalPrice);
        }

        order.setSubtotal(subtotal);
        order.setExtraTotal(extraTotal);
        order.setGrandTotal(subtotal.add(extraTotal));

        // --- Generate order number ---
        order.setOrderNumber("ORD-TEMP");          // will be replaced after save gives us the ID
        Order saved = orderRepository.save(order);
        saved.setOrderNumber(String.format("ORD-%05d", saved.getId()));
        saved = orderRepository.save(saved);

        // --- Status history ---
        OrderStatusHistory history = new OrderStatusHistory();
        history.setOrder(saved);
        history.setOldStatus(null);
        history.setNewStatus(OrderStatus.PENDING.name());
        history.setChangedBy(customer);
        history.setChangedAt(LocalDateTime.now(applicationClock));
        historyRepository.save(history);

        // --- Notify admin ---
        notificationService.notifyAdmin(
            saved,
            "New Order Request",
            String.format("Order %s from %s (%d guests) for %s.",
                saved.getOrderNumber(), customer.getName(),
                saved.getGuestCount(), saved.getBookingDate())
        );

        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getMyOrders(Long customerId) {
        return orderRepository.findByCustomerIdOrderByCreatedAtDesc(customerId)
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long orderId, Long customerId) {
        Order order = orderRepository.findByIdAndCustomerId(orderId, customerId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found."));
        return toResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));
        return toResponse(order);
    }

    @Override
    @Transactional
    public OrderResponse cancelOrder(Long orderId, Long customerId) {
        Order order = orderRepository.findByIdAndCustomerId(orderId, customerId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found."));

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new InvalidOrderException(
                "Only pending orders can be cancelled. Current status: " + order.getStatus());
        }

        String oldStatus = order.getStatus().name();
        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);

        User customer = userRepository.findById(customerId).orElseThrow();
        OrderStatusHistory history = new OrderStatusHistory();
        history.setOrder(order);
        history.setOldStatus(oldStatus);
        history.setNewStatus(OrderStatus.CANCELLED.name());
        history.setChangedBy(customer);
        history.setReason("Cancelled by customer");
        history.setChangedAt(LocalDateTime.now(applicationClock));
        historyRepository.save(history);

        return toResponse(order);
    }

    // ── Mapping ─────────────────────────────────────────────────────────────

    OrderResponse toResponse(Order order) {
        String name = order.getCustomerName() != null && !order.getCustomerName().isBlank()
            ? order.getCustomerName()
            : (order.getCustomer() != null ? order.getCustomer().getName() : "");
        String mobile = order.getCustomerMobile() != null && !order.getCustomerMobile().isBlank()
            ? order.getCustomerMobile()
            : (order.getCustomer() != null ? order.getCustomer().getMobile() : "");
        String email = order.getCustomerEmail() != null && !order.getCustomerEmail().isBlank()
            ? order.getCustomerEmail()
            : (order.getCustomer() != null ? order.getCustomer().getEmail() : "");

        var customerResp = com.restaurant.dto.response.UserResponse.builder()
            .id(order.getCustomer() != null ? order.getCustomer().getId() : null)
            .name(name)
            .mobile(mobile)
            .email(email)
            .build();

        var items = order.getItems().stream()
            .map(i -> com.restaurant.dto.response.OrderItemResponse.builder()
                .id(i.getId())
                .menuItemId(i.getMenuItem().getId())
                .itemName(i.getItemName())
                .quantity(i.getQuantity())
                .unitPrice(i.getUnitPrice())
                .totalPrice(i.getTotalPrice())
                .build())
            .collect(Collectors.toList());

        var extraItems = order.getExtraItems().stream()
            .map(e -> com.restaurant.dto.response.OrderExtraItemResponse.builder()
                .id(e.getId())
                .extraItemId(e.getExtraItem().getId())
                .itemName(e.getItemName())
                .quantity(e.getQuantity())
                .unitPrice(e.getUnitPrice())
                .totalPrice(e.getTotalPrice())
                .build())
            .collect(Collectors.toList());

        var statusHistory = historyRepository.findByOrderIdOrderByChangedAtAsc(order.getId())
            .stream()
            .map(h -> com.restaurant.dto.response.OrderStatusHistoryResponse.builder()
                .oldStatus(h.getOldStatus())
                .newStatus(h.getNewStatus())
                .changedBy(h.getChangedBy() != null ? h.getChangedBy().getName() : null)
                .reason(h.getReason())
                .changedAt(h.getChangedAt())
                .build())
            .collect(Collectors.toList());

        return OrderResponse.builder()
            .id(order.getId())
            .orderNumber(order.getOrderNumber())
            .customer(customerResp)
            .guestCount(order.getGuestCount())
            .bookingDate(order.getBookingDate())
            .bookingTime(order.getBookingTime())
            .specialInstructions(order.getSpecialInstructions())
            .subtotal(order.getSubtotal())
            .extraTotal(order.getExtraTotal())
            .grandTotal(order.getGrandTotal())
            .status(order.getStatus().name())
            .rejectionReason(order.getRejectionReason())
            .createdAt(order.getCreatedAt())
            .updatedAt(order.getUpdatedAt())
            .items(items)
            .extraItems(extraItems)
            .statusHistory(statusHistory)
            .build();
    }
}
