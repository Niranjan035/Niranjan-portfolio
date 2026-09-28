package com.niranjanhiremath.portfolio.dto;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.util.Set;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests for {@link ContactRequest} — both its sanitisation contract and
 * the Bean Validation constraints the controller relies on.
 */
class ContactRequestTest {

    private static ContactRequest request(String name, String email, String message) {
        return new ContactRequest(name, email, message, "");
    }

    @Nested
    @DisplayName("sanitisation")
    class Sanitisation {

        @Test
        @DisplayName("trims single-line fields")
        void trimsSingleLineFields() {
            ContactRequest clean = request("  Niranjan  ", "  visitor@example.com  ", "Body")
                    .sanitized();
            assertThat(clean.name()).isEqualTo("Niranjan");
            assertThat(clean.email()).isEqualTo("visitor@example.com");
        }

        @Test
        @DisplayName("strips a zero-width character from the name")
        void stripsZeroWidth() {
            assertThat(request("Ni\u200Branjan", "visitor@example.com", "Body").sanitized().name())
                    .isEqualTo("Niranjan");
        }

        @Test
        @DisplayName("collapses blank runs in the message but keeps paragraphs")
        void collapsesBlankRunsInMessage() {
            ContactRequest clean = request("Visitor", "visitor@example.com",
                    "First.\n\n\n\n\nSecond.").sanitized();
            assertThat(clean.message()).isEqualTo("First.\n\nSecond.");
        }

        @Test
        @DisplayName("normalises CRLF so stored messages are consistent")
        void normalisesLineEndings() {
            assertThat(request("Visitor", "visitor@example.com", "a\r\nb").sanitized().message())
                    .isEqualTo("a\nb");
        }

        @Test
        @DisplayName("never returns null for a null field")
        void toleratesNulls() {
            ContactRequest clean = request(null, null, null).sanitized();
            assertThat(clean.name()).isNull();
            assertThat(clean.email()).isNull();
            assertThat(clean.message()).isNull();
        }

        @Test
        @DisplayName("does not mutate the original request")
        void isNotDestructive() {
            ContactRequest original = request("  Niranjan  ", "visitor@example.com", "a\r\nb");
            original.sanitized();
            assertThat(original.name()).isEqualTo("  Niranjan  ");
            assertThat(original.message()).isEqualTo("a\r\nb");
        }
    }

    @Nested
    @DisplayName("bean validation constraints")
    class Constraints {

        private Set<String> fieldsViolatedBy(ContactRequest contactRequest) {
            try (var factory = Validation.buildDefaultValidatorFactory()) {
                Validator validator = factory.getValidator();
                return validator.validate(contactRequest).stream()
                        .map(ConstraintViolation::getPropertyPath)
                        .map(Object::toString)
                        .collect(Collectors.toSet());
            }
        }

        @Test
        @DisplayName("accepts a well-formed request")
        void acceptsValidRequest() {
            assertThat(fieldsViolatedBy(
                    request("Visitor Name", "visitor@example.com",
                            "Hello Niranjan, this is a test message.")))
                    .isEmpty();
        }

        @Test
        @DisplayName("rejects a blank name")
        void rejectsBlankName() {
            assertThat(fieldsViolatedBy(request("   ", "visitor@example.com", "Hello there friend.")))
                    .contains("name");
        }

        @Test
        @DisplayName("rejects an invalid email")
        void rejectsInvalidEmail() {
            assertThat(fieldsViolatedBy(request("Visitor", "not-an-email", "Hello there friend.")))
                    .contains("email");
        }

        @Test
        @DisplayName("rejects a message shorter than 10 characters")
        void rejectsShortMessage() {
            assertThat(fieldsViolatedBy(request("Visitor", "visitor@example.com", "hi")))
                    .contains("message");
        }

        @Test
        @DisplayName("rejects a message longer than 5000 characters")
        void rejectsLongMessage() {
            assertThat(fieldsViolatedBy(
                    request("Visitor", "visitor@example.com", "a".repeat(5001))))
                    .contains("message");
        }

        @Test
        @DisplayName("accepts a name at the 100-character boundary")
        void acceptsNameAtBoundary() {
            assertThat(fieldsViolatedBy(
                    request("n".repeat(100), "visitor@example.com", "Hello there friend.")))
                    .isEmpty();
        }

        @Test
        @DisplayName("accepts a message at the 5000-character boundary")
        void acceptsMessageAtBoundary() {
            assertThat(fieldsViolatedBy(
                    request("Visitor", "visitor@example.com", "a".repeat(5000))))
                    .isEmpty();
        }

        @Test
        @DisplayName("tolerates a filled honeypot so the controller can inspect it")
        void honeypotIsNotAValidationError() {
            assertThat(fieldsViolatedBy(new ContactRequest(
                    "Spam Bot", "spam@example.com", "Buy backlinks now please.",
                    "http://spam.example.com")))
                    .doesNotContain("website");
        }
    }
}
