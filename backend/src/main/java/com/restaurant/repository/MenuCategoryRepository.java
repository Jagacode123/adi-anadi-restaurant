package com.restaurant.repository;

import com.restaurant.entity.MenuCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuCategoryRepository extends JpaRepository<MenuCategory, Long> {

    List<MenuCategory> findByRestaurantIdAndActiveTrueOrderByDisplayOrderAsc(Long restaurantId);

    List<MenuCategory> findByRestaurantIdOrderByDisplayOrderAsc(Long restaurantId);
}
