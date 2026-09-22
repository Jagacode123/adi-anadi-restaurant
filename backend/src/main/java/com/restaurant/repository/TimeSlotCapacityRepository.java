package com.restaurant.repository;

import com.restaurant.entity.TimeSlotCapacity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TimeSlotCapacityRepository extends JpaRepository<TimeSlotCapacity, Long> {

    List<TimeSlotCapacity> findByRestaurantIdOrderBySlotTimeAsc(Long restaurantId);

    Optional<TimeSlotCapacity> findByRestaurantIdAndSlotTime(Long restaurantId, LocalTime slotTime);
}
