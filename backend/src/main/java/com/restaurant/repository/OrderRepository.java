package com.restaurant.repository;

import com.restaurant.entity.Order;
import com.restaurant.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    List<Order> findByStatusOrderByCreatedAtAsc(OrderStatus status);

    Page<Order> findAll(Pageable pageable);

    Optional<Order> findByIdAndCustomerId(Long id, Long customerId);

    /** Used for capacity checks: sum guests already booked for a slot */
    @Query("""
        SELECT COALESCE(SUM(o.guestCount), 0)
        FROM Order o
        WHERE o.restaurant.id = :restaurantId
          AND o.bookingDate = :date
          AND o.bookingTime = :time
          AND o.status IN ('PENDING', 'APPROVED')
        """)
    int sumGuestCountForSlot(
        @Param("restaurantId") Long restaurantId,
        @Param("date") LocalDate date,
        @Param("time") java.time.LocalTime time
    );

    // --- Dashboard queries ---

    long countByStatus(OrderStatus status);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.bookingDate = :date")
    long countByBookingDate(@Param("date") LocalDate date);

    @Query("SELECT COALESCE(SUM(o.guestCount), 0) FROM Order o WHERE o.bookingDate = :date AND o.status = 'APPROVED'")
    long sumGuestsByBookingDate(@Param("date") LocalDate date);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.bookingDate > :date AND o.status = 'APPROVED'")
    long countUpcomingBookings(@Param("date") LocalDate date);

    // --- Admin search + filter ---

    @Query("""
        SELECT o FROM Order o
        WHERE (:status IS NULL OR o.status = :status)
          AND (:date   IS NULL OR o.bookingDate = :date)
          AND (:search IS NULL OR :search = ''
               OR LOWER(o.customer.name)   LIKE LOWER(CONCAT('%', :search, '%'))
               OR LOWER(o.customer.mobile) LIKE LOWER(CONCAT('%', :search, '%'))
               OR LOWER(o.orderNumber)     LIKE LOWER(CONCAT('%', :search, '%')))
        """)
    Page<Order> searchOrders(
        @Param("status") OrderStatus status,
        @Param("date")   LocalDate date,
        @Param("search") String search,
        Pageable pageable
    );
}
