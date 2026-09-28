package com.niranjanhiremath.portfolio.service;

import com.niranjanhiremath.portfolio.config.ContactProperties;
import com.niranjanhiremath.portfolio.dto.ContactRequest;
import com.niranjanhiremath.portfolio.entity.ContactMessage;
import com.niranjanhiremath.portfolio.repository.ContactMessageRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

/**
 * ContactService — orchestrates one contact submission.
 *
 * <p>Order of operations is deliberate:
 * <ol>
 *   <li>Sanitise, so nothing downstream handles raw input.</li>
 *   <li>Persist first, so a delivery failure cannot lose the message.</li>
 *   <li>Send the email, which is the whole point of the form.</li>
 * </ol>
 *
 * <p>A database write failure is logged but does not abort delivery: email is
 * the primary channel, and refusing to notify the site owner because a
 * secondary store is unavailable would be the wrong trade. The reverse is not
 * true — if the email fails, the caller is told, so they can retry.
 */
@Service
public class ContactService {

    private static final Logger log = LoggerFactory.getLogger(ContactService.class);

    private final ContactMailService mailService;
    private final ContactMessageRepository repository;
    private final ContactProperties properties;

    public ContactService(
            ContactMailService mailService,
            ContactMessageRepository repository,
            ContactProperties properties) {
        this.mailService = mailService;
        this.repository = repository;
        this.properties = properties;
    }

    /**
     * Delivers a validated submission and records it.
     *
     * @param request already Bean-Validated; sanitised internally
     * @return the message to show the visitor on success
     * @throws com.niranjanhiremath.portfolio.exception.ContactDeliveryException
     *         if the message could not be delivered
     */
    public String process(ContactRequest request) {
        ContactRequest clean = request.sanitized();

        persist(clean);
        deliver(clean);

        return properties.mailEnabled()
                ? "Message sent successfully."
                : "Message accepted. Email delivery is disabled in this environment.";
    }

    /**
     * Stores the submission in its own transaction.
     *
     * <p>Deliberately <em>not</em> joined to an outer transaction. If the insert
     * failed inside a surrounding transaction, Spring would mark that
     * transaction rollback-only, so swallowing the exception here would still
     * fail the request with an {@code UnexpectedRollbackException} after the
     * email had already been sent. Keeping the write in its own transaction
     * (Spring Data repositories are transactional by default) lets the failure
     * be contained, which is the whole point of catching it.
     */
    private void persist(ContactRequest request) {
        if (!properties.storeInDatabase()) {
            return;
        }
        try {
            repository.save(new ContactMessage(request.name(), request.email(), request.message()));
            log.debug("Stored contact submission from <{}>", request.email());
        } catch (DataAccessException e) {
            // Secondary concern: keep going and try to deliver the email anyway.
            log.error("Could not store contact submission from <{}>", request.email(), e);
        }
    }

    private void deliver(ContactRequest request) {
        if (!properties.mailEnabled()) {
            log.info("""
                    Mail delivery disabled — submission not sent.
                    From: {}
                    Email: {}
                    Message:
                    {}
                    """, request.name(), request.email(), request.message());
            return;
        }
        mailService.send(request);
    }
}
