package com.niranjanhiremath.portfolio.exception;

/**
 * Thrown when a client exceeds the configured submission limit for its address.
 * Mapped to HTTP 429 by {@link GlobalExceptionHandler}.
 */
public class TooManyRequestsException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public TooManyRequestsException(String message) {
        super(message);
    }
}
