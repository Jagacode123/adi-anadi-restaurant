package com.restaurant.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Clock;
import java.time.ZoneId;

@Configuration
public class AppConfig {

    public static final ZoneId IST = ZoneId.of("Asia/Kolkata");

    /**
     * Application-wide clock fixed to Asia/Kolkata.
     * Inject this into services instead of calling LocalDateTime.now() directly
     * — makes unit testing easier by allowing clock substitution.
     */
    @Bean
    public Clock applicationClock() {
        return Clock.system(IST);
    }
}
