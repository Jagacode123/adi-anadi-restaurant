package com.restaurant.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class RejectOrderRequest {
    private String reason; // optional
}
