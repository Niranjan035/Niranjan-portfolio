package com.niranjanhiremath.portfolio.controller;

import com.niranjanhiremath.portfolio.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Lightweight liveness endpoint for uptime checks and deploy verification.
 *
 * <p>Deliberately reveals nothing beyond whether the service is up and which
 * subsystem modes are active. The richer Actuator endpoints stay bound to
 * {@code /actuator} and are limited to {@code health} and {@code info}.
 */
@RestController
@RequestMapping("/api")
public class HealthController {

    private final boolean mailEnabled;
    private final boolean storeInDatabase;

    public HealthController(
            @Value("${app.contact.mail-enabled:false}") boolean mailEnabled,
            @Value("${app.contact.store-in-database:true}") boolean storeInDatabase) {
        this.mailEnabled = mailEnabled;
        this.storeInDatabase = storeInDatabase;
    }

    @GetMapping("/health")
    public ApiResponse health() {
        return ApiResponse.ok("Portfolio API is running.");
    }

    /** Exposes subsystem modes so a misconfigured deployment is obvious. */
    @GetMapping("/status")
    public Map<String, Object> status() {
        return Map.of(
                "status", "up",
                "mailEnabled", mailEnabled,
                "storeInDatabase", storeInDatabase
        );
    }
}
