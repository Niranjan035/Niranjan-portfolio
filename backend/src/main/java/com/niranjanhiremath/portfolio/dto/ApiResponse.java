package com.niranjanhiremath.portfolio.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.Map;

/**
 * Uniform API envelope.
 *
 * <p>Every response — success or failure — uses the same shape so the frontend
 * has exactly one contract to handle:
 *
 * <pre>
 * { "success": true,  "message": "..." }
 * { "success": false, "message": "...", "errors": { "email": "..." } }
 * </pre>
 *
 * <p>Internal details (stack traces, SQL, SMTP responses) are never placed in
 * {@code message}.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiResponse(
        boolean success,
        String message,
        Map<String, String> errors
) {

    public static ApiResponse ok(String message) {
        return new ApiResponse(true, message, null);
    }

    public static ApiResponse error(String message) {
        return new ApiResponse(false, message, null);
    }

    public static ApiResponse validationError(String message, Map<String, String> errors) {
        return new ApiResponse(false, message, errors);
    }
}
