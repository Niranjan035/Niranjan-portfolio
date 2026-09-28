package com.niranjanhiremath.portfolio.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.niranjanhiremath.portfolio.config.ContactProperties;
import com.niranjanhiremath.portfolio.config.WebConfig;
import com.niranjanhiremath.portfolio.dto.ApiResponse;
import com.niranjanhiremath.portfolio.dto.ContactRequest;
import com.niranjanhiremath.portfolio.exception.ContactDeliveryException;
import com.niranjanhiremath.portfolio.repository.ContactMessageRepository;
import com.niranjanhiremath.portfolio.service.ContactMailService;
import com.niranjanhiremath.portfolio.support.RecordingContactService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Web-layer tests for {@code POST /api/contact}.
 *
 * <p>Runs against the real controller, validation, rate limiter, CORS config and
 * exception handler. Only the service is replaced (by
 * {@link RecordingContactService}), so no MySQL and no SMTP account are needed.
 */
@SpringBootTest
@ActiveProfiles("test")
class ContactControllerTest {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private RecordingContactService contactService;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    /** Replaces the real service with a recording stub, without Mockito. */
    @TestConfiguration
    static class StubConfiguration {
        @Bean
        @Primary
        RecordingContactService recordingContactService(
                ContactMailService mailService,
                ContactMessageRepository repository,
                ContactProperties properties) {
            return new RecordingContactService(mailService, repository, properties);
        }
    }

    @BeforeEach
    void setUp() {
        contactService.reset();
        mockMvc = MockMvcBuilders.webAppContextSetup(context).build();
        objectMapper = new ObjectMapper();
    }

    private String json(Object value) throws Exception {
        return objectMapper.writeValueAsString(value);
    }

    private String validPayload() throws Exception {
        return json(Map.of(
                "name", "Visitor Name",
                "email", "visitor@example.com",
                "message", "Hello Niranjan, this is a test message."
        ));
    }

    @Nested
    @DisplayName("successful submissions")
    class Success {

        @Test
        @DisplayName("returns 200 with a success envelope")
        void acceptsValidSubmission() throws Exception {
            mockMvc.perform(post("/api/contact")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(validPayload())
                            .header("X-Forwarded-For", "203.0.113.10"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.message").value("Message sent successfully."))
                    .andExpect(jsonPath("$.errors").doesNotExist());

            assertThat(contactService.callCount()).isEqualTo(1);
        }

        @Test
        @DisplayName("passes the request through to the service unmodified")
        void passesRequestThroughUnmodified() throws Exception {
            String payload = json(Map.of(
                    "name", "  Visitor\u200BName  ",
                    "email", "visitor@example.com",
                    "message", "Line one.\r\n\r\n\r\n\r\nLine two."
            ));

            mockMvc.perform(post("/api/contact")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(payload)
                            .header("X-Forwarded-For", "203.0.113.11"))
                    .andExpect(status().isOk());

            // The controller must not rewrite the payload; ContactService owns
            // sanitisation. See ContactRequestTest for that behaviour.
            ContactRequest sent = contactService.received().get(0);
            assertThat(sent.name()).isEqualTo("  Visitor\u200BName  ");
            assertThat(sent.message()).isEqualTo("Line one.\r\n\r\n\r\n\r\nLine two.");
        }

        @Test
        @DisplayName("ignores unknown fields instead of rejecting the request")
        void ignoresUnknownFields() throws Exception {
            String payload = json(Map.of(
                    "name", "Visitor Name",
                    "email", "visitor@example.com",
                    "message", "Hello Niranjan, this is a test message.",
                    "unexpectedField", "ignored"
            ));

            mockMvc.perform(post("/api/contact")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(payload)
                            .header("X-Forwarded-For", "203.0.113.12"))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("reports the mail-disabled message when delivery is off")
        void reportsDisabledMail() throws Exception {
            contactService.respondWith("Message accepted. Email delivery is disabled in this environment.");

            mockMvc.perform(post("/api/contact")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(validPayload())
                            .header("X-Forwarded-For", "203.0.113.13"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.message")
                            .value("Message accepted. Email delivery is disabled in this environment."));
        }
    }

    @Nested
    @DisplayName("validation failures")
    class Validation {

        @Test
        @DisplayName("rejects a blank name and names the field")
        void rejectsMissingName() throws Exception {
            mockMvc.perform(post("/api/contact")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json(Map.of(
                                    "name", "",
                                    "email", "visitor@example.com",
                                    "message", "Hello Niranjan, this is a test.")))
                            .header("X-Forwarded-For", "203.0.113.20"))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.errors.name").exists());

            assertThat(contactService.callCount()).isZero();
        }

        @Test
        @DisplayName("rejects a malformed email")
        void rejectsInvalidEmail() throws Exception {
            mockMvc.perform(post("/api/contact")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json(Map.of(
                                    "name", "Visitor Name",
                                    "email", "not-an-email",
                                    "message", "Hello Niranjan, this is a test.")))
                            .header("X-Forwarded-For", "203.0.113.21"))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errors.email").exists());
        }

        @Test
        @DisplayName("rejects a message below the minimum length")
        void rejectsShortMessage() throws Exception {
            mockMvc.perform(post("/api/contact")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json(Map.of(
                                    "name", "Visitor Name",
                                    "email", "visitor@example.com",
                                    "message", "hi")))
                            .header("X-Forwarded-For", "203.0.113.22"))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errors.message").exists());
        }

        @Test
        @DisplayName("rejects a message above the maximum length")
        void rejectsLongMessage() throws Exception {
            mockMvc.perform(post("/api/contact")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json(Map.of(
                                    "name", "Visitor Name",
                                    "email", "visitor@example.com",
                                    "message", "a".repeat(5001))))
                            .header("X-Forwarded-For", "203.0.113.23"))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errors.message").exists());

            assertThat(contactService.callCount()).isZero();
        }

        @Test
        @DisplayName("rejects malformed JSON without leaking parser internals")
        void rejectsMalformedJson() throws Exception {
            String body = mockMvc.perform(post("/api/contact")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{ this is not json ")
                            .header("X-Forwarded-For", "203.0.113.24"))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false))
                    .andReturn().getResponse().getContentAsString();

            assertThat(body).doesNotContain("com.fasterxml");
        }
    }

    @Nested
    @DisplayName("abuse protection")
    class Abuse {

        @Test
        @DisplayName("silently discards a submission that filled the honeypot")
        void discardsHoneypotSubmission() throws Exception {
            String payload = json(Map.of(
                    "name", "Spam Bot",
                    "email", "spam@example.com",
                    "message", "Buy cheap backlinks at spam.example.com now.",
                    "website", "http://spam.example.com"
            ));

            mockMvc.perform(post("/api/contact")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(payload)
                            .header("X-Forwarded-For", "203.0.113.30"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true));

            // The whole point of a honeypot: nothing is sent or stored.
            assertThat(contactService.callCount()).isZero();
        }

        @Test
        @DisplayName("returns 429 once the client exceeds the configured limit")
        void enforcesRateLimit() throws Exception {
            String ip = "203.0.113.40";
            int allowed = 3; // matches application-test.yml

            for (int i = 0; i < allowed; i++) {
                mockMvc.perform(post("/api/contact")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(validPayload())
                                .header("X-Forwarded-For", ip))
                        .andExpect(status().isOk());
            }

            mockMvc.perform(post("/api/contact")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(validPayload())
                            .header("X-Forwarded-For", ip))
                    .andExpect(status().isTooManyRequests())
                    .andExpect(jsonPath("$.success").value(false));

            // The rejected request never reached the service.
            assertThat(contactService.callCount()).isEqualTo(allowed);
        }

        @Test
        @DisplayName("rate limiting is tracked per client")
        void rateLimitIsPerClient() throws Exception {
            String busy = "203.0.113.41";
            for (int i = 0; i < 4; i++) {
                mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validPayload())
                        .header("X-Forwarded-For", busy));
            }

            mockMvc.perform(post("/api/contact")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(validPayload())
                            .header("X-Forwarded-For", "203.0.113.42"))
                    .andExpect(status().isOk());
        }
    }

    @Nested
    @DisplayName("failure handling")
    class Failures {

        @Test
        @DisplayName("returns 503 with a retryable message when delivery fails")
        void reportsDeliveryFailure() throws Exception {
            contactService.failWith(new ContactDeliveryException(
                    "smtp timeout", new IllegalStateException("connection refused")));

            mockMvc.perform(post("/api/contact")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(validPayload())
                            .header("X-Forwarded-For", "203.0.113.50"))
                    .andExpect(status().isServiceUnavailable())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.message").value(
                            "Your message could not be delivered right now. Please try again, or email directly."));
        }

        @Test
        @DisplayName("returns 500 without leaking exception or connection details")
        void neverLeaksInternals() throws Exception {
            contactService.failWith(new IllegalStateException(
                    "jdbc:mysql://user:sup3rsecret@db-host:3306/portfolio is down"));

            String body = mockMvc.perform(post("/api/contact")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(validPayload())
                            .header("X-Forwarded-For", "203.0.113.51"))
                    .andExpect(status().isInternalServerError())
                    .andReturn().getResponse().getContentAsString();

            assertThat(body)
                    .doesNotContain("jdbc")
                    .doesNotContain("sup3rsecret")
                    .doesNotContain("IllegalStateException")
                    .doesNotContain("db-host");
        }
    }

    @Nested
    @DisplayName("CORS")
    class Cors {

        /** Exposes the registry's protected accessor so the mapping can be asserted. */
        static class InspectableCorsRegistry
                extends org.springframework.web.servlet.config.annotation.CorsRegistry {
            Map<String, org.springframework.web.cors.CorsConfiguration> configurations() {
                return getCorsConfigurations();
            }
        }

        private org.springframework.web.cors.CorsConfiguration configFor(String... origins) {
            WebConfig config = new WebConfig(new ContactProperties(
                    "niranjanhiremath11@gmail.com", "", "Portfolio", "Test",
                    false, true, 3, 10, Arrays.asList(origins)));
            InspectableCorsRegistry registry = new InspectableCorsRegistry();
            config.addCorsMappings(registry);
            return registry.configurations().get("/api/**");
        }

        @Test
        @DisplayName("registers the API path for the configured origins")
        void registersConfiguredOrigins() {
            org.springframework.web.cors.CorsConfiguration cors =
                    configFor("http://localhost:5173", "http://127.0.0.1:5173");

            assertThat(cors).isNotNull();
            assertThat(cors.getAllowedOrigins())
                    .containsExactly("http://localhost:5173", "http://127.0.0.1:5173");
        }

        @Test
        @DisplayName("permits only the methods and headers the form needs")
        void restrictsMethodsAndHeaders() {
            org.springframework.web.cors.CorsConfiguration cors = configFor("http://localhost:5173");

            assertThat(cors.getAllowedMethods()).containsExactlyInAnyOrder("GET", "POST", "OPTIONS");
            assertThat(cors.getAllowedHeaders()).containsExactlyInAnyOrder("Content-Type", "Accept");
        }

        @Test
        @DisplayName("does not use a wildcard, so unlisted origins cannot be reflected back")
        void neverUsesWildcard() {
            org.springframework.web.cors.CorsConfiguration cors = configFor("http://localhost:5173");

            assertThat(cors.getAllowedOrigins()).doesNotContain("*");
            assertThat(cors.checkOrigin("https://evil.example.com")).isNull();
            assertThat(cors.checkOrigin("http://localhost:5173")).isEqualTo("http://localhost:5173");
        }

        @Test
        @DisplayName("rejects the null origin a sandboxed iframe or file:// page sends")
        void rejectsNullOrigin() {
            assertThat(configFor("http://localhost:5173").checkOrigin("null")).isNull();
        }

        @Test
        @DisplayName("never allows credentials across origins")
        void disallowsCredentials() {
            assertThat(configFor("http://localhost:5173").getAllowCredentials()).isFalse();
        }

        @Test
        @DisplayName("registers nothing at all when the origin list is empty (fail closed)")
        void failsClosedWhenUnconfigured() {
            assertThat(configFor()).isNull();
        }
    }

    @Nested
    @DisplayName("supporting configuration")
    class Configuration {

        @Test
        @DisplayName("health endpoint reports the service is up")
        void healthEndpointResponds() throws Exception {
            mockMvc.perform(MockMvcRequestBuilders.get("/api/health"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true));
        }

        @Test
        @DisplayName("CORS config registers mappings for the configured origins")
        void corsConfigIsWired() {
            WebConfig config = new WebConfig(new ContactProperties(
                    "niranjanhiremath11@gmail.com", "", "Portfolio", "Test",
                    false, true, 3, 10, List.of("http://localhost:5173")));

            assertThatCode(() -> config.addCorsMappings(new CorsRegistry()))
                    .doesNotThrowAnyException();
        }

        @Test
        @DisplayName("success envelope omits the errors field entirely")
        void successOmitsErrors() throws Exception {
            String json = objectMapper.writeValueAsString(ApiResponse.ok("done"));
            assertThat(json).doesNotContain("errors");
        }
    }
}
