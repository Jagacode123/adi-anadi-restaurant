package com.restaurant.repository;

import com.restaurant.entity.OrderExtraItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderExtraItemRepository extends JpaRepository<OrderExtraItem, Long> {

    List<OrderExtraItem> findByOrderId(Long orderId);
}
