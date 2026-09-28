package com.niranjanhiremath.portfolio.repository;

import com.niranjanhiremath.portfolio.entity.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

/**
 * Persistence for contact submissions.
 *
 * <p>There is deliberately no read endpoint: submissions exist to be delivered
 * by email and retained for reference, not to be served back out. Query the
 * {@code contact_messages} table directly when you need to review them.
 */
@Repository
public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {

    /** Count of submissions received since a point in time. Useful for monitoring. */
    long countByCreatedAtAfter(LocalDateTime since);
}
