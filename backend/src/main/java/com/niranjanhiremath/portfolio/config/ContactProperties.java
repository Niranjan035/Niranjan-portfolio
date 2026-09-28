package com.niranjanhiremath.portfolio.config;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import java.util.ArrayList;
import java.util.List;

/**
 * Externalised configuration for the contact pipeline.
 *
 * <p>Bound from the environment — see {@code application.yml}. Nested
 * {@code CONTACT_*} variables map onto {@code app.contact.*} via relaxed
 * binding, e.g. {@code CONTACT_RECEIVER_EMAIL} sets
 * {@code app.contact.receiver-email}.
 */
@Validated
@ConfigurationProperties(prefix = "app.contact")
public record ContactProperties(

        /**
         * Inbox that receives contact submissions. Defaults to the public address
         * so the app works out of the box, but can be overridden per environment.
         */
        @NotBlank
        @Email
        String receiverEmail,

        /**
         * Address the mail is sent from. May be blank, in which case the SMTP
         * username is used. Some providers require a From that matches the
         * authenticated account, so this is normally left blank for them.
         */
        String fromAddress,

        /**
         * Name shown on the "From" line. Falls back to "Portfolio" when blank.
         */
        String fromName,

        /** Name shown on the "To" line. */
        String subjectPrefix,

        /**
         * When false, messages are logged instead of sent. Intended for local
         * development so the form can be exercised without an SMTP account.
         */
        boolean mailEnabled,

        /** When true, submissions are also written to the contact_messages table. */
        boolean storeInDatabase,

        /** Maximum submissions allowed per client address inside the window. */
        @Min(1)
        @Max(1000)
        int rateLimitMaxRequests,

        /** Length of the rate limit window, in minutes. */
        @Min(1)
        int rateLimitWindowMinutes,

        /**
         * Origins permitted to call this API. Empty means same-origin / curl only;
         * a browser call from another origin will be rejected.
         */
        List<String> allowedOrigins
) {
    public ContactProperties {
        if (receiverEmail == null || receiverEmail.isBlank()) {
            receiverEmail = "niranjanhiremath11@gmail.com";
        }
        if (allowedOrigins == null) {
            allowedOrigins = new ArrayList<>();
        }
        allowedOrigins = allowedOrigins.stream()
                .map(String::trim)
                .filter(origin -> !origin.isEmpty())
                .toList();
        if (rateLimitMaxRequests <= 0) {
            rateLimitMaxRequests = 3;
        }
        if (rateLimitWindowMinutes <= 0) {
            rateLimitWindowMinutes = 10;
        }
        if (fromName == null || fromName.isBlank()) {
            fromName = "Portfolio";
        }
        if (fromAddress != null) {
            fromAddress = fromAddress.trim();
        }
        if (subjectPrefix == null || subjectPrefix.isBlank()) {
            subjectPrefix = "New portfolio message";
        }
    }

    public boolean hasAllowedOrigins() {
        return allowedOrigins != null && !allowedOrigins.isEmpty();
    }

    /**
     * The address to send from, preferring the explicit {@code MAIL_FROM} value
     * and falling back to the SMTP account, then to the receiver address.
     */
    public String resolvedFromAddress(String smtpUsername) {
        if (fromAddress != null && !fromAddress.isBlank()) {
            return fromAddress;
        }
        if (smtpUsername != null && !smtpUsername.isBlank()) {
            return smtpUsername;
        }
        return receiverEmail;
    }

    /** Length of the rate limit window in seconds. */
    public int windowSeconds() {
        return Math.multiplyExact(rateLimitWindowMinutes, 60);
    }
}
