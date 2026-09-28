package com.niranjanhiremath.portfolio.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests for {@link ContactProperties} — the defaulting and normalisation
 * that keeps a partially configured environment from breaking startup.
 */
class ContactPropertiesTest {

    private static ContactProperties props(String receiver, String fromAddress, String fromName) {
        return new ContactProperties(
                receiver, fromAddress, fromName, "New portfolio message",
                false, true, 3, 10, List.of());
    }

    @Nested
    @DisplayName("from-address resolution")
    class FromAddress {

        @Test
        @DisplayName("prefers the explicit MAIL_FROM value")
        void prefersExplicitFromAddress() {
            ContactProperties p = props("me@example.com", "no-reply@example.com", "Portfolio");
            assertThat(p.resolvedFromAddress("smtp-user@example.com"))
                    .isEqualTo("no-reply@example.com");
        }

        @Test
        @DisplayName("falls back to the SMTP username when MAIL_FROM is blank")
        void fallsBackToSmtpUsername() {
            ContactProperties p = props("me@example.com", "", "Portfolio");
            assertThat(p.resolvedFromAddress("smtp-user@example.com"))
                    .isEqualTo("smtp-user@example.com");
        }

        @Test
        @DisplayName("falls back to the receiver when neither is set")
        void fallsBackToReceiver() {
            ContactProperties p = props("me@example.com", null, "Portfolio");
            assertThat(p.resolvedFromAddress(null)).isEqualTo("me@example.com");
        }

        @Test
        @DisplayName("trims surrounding whitespace from the address")
        void trimsFromAddress() {
            ContactProperties p = props("me@example.com", "  no-reply@example.com  ", "Portfolio");
            assertThat(p.fromAddress()).isEqualTo("no-reply@example.com");
        }
    }

    @Nested
    @DisplayName("defaults and normalisation")
    class Defaults {

        @Test
        @DisplayName("a blank receiver falls back to the public address")
        void defaultsReceiver() {
            assertThat(props("  ", "", "Portfolio").receiverEmail())
                    .isEqualTo("niranjanhiremath11@gmail.com");
        }

        @Test
        @DisplayName("a blank from-name falls back to Portfolio")
        void defaultsFromName() {
            assertThat(props("me@example.com", "", "  ").fromName()).isEqualTo("Portfolio");
        }

        @Test
        @DisplayName("non-positive rate limit values fall back to safe defaults")
        void defaultsRateLimit() {
            ContactProperties p = new ContactProperties(
                    "me@example.com", "", "Portfolio", "Subject",
                    false, true, 0, -5, null);
            assertThat(p.rateLimitMaxRequests()).isEqualTo(3);
            assertThat(p.rateLimitWindowMinutes()).isEqualTo(10);
            assertThat(p.windowSeconds()).isEqualTo(600);
        }

        @Test
        @DisplayName("null origins become an empty list rather than a null dereference")
        void defaultsOrigins() {
            assertThat(props("me@example.com", "", "Portfolio").allowedOrigins()).isEmpty();
            assertThat(props("me@example.com", "", "Portfolio").hasAllowedOrigins()).isFalse();
        }

        @Test
        @DisplayName("blank entries are dropped from the origin list")
        void dropsBlankOrigins() {
            ContactProperties p = new ContactProperties(
                    "me@example.com", "", "Portfolio", "Subject",
                    false, true, 3, 10,
                    Arrays.asList("http://localhost:5173", "", "   ", "https://example.com"));
            assertThat(p.allowedOrigins())
                    .containsExactly("http://localhost:5173", "https://example.com");
            assertThat(p.hasAllowedOrigins()).isTrue();
        }
    }
}
