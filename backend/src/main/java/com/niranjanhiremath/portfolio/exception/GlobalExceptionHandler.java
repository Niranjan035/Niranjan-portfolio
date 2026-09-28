package com.niranjanhiremath.portfolio.exception;

import com.niranjanhiremath.portfolio.dto.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * GlobalExceptionHandler — turns every failure into the same {@link ApiResponse}
 * JSON shape the frontend expects.
 *
 * <p>Two rules govern this class:
 * <ol>
 *   <li>The client learns what it needs to fix, and nothing more. Field-level
 *       validation messages are safe to return; stack traces, SQL, and SMTP
 *       responses are not.</li>
 *   <li>Unexpected errors are logged in full server-side and reported to the
 *       client as a generic message.</li>
 * </ol>
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    private static final String GENERIC_ERROR =
            "Something went wrong. Please try again.";

    /** Bean Validation failure: 400 with a per-field breakdown. */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse> handleValidation(
            MethodArgumentNotValidException ex,
            HttpServletRequest request) {

        Map<String, String> errors = new LinkedHashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            // First message per field wins; that is the most specific one.
            errors.putIfAbsent(fieldError.getField(), fieldError.getDefaultMessage());
        }

        log.debug("Rejected invalid contact payload on {}", request.getRequestURI());
        return ResponseEntity.badRequest()
                .body(ApiResponse.validationError("Please check the form and try again.", errors));
    }

    /** Malformed JSON, or a body that cannot be bound to the DTO. */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse> handleUnreadable(HttpMessageNotReadableException ex) {
        log.debug("Rejected malformed request body: {}", ex.getMessage());
        return ResponseEntity.badRequest()
                .body(ApiResponse.validationError("Invalid request format.", null));
    }

    @ExceptionHandler(TooManyRequestsException.class)
    public ResponseEntity<ApiResponse> handleRateLimit(TooManyRequestsException ex) {
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .body(ApiResponse.error(ex.getMessage()));
    }

    /**
     * The submission was valid but could not be handed to SMTP. Reported as 503
     * so the visitor knows retrying may work, and is pointed at the direct email
     * address as a fallback.
     */
    @ExceptionHandler(ContactDeliveryException.class)
    public ResponseEntity<ApiResponse> handleDelivery(ContactDeliveryException ex) {
        log.warn("Contact delivery failed: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(ApiResponse.error(
                        "Your message could not be delivered right now. Please try again, or email directly."));
    }

    @ExceptionHandler({
            MissingServletRequestParameterException.class,
            MethodArgumentTypeMismatchException.class,
            IllegalArgumentException.class
    })
    public ResponseEntity<ApiResponse> handleBadRequest(Exception ex) {
        log.debug("Rejected malformed request: {}", ex.getMessage());
        return ResponseEntity.badRequest().body(ApiResponse.error("Invalid request."));
    }

    @ExceptionHandler({HttpRequestMethodNotSupportedException.class, NoHandlerFoundException.class})
    public ResponseEntity<ApiResponse> handleNotFound(Exception ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("Resource not found."));
    }

    /** Catch-all. The full failure is logged; the client gets a generic message. */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse> handleUnexpected(Exception ex, HttpServletRequest request) {
        log.error("Unhandled error while serving {} {}", request.getMethod(), request.getRequestURI(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(GENERIC_ERROR));
    }
}
