package com.niranjanhiremath.portfolio.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Lob;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

/**
 * A contact form submission.
 *
 * <p>Maps to the {@code contact_messages} table. Columns match the documented
 * schema exactly: {@code id}, {@code name}, {@code email}, {@code message},
 * {@code created_at}. No extra tracking columns are stored, because none are
 * needed to serve the site's single purpose.
 */
@Entity
@Table(
        name = "contact_messages",
        indexes = {
                @Index(name = "idx_contact_messages_created_at", columnList = "created_at")
        }
)
public class ContactMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "email", nullable = false, length = 254)
    private String email;

    /** Message bodies are up to 5000 characters, so a LOB is used. */
    @Lob
    @Column(name = "message", nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    protected ContactMessage() {
        // Required by JPA.
    }

    public ContactMessage(String name, String email, String message) {
        this.name = name;
        this.email = email;
        this.message = message;
    }

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getMessage() {
        return message;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
