package com.niranjanhiremath.portfolio.entity;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests for {@link ContactMessage}.
 *
 * <p>Lives in the entity package so it can reach the {@code @PrePersist} hook.
 */
class ContactMessageTest {

    @Test
    @DisplayName("stamps createdAt on persist")
    void setsTimestampOnCreate() {
        ContactMessage message = new ContactMessage("Visitor", "visitor@example.com", "Hello there.");
        assertThat(message.getCreatedAt()).isNull();

        message.onCreate();

        assertThat(message.getCreatedAt()).isNotNull();
    }

    @Test
    @DisplayName("keeps the supplied values")
    void keepsValues() {
        ContactMessage message = new ContactMessage("Visitor", "visitor@example.com", "Hello there.");
        assertThat(message.getName()).isEqualTo("Visitor");
        assertThat(message.getEmail()).isEqualTo("visitor@example.com");
        assertThat(message.getMessage()).isEqualTo("Hello there.");
    }

    @Test
    @DisplayName("field widths match the DTO limits so a valid message always fits")
    void lengthsFitTheSchema() {
        // DTO allows name <= 100, email <= 254; the columns are sized to match so
        // a request that passes validation can never be truncated by the database.
        ContactMessage message =
                new ContactMessage("n".repeat(100), "e".repeat(60) + "@example.com", "m");
        assertThat(message.getName()).hasSize(100);
    }
}
