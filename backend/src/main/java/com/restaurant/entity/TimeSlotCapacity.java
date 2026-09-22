package com.restaurant.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalTime;

@Entity
@Table(
    name = "time_slot_capacities",
    uniqueConstraints = @UniqueConstraint(
        name = "uq_tsc_restaurant_slot",
        columnNames = {"restaurant_id", "slot_time"}
    )
)
@Getter @Setter @NoArgsConstructor
public class TimeSlotCapacity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    @Column(name = "slot_time", nullable = false)
    private LocalTime slotTime;

    @Column(name = "max_guests", nullable = false)
    private int maxGuests;
}
