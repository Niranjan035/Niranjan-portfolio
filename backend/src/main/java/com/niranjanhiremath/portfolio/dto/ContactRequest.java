package com.niranjanhiremath.portfolio.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.niranjanhiremath.portfolio.util.InputSanitizer;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Inbound payload for {@code POST /api/contact}.
 *
 * <p>Field limits mirror {@code CONTACT_LIMITS} in the frontend
 * ({@code frontend/src/services/contact.ts}) so the two agree on what is valid.
 * The server remains the source of truth; the client-side check exists only to
 * give faster feedback.
 *
 * <p>{@code website} is a honeypot: real visitors never see it, so it must always
 * arrive empty. A non-empty value indicates a bot.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record ContactRequest(

        @NotBlank(message = "Name is required.")
        @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters.")
        String name,

        @NotBlank(message = "Email is required.")
        @Email(message = "Please enter a valid email address.")
        @Size(max = 254, message = "Please enter a valid email address.")
        @Pattern(
                regexp = "^[^\\s@]+@[^\\s@]+\\.[A-Za-z]{2,}$",
                message = "Please enter a valid email address.")
        String email,

        @NotBlank(message = "Message is required.")
        @Size(min = 10, max = 5000, message = "Message must be between 10 and 5000 characters.")
        String message,

        /**
         * Honeypot. Never shown, never required, and never echoed back to the
         * client. A value here means the submission is discarded silently.
         */
        @Size(max = 200, message = "Invalid request.")
        String website
) {

    /** True when the hidden honeypot field was filled in. */
    public boolean isHoneypotTriggered() {
        return website != null && !website.isBlank();
    }

    /**
     * Returns a sanitised copy. Applied after Bean Validation so the constraints
     * see the raw length, then the value is normalised before it is stored or
     * emailed.
     */
    public ContactRequest sanitized() {
        return new ContactRequest(
                InputSanitizer.sanitizeSingleLine(name),
                InputSanitizer.sanitizeSingleLine(email),
                InputSanitizer.sanitizeMultiline(message),
                InputSanitizer.sanitizeSingleLine(website)
        );
    }
}
