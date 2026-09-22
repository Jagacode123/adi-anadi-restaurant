package com.restaurant.repository;

import com.restaurant.entity.ExtraItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExtraItemRepository extends JpaRepository<ExtraItem, Long> {

    List<ExtraItem> findByAvailableTrueOrderByNameAsc();
}
