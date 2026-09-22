package com.restaurant.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalTime;

@Getter @Setter
public class RestaurantConfigRequest {
    private String     name;
    private String     logoUrl;
    private String     phone;
    private String     email;
    private String     address;
    private LocalTime  openingTime;
    private LocalTime  closingTime;
    private int        minGuests;
    private int        maxGuests;
    private boolean    advancePaymentRequired;
    private BigDecimal advancePaymentPercentage;
}
