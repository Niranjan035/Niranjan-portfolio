package com.niranjanhiremath.portfolio.controller;

import com.niranjanhiremath.portfolio.dto.ApiResponse;
import com.niranjanhiremath.portfolio.dto.ContactRequest;
import com.niranjanhiremath.portfolio.service.ContactService;
import com.niranjanhiremath.portfolio.service.RateLimitService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Contact API.
 *
 * <pre>
 * POST /api/contact
 * Content-Type: application/json
 *
 * { "name": "Visitor Name", "email": "visitor@example.com", "message": "Hello Niranjan..." }
 * </pre>
 *
 * <p>Responses:
 * <ul>
 *   <li><strong>200</strong> — delivered</li>
 *   <li><strong>400</strong> — validation failed; {@code errors} maps field to reason</li>
 *   <li><strong>429</strong> — rate limit exceeded</li>
 *   <li><strong>503</strong> — validated but could not be delivered</li>
 *   <li><strong>500</strong> — unexpected error (details never returned)</li>
 * </ul>
 */
@RestController
@RequestMapping("/api")
public class ContactController {

    private static final Logger log = LoggerFactory.getLogger(ContactController.class);

    private final ContactService contactService;
    private final RateLimitService rateLimitService;

    public ContactController(ContactService contactService, RateLimitService rateLimitService) {
        this.contactService = contactService;
        this.rateLimitService = rateLimitService;
    }

    @PostMapping("/contact")
    public ResponseEntity<ApiResponse> submit(
            @Valid @RequestBody ContactRequest request,
            HttpServletRequest httpRequest) {

        // A filled honeypot means a bot. Report success so it learns nothing,
        // but do not send or store anything.
        if (request.isHoneypotTriggered()) {
            log.warn("Discarded submission with honeypot field filled in");
            return ResponseEntity.ok(ApiResponse.ok("Message sent successfully."));
        }

        // Rate limit before doing any work, so spam cannot reach the mail path.
        rateLimitService.check(clientKey(httpRequest));

        String message = contactService.process(request);
        return ResponseEntity.ok(ApiResponse.ok(message));
    }

    /**
     * Derives the rate limit key.
     *
     * <p>Uses {@code X-Forwarded-For} when present so the limit applies to the
     * real client rather than the reverse proxy. That header is trivially
     * spoofable, which is acceptable for a soft abuse limit — a determined
     * attacker can already rotate addresses, and the limit is a speed bump, not
     * an access control.
     */
    private String clientKey(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isBlank()) {
            // Left-most entry is the originating client.
            String first = forwardedFor.split(",")[0].trim();
            if (!first.isEmpty()) {
                return first;
            }
        }
        String realIp = request.getHeader("X-Real-IP");
        if (realIp != null && !realIp.isBlank()) {
            return realIp.trim();
        }
        String remote = request.getRemoteAddr();
        return remote == null || remote.isBlank() ? "unknown" : remote;
    }
}
