package com.niranjanhiremath.portfolio.util;

import java.text.Normalizer;
import java.util.regex.Pattern;

/**
 * InputSanitizer — normalises untrusted text before it is validated, stored, or
 * embedded in an email.
 *
 * <p>This is defence in depth, not the primary control. The important rules:
 * <ul>
 *   <li>Strip control and zero-width characters that can be used to disguise
 *       content or break log output.</li>
 *   <li>Normalise Unicode to NFKC so lookalike characters collapse.</li>
 *   <li>Collapse runs of blank lines and trailing whitespace.</li>
 *   <li>HTML-escape anything that will be placed inside an email body, so a
 *       message can never inject markup into the rendered mail.</li>
 * </ul>
 */
public final class InputSanitizer {

    /**
     * C0/C1 control characters plus Unicode format characters (which includes the
     * zero-width space and bidi overrides) that have no legitimate place in a
     * contact form. Tab, newline and carriage return are preserved.
     */
    private static final Pattern UNSAFE_CHARS = Pattern.compile("[\\p{Cc}\\p{Cf}&&[^\\t\\n\\r]]");

    private static final Pattern EXCESS_BLANK_LINES = Pattern.compile("\n{3,}");
    private static final Pattern TRAILING_SPACES = Pattern.compile("[ \t]+\n");
    private static final Pattern REPEATED_SPACES = Pattern.compile(" {4,}");

    private InputSanitizer() {
    }

    /**
     * Cleans a single-line field (name, email). Line breaks are folded to spaces
     * so a value cannot smuggle a newline into a mail header.
     */
    public static String sanitizeSingleLine(String raw) {
        if (raw == null) {
            return null;
        }
        String value = Normalizer.normalize(raw, Normalizer.Form.NFKC);
        value = UNSAFE_CHARS.matcher(value).replaceAll("");
        value = value.replaceAll("[\\r\\n\\t]+", " ");
        value = REPEATED_SPACES.matcher(value).replaceAll("   ");
        return value.trim();
    }

    /**
     * Cleans a multi-line field (message). Structure is preserved so a genuine
     * multi-paragraph message survives intact.
     */
    public static String sanitizeMultiline(String raw) {
        if (raw == null) {
            return null;
        }
        String value = Normalizer.normalize(raw, Normalizer.Form.NFKC);
        value = UNSAFE_CHARS.matcher(value).replaceAll("");
        value = value.replace("\r\n", "\n").replace('\r', '\n');
        value = TRAILING_SPACES.matcher(value).replaceAll("\n");
        value = EXCESS_BLANK_LINES.matcher(value).replaceAll("\n\n");
        // Strip leading whitespace-only lines but keep leading indentation.
        while (value.startsWith("\n")) {
            value = value.substring(1);
        }
        return value.trim();
    }

    /**
     * Escapes text for safe inclusion in an HTML email body or a {@code <pre>}
     * block. Used for every visitor-supplied value that reaches an HTML mail.
     */
    public static String escapeHtml(String raw) {
        if (raw == null) {
            return "";
        }
        StringBuilder out = new StringBuilder(raw.length() + 16);
        for (int i = 0; i < raw.length(); i++) {
            char c = raw.charAt(i);
            switch (c) {
                case '&' -> out.append("&amp;");
                case '<' -> out.append("&lt;");
                case '>' -> out.append("&gt;");
                case '"' -> out.append("&quot;");
                case '\'' -> out.append("&#39;");
                default -> out.append(c);
            }
        }
        return out.toString();
    }

    /**
     * Removes CR/LF from anything used as a mail subject or address display name,
     * preventing header injection. Other control characters are stripped too.
     */
    public static String sanitizeHeaderValue(String raw) {
        return sanitizeSingleLine(raw);
    }
}
