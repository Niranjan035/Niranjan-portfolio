package com.niranjanhiremath.portfolio;

import com.niranjanhiremath.portfolio.util.InputSanitizer;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests for {@link InputSanitizer}.
 *
 * <p>These cover the transformations that protect the mail body and the stored
 * record from untrusted input.
 */
class InputSanitizerTest {

    @Test
    @DisplayName("single-line values drop line breaks so mail headers cannot be injected")
    void singleLineRemovesNewlines() {
        String result = InputSanitizer.sanitizeSingleLine("Alice\r\nBcc: victim@example.com");
        assertThat(result).doesNotContain("\r").doesNotContain("\n");
        assertThat(result).isEqualTo("Alice Bcc: victim@example.com");
    }

    @Test
    @DisplayName("single-line values are trimmed")
    void singleLineTrims() {
        assertThat(InputSanitizer.sanitizeSingleLine("   Niranjan   ")).isEqualTo("Niranjan");
    }

    @Test
    @DisplayName("null passes through unchanged")
    void nullIsSafe() {
        assertThat(InputSanitizer.sanitizeSingleLine(null)).isNull();
        assertThat(InputSanitizer.sanitizeMultiline(null)).isNull();
    }

    @Test
    @DisplayName("control and zero-width characters are removed")
    void stripsInvisibleCharacters() {
        // Zero-width space and a bidi override used to disguise text.
        String sneaky = "Ni\u200Branjan\u202EHiremath";
        String result = InputSanitizer.sanitizeSingleLine(sneaky);
        assertThat(result).isEqualTo("NiranjanHiremath");
    }

    @Test
    @DisplayName("multi-line values keep paragraph structure")
    void multilinePreservesStructure() {
        String message = "First line.\n\nSecond paragraph.\n\n\n\nFourth.";
        String result = InputSanitizer.sanitizeMultiline(message);
        assertThat(result).isEqualTo("First line.\n\nSecond paragraph.\n\nFourth.");
    }

    @Test
    @DisplayName("CRLF and lone CR are normalised to LF")
    void multilineNormalisesLineEndings() {
        String result = InputSanitizer.sanitizeMultiline("a\r\nb\rc");
        assertThat(result).isEqualTo("a\nb\nc");
    }

    @Test
    @DisplayName("trailing whitespace is removed from each line")
    void multilineTrimsTrailingSpaces() {
        assertThat(InputSanitizer.sanitizeMultiline("a   \nb\t\n")).isEqualTo("a\nb");
    }

    @Test
    @DisplayName("leading blank lines are dropped")
    void multilineDropsLeadingBlankLines() {
        assertThat(InputSanitizer.sanitizeMultiline("\n\n\nHello")).isEqualTo("Hello");
    }

    @Test
    @DisplayName("HTML metacharacters are escaped for the mail body")
    void escapesHtml() {
        String result = InputSanitizer.escapeHtml("<img src=x onerror=\"alert('xss')\">");
        assertThat(result)
                .doesNotContain("<")
                .doesNotContain(">")
                .contains("&lt;img")
                .contains("&quot;")
                .contains("&#39;");
    }

    @Test
    @DisplayName("ampersands are escaped before other entities")
    void escapesAmpersandFirst() {
        assertThat(InputSanitizer.escapeHtml("Tom & Jerry")).isEqualTo("Tom &amp; Jerry");
    }

    @Test
    @DisplayName("escapeHtml returns empty string for null")
    void escapeNullIsEmpty() {
        assertThat(InputSanitizer.escapeHtml(null)).isEmpty();
    }
}
