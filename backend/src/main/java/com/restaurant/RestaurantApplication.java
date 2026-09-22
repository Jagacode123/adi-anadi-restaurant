package com.restaurant;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.TimeZone;

@SpringBootApplication
public class RestaurantApplication {

    public static void main(String[] args) {
        // Set JVM default timezone to Asia/Kolkata
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));
        SpringApplication.run(RestaurantApplication.class, args);
    }
}
