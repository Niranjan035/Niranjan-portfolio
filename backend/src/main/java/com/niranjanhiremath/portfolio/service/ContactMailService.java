package com.niranjanhiremath.portfolio.service;

import com.niranjanhiremath.portfolio.config.ContactProperties;
import com.niranjanhiremath.portfolio.dto.ContactRequest;
import com.niranjanhiremath.portfolio.exception.ContactDeliveryException;
import com.niranjanhiremath.portfolio.util.InputSanitizer;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;

/**
 * ContactMailService — delivers a submission to the configured inbox using
 * Spring Boot's {@link JavaMailSender}.
 *
 * <p>The SMTP provider is not assumed. Host, port, credentials, and TLS mode all
 * come from {@code spring.mail.*}, which is bound to the {@code MAIL_*}
 * environment variables — the same application works with Gmail app passwords,
 * Outlook, Brevo, SendGrid, or SES by changing configuration alone.
 *
 * <p>The message is sent as multipart/alternative: a plain-text part for clients
 * that want it, and a styled HTML part for the rest. Every visitor-supplied
 * value is HTML-escaped before interpolation.
 */
@Service
public class ContactMailService {

    private static final Logger log = LoggerFactory.getLogger(ContactMailService.class);

    private final JavaMailSender mailSender;
    private final ContactProperties properties;
    private final String smtpUsername;
    private final String configuredFromName;

    public ContactMailService(
            JavaMailSender mailSender,
            ContactProperties properties,
            @Value("${spring.mail.username:}") String smtpUsername,
            @Value("${spring.mail.properties.mail.from-name:}") String fromName) {
        this.mailSender = mailSender;
        this.properties = properties;
        this.smtpUsername = smtpUsername;
        this.configuredFromName = fromName;
    }

    /**
     * Sends one contact submission.
     *
     * @throws ContactDeliveryException if the SMTP exchange fails
     */
    public void send(ContactRequest request) {
        String subject = buildSubject(request);
        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());
            helper.setFrom(resolveFromAddress());
            helper.setTo(properties.receiverEmail());
            helper.setSubject(subject);
            helper.setReplyTo(replyToAddress(request));
            helper.setText(plainTextBody(request), false);
            helper.setText(htmlBody(request), true);

            mailSender.send(message);
            log.info("Contact message delivered to {} from <{}>",
                    properties.receiverEmail(), request.email());
        } catch (MessagingException | MailException | IllegalArgumentException e) {
            // The cause is logged for the operator; the client is told nothing.
            log.error("Failed to deliver contact message from <{}>", request.email(), e);
            throw new ContactDeliveryException("Contact message could not be delivered.", e);
        }
    }

    private String buildSubject(ContactRequest request) {
        String name = InputSanitizer.sanitizeHeaderValue(request.name());
        String subject = String.format("%s from %s", properties.subjectPrefix(), name);
        // Guard against a pathological subject length from a very long name.
        return subject.length() > 150 ? subject.substring(0, 147) + "..." : subject;
    }

    /**
     * Builds the Reply-To address from visitor-supplied input.
     *
     * <p>The personal name is stripped of CR/LF before it reaches the address
     * header, so a crafted name cannot inject extra mail headers.
     */
    private InternetAddress replyToAddress(ContactRequest request) {
        try {
            return new InternetAddress(request.email(), sanitizedPersonalName(request.name()));
        } catch (UnsupportedEncodingException e) {
            // Cannot happen for UTF-8, but the constructor declares it.
            throw new ContactDeliveryException("Contact message could not be delivered.", e);
        }
    }

    /**
     * Makes a display name safe for a mail header by removing line breaks and
     * control characters. Quoting and encoding are left to
     * {@link InternetAddress}, which handles both correctly.
     */
    private static String sanitizedPersonalName(String raw) {
        if (raw == null || raw.isBlank()) {
            return null;
        }
        String cleaned = raw.replaceAll("[\\p{Cntrl}]", " ").replaceAll("\\s+", " ").trim();
        return cleaned.isEmpty() ? null : cleaned;
    }

    /**
     * Chooses the From address: the explicit {@code MAIL_FROM} value, then the
     * SMTP username, then the receiver address, so the field is never blank.
     */
    private String resolveFromAddress() {
        String name = configuredFromName != null && !configuredFromName.isBlank()
                ? configuredFromName
                : properties.fromName();
        return new InternetAddressHelper().format(name, properties.resolvedFromAddress(smtpUsername));
    }

    private String plainTextBody(ContactRequest request) {
        return String.join(System.lineSeparator(),
                "A new message was submitted through the portfolio contact form.",
                "",
                "Name:    " + request.name(),
                "Email:   " + request.email(),
                "",
                "Message:",
                "--------",
                request.message(),
                "",
                "--",
                "Sent by the portfolio backend.");
    }

    private String htmlBody(ContactRequest request) {
        String name = InputSanitizer.escapeHtml(request.name());
        String email = InputSanitizer.escapeHtml(request.email());
        String message = InputSanitizer.escapeHtml(request.message());

        return """
                <!doctype html>
                <html lang="en">
                  <body style="margin:0;padding:24px;background:#f7f6f2;font-family:-apple-system,\
                BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#111111;">
                <table role="presentation" width="100%%" cellpadding="0" cellspacing="0" \
                style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #ddddd8;\
                border-radius:8px;">
                  <tr>
                    <td style="padding:28px 32px 16px;">
                      <p style="margin:0 0 4px;font-family:'JetBrains Mono',Consolas,monospace;\
                font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#8a8a85;">
                        New portfolio message</p>
                      <h1 style="margin:0;font-size:22px;font-weight:600;letter-spacing:-0.01em;">
                        %s</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 32px 8px;">
                      <table role="presentation" width="100%%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding:10px 0;border-top:1px solid #ddddd8;width:80px;\
                font-family:'JetBrains Mono',Consolas,monospace;font-size:11px;letter-spacing:0.1em;\
                text-transform:uppercase;color:#8a8a85;vertical-align:top;">Name</td>
                          <td style="padding:10px 0;border-top:1px solid #ddddd8;font-size:15px;">%s</td>
                        </tr>
                        <tr>
                          <td style="padding:10px 0;border-top:1px solid #ddddd8;\
                font-family:'JetBrains Mono',Consolas,monospace;font-size:11px;letter-spacing:0.1em;\
                text-transform:uppercase;color:#8a8a85;vertical-align:top;">Email</td>
                          <td style="padding:10px 0;border-top:1px solid #ddddd8;font-size:15px;">\
                <a href="mailto:%s" style="color:#1769e0;text-decoration:none;">%s</a></td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:8px 32px 28px;">
                      <p style="margin:0 0 8px;font-family:'JetBrains Mono',Consolas,monospace;\
                font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#8a8a85;">Message</p>
                      <div style="padding:16px;background:#f7f6f2;border:1px solid #ddddd8;\
                border-radius:6px;font-size:15px;line-height:1.65;white-space:pre-wrap;\
                word-break:break-word;">%s</div>
                    </td>
                  </tr>
                </table>
                <p style="max-width:640px;margin:16px auto 0;font-size:12px;color:#8a8a85;">
                  Reply directly to this email to respond to %s.</p>
              </body>
            </html>
                """.formatted(name, name, email, email, message, name);
    }

    /**
     * Tiny helper so a display name containing a comma or quote cannot corrupt
     * the address header.
     */
    private static final class InternetAddressHelper {

        String format(String displayName, String address) {
            String safeName = displayName == null ? "" : displayName.replaceAll("[\"\\\\]", "");
            return safeName.isBlank() ? address : String.format("%s <%s>", safeName, address);
        }
    }
}
