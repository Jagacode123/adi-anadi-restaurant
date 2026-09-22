package com.restaurant.exception;

public class OrderAlreadyProcessedException extends RuntimeException {
    public OrderAlreadyProcessedException(String message) {
        super(message);
    }
}
