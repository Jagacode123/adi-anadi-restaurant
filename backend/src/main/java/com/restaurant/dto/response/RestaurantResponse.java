package com.restaurant.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalTime;

@Getter @Builder
public class RestaurantResponse {
    private Long       id;
    private String     name;
    private String     logoUrl;
    private String     phone;
    private String     email;
    private String     address;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime  openingTime;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime  closingTime;

    private int        minGuests;
    private int        maxGuests;
    private boolean    advancePaymentRequired;
    private BigDecimal advancePaymentPercentage;
}
