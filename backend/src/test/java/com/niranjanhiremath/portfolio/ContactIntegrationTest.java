package com.niranjanhiremath.portfolio;

import com.niranjanhiremath.portfolio.entity.ContactMessage;
import com.niranjanhiremath.portfolio.repository.ContactMessageRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Full-stack test: real HTTP request, real controller, real service, real
 * persistence. Only SMTP is stubbed out, because the test profile disables mail
 * and {@code ContactService} then logs instead of sending.
 *
 * <p>This is the test that would have caught a broken transaction boundary or a
 * column that is too narrow for a valid payload — the unit and web slices
 * cannot, because they replace the service or never touch the database.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class ContactIntegrationTest {

    @Autowired
    private TestRestTemplate rest;

    @Autowired
    private ContactMessageRepository repository;

    @BeforeEach
    void clearTable() {
        repository.deleteAll();
    }

    /**
     * Posts a submission on behalf of a distinct client address.
     *
     * <p>Each test needs its own {@code X-Forwarded-For}: the rate limiter is
     * keyed on it, and with the test profile's limit of 3 per 10 minutes the
     * later tests would otherwise be rejected with a 429 that has nothing to do
     * with what they are asserting.
     */
    private ResponseEntity<Map> postAs(String clientIp, Map<String, Object> payload) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-Forwarded-For", clientIp);
        return rest.postForEntity("/api/contact", new HttpEntity<>(payload, headers), Map.class);
    }

    private static Map<String, Object> submission(String name, String email, String message) {
        return Map.of("name", name, "email", email, "message", message);
    }

    @Test
    @DisplayName("a valid submission is accepted and stored")
    void storesValidSubmission() {
        ResponseEntity<Map> response = postAs("203.0.113.1", submission(
                "Visitor Name",
                "visitor@example.com",
                "Hello Niranjan, this is an end-to-end test message."));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).containsEntry("success", true);

        List<ContactMessage> saved = repository.findAll();
        assertThat(saved).hasSize(1);
        assertThat(saved.get(0).getName()).isEqualTo("Visitor Name");
        assertThat(saved.get(0).getEmail()).isEqualTo("visitor@example.com");
        assertThat(saved.get(0).getMessage())
                .isEqualTo("Hello Niranjan, this is an end-to-end test message.");
        assertThat(saved.get(0).getCreatedAt()).isNotNull();
    }

    @Test
    @DisplayName("stored values are sanitised, not the raw submission")
    void storesSanitisedValues() {
        ResponseEntity<Map> response = postAs("203.0.113.2", submission(
                "  Visitor\u200BName  ",
                "visitor@example.com",
                "Line one.\r\n\r\n\r\n\r\nLine two."));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);

        ContactMessage saved = repository.findAll().get(0);
        assertThat(saved.getName()).isEqualTo("VisitorName");
        assertThat(saved.getMessage()).isEqualTo("Line one.\n\nLine two.");
    }

    @Test
    @DisplayName("a submission at the maximum allowed lengths is not truncated by the schema")
    void handlesMaximumLengths() {
        String name = "N".repeat(100);
        String message = "M".repeat(5000);

        ResponseEntity<Map> response = postAs("203.0.113.3", submission(
                name,
                "a.very.long.local.part@example.co.in",
                message));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);

        ContactMessage saved = repository.findAll().get(0);
        assertThat(saved.getName()).hasSize(100);
        assertThat(saved.getMessage()).hasSize(5000);
    }

    @Test
    @DisplayName("an invalid submission is rejected and nothing is written")
    void storesNothingForInvalidSubmission() {
        ResponseEntity<Map> response = postAs("203.0.113.4",
                submission("", "not-an-email", "hi"));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(repository.findAll()).isEmpty();
    }

    @Test
    @DisplayName("the honeypot is discarded and nothing is written")
    void storesNothingForHoneypotSubmission() {
        ResponseEntity<Map> response = postAs("203.0.113.5", Map.of(
                "name", "Spam Bot",
                "email", "spam@example.com",
                "message", "Buy cheap backlinks at spam.example.com right now.",
                "website", "http://spam.example.com"));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(repository.findAll()).isEmpty();
    }

    @Test
    @DisplayName("the rate limit is enforced over real HTTP")
    void enforcesRateLimitOverHttp() {
        String client = "203.0.113.6";
        Map<String, Object> payload = submission(
                "Visitor Name", "visitor@example.com", "Testing the rate limiter.");

        for (int i = 0; i < 3; i++) {
            assertThat(postAs(client, payload).getStatusCode()).isEqualTo(HttpStatus.OK);
        }
        assertThat(postAs(client, payload).getStatusCode())
                .isEqualTo(HttpStatus.TOO_MANY_REQUESTS);
    }

    @Test
    @DisplayName("the health endpoint is reachable over HTTP")
    void healthIsReachable() {
        ResponseEntity<Map> response = rest.getForEntity("/api/health", Map.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).containsEntry("success", true);
    }

    @Test
    @DisplayName("mail-disabled environments say so instead of claiming delivery")
    void reportsMailDisabled() {
        ResponseEntity<Map> response = postAs("203.0.113.7", submission(
                "Visitor Name",
                "visitor@example.com",
                "Please confirm the mail-disabled message is honest."));

        assertThat(response.getBody())
                .containsEntry("message",
                        "Message accepted. Email delivery is disabled in this environment.");
    }
}
