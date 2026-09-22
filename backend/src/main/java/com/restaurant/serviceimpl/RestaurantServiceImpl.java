package com.restaurant.serviceimpl;

import com.restaurant.dto.request.RestaurantConfigRequest;
import com.restaurant.dto.response.RestaurantResponse;
import com.restaurant.entity.Restaurant;
import com.restaurant.entity.TimeSlotCapacity;
import com.restaurant.exception.ResourceNotFoundException;
import com.restaurant.repository.RestaurantRepository;
import com.restaurant.repository.TimeSlotCapacityRepository;
import com.restaurant.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RestaurantServiceImpl implements RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final TimeSlotCapacityRepository slotRepository;

    private Restaurant getRestaurant() {
        return restaurantRepository.findAll().stream()
            .findFirst()
            .orElseThrow(() -> new ResourceNotFoundException("Restaurant configuration not found."));
    }

    @Override
    @Transactional(readOnly = true)
    public RestaurantResponse getRestaurantInfo() {
        return toResponse(getRestaurant());
    }

    @Override
    @Transactional
    public RestaurantResponse updateRestaurantConfig(RestaurantConfigRequest request) {
        Restaurant restaurant = getRestaurant();
        if (request.getName() != null) restaurant.setName(request.getName());
        if (request.getLogoUrl() != null) restaurant.setLogoUrl(request.getLogoUrl());
        if (request.getPhone() != null) restaurant.setPhone(request.getPhone());
        if (request.getEmail() != null) restaurant.setEmail(request.getEmail());
        if (request.getAddress() != null) restaurant.setAddress(request.getAddress());
        if (request.getOpeningTime() != null) restaurant.setOpeningTime(request.getOpeningTime());
        if (request.getClosingTime() != null) restaurant.setClosingTime(request.getClosingTime());
        if (request.getMinGuests() > 0) restaurant.setMinGuests(request.getMinGuests());
        if (request.getMaxGuests() > 0) restaurant.setMaxGuests(request.getMaxGuests());
        restaurant.setAdvancePaymentRequired(request.isAdvancePaymentRequired());
        if (request.getAdvancePaymentPercentage() != null) {
            restaurant.setAdvancePaymentPercentage(request.getAdvancePaymentPercentage());
        }

        return toResponse(restaurantRepository.save(restaurant));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TimeSlotCapacity> getTimeSlots() {
        Restaurant restaurant = getRestaurant();
        return slotRepository.findByRestaurantIdOrderBySlotTimeAsc(restaurant.getId());
    }

    @Override
    @Transactional
    public TimeSlotCapacity saveTimeSlot(TimeSlotCapacity slot) {
        Restaurant restaurant = getRestaurant();
        Optional<TimeSlotCapacity> existing = slotRepository
            .findByRestaurantIdAndSlotTime(restaurant.getId(), slot.getSlotTime());

        TimeSlotCapacity target;
        if (existing.isPresent()) {
            target = existing.get();
            target.setMaxGuests(slot.getMaxGuests());
        } else {
            target = new TimeSlotCapacity();
            target.setRestaurant(restaurant);
            target.setSlotTime(slot.getSlotTime());
            target.setMaxGuests(slot.getMaxGuests());
        }
        return slotRepository.save(target);
    }

    private RestaurantResponse toResponse(Restaurant r) {
        return RestaurantResponse.builder()
            .id(r.getId())
            .name(r.getName())
            .logoUrl(r.getLogoUrl())
            .phone(r.getPhone())
            .email(r.getEmail())
            .address(r.getAddress())
            .openingTime(r.getOpeningTime())
            .closingTime(r.getClosingTime())
            .minGuests(r.getMinGuests())
            .maxGuests(r.getMaxGuests())
            .advancePaymentRequired(r.isAdvancePaymentRequired())
            .advancePaymentPercentage(r.getAdvancePaymentPercentage())
            .build();
    }
}
