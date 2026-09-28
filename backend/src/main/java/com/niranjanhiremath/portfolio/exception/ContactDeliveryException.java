package com.niranjanhiremath.portfolio.exception;

/**
 * Thrown when a validated message could not be handed to the SMTP server.
 *
 * <p>The underlying cause (SMTP response, auth failure, timeout) is kept on the
 * cause chain for the server log only. The message returned to the client is
 * always generic.
 */
public class ContactDeliveryException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public ContactDeliveryException(String message, Throwable cause) {
        super(message, cause);
    }
}
