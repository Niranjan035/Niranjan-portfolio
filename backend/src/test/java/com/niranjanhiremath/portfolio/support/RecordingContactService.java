package com.niranjanhiremath.portfolio.support;

import com.niranjanhiremath.portfolio.config.ContactProperties;
import com.niranjanhiremath.portfolio.dto.ContactRequest;
import com.niranjanhiremath.portfolio.service.ContactMailService;
import com.niranjanhiremath.portfolio.service.ContactService;
import com.niranjanhiremath.portfolio.repository.ContactMessageRepository;

import java.util.ArrayList;
import java.util.List;

/**
 * A recording stand-in for {@link ContactService}.
 *
 * <p>Used instead of a Mockito mock so the web-layer tests need no bytecode
 * instrumentation. Mockito's Byte Buddy does not support every JDK release, and
 * a hand-written stub keeps the suite runnable on whatever JDK the project is
 * built with.
 */
public class RecordingContactService extends ContactService {

    private final List<ContactRequest> received = new ArrayList<>();
    private String response = "Message sent successfully.";
    private RuntimeException failure;

    public RecordingContactService(
            ContactMailService mailService,
            ContactMessageRepository repository,
            ContactProperties properties) {
        super(mailService, repository, properties);
    }

    @Override
    public String process(ContactRequest request) {
        received.add(request);
        if (failure != null) {
            throw failure;
        }
        return response;
    }

    /** Every request that reached the service, in order. */
    public List<ContactRequest> received() {
        return received;
    }

    public int callCount() {
        return received.size();
    }

    public void reset() {
        received.clear();
        response = "Message sent successfully.";
        failure = null;
    }

    public void respondWith(String message) {
        this.response = message;
    }

    public void failWith(RuntimeException e) {
        this.failure = e;
    }
}
