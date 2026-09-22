package com.restaurant.repository;

import com.restaurant.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByMobile(String mobile);

    boolean existsByEmail(String email);

    boolean existsByMobile(String mobile);

    @org.springframework.data.jpa.repository.Query("""
        SELECT u FROM User u JOIN u.roles r
        WHERE r.name = 'CUSTOMER'
          AND (:search IS NULL OR :search = ''
               OR LOWER(u.name) LIKE LOWER(CONCAT('%', :search, '%'))
               OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))
               OR LOWER(u.mobile) LIKE LOWER(CONCAT('%', :search, '%')))
    """)
    org.springframework.data.domain.Page<User> searchCustomers(
        @org.springframework.data.repository.query.Param("search") String search,
        org.springframework.data.domain.Pageable pageable
    );
}
