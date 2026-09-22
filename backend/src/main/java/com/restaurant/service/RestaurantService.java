package com.restaurant.service;

import com.restaurant.dto.request.RestaurantConfigRequest;
import com.restaurant.dto.response.RestaurantResponse;
import com.restaurant.entity.TimeSlotCapacity;

import java.util.List;

public interface RestaurantService {
    RestaurantResponse getRestaurantInfo();
    RestaurantResponse updateRestaurantConfig(RestaurantConfigRequest request);
    List<TimeSlotCapacity> getTimeSlots();
    TimeSlotCapacity saveTimeSlot(TimeSlotCapacity slot);
}
