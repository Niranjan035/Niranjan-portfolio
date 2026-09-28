package com.niranjanhiremath.portfolio.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web layer configuration.
 *
 * <p>CORS is driven by {@code CORS_ALLOWED_ORIGINS} (a comma-separated list) so
 * the deployed origin can be changed without a rebuild. When the list is empty,
 * no cross-origin browser request is allowed — a deliberate fail-closed default
 * for production.
 *
 * <p>Credentials are not enabled: the API is stateless and token-free, so there
 * is no reason to permit cookies or {@code Authorization} headers across origins.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    private static final Logger log = LoggerFactory.getLogger(WebConfig.class);

    private final ContactProperties properties;

    public WebConfig(ContactProperties properties) {
        this.properties = properties;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        if (!properties.hasAllowedOrigins()) {
            log.warn("""
                    CORS_ALLOWED_ORIGINS is empty — cross-origin browser requests will be blocked.
                    Set it to the deployed frontend origin (e.g. https://example.com) to allow the
                    contact form to work from a different host.
                    """);
            return;
        }

        log.info("CORS enabled for origins: {}", properties.allowedOrigins());

        registry.addMapping("/api/**")
                .allowedOrigins(properties.allowedOrigins().toArray(String[]::new))
                .allowedMethods("GET", "POST", "OPTIONS")
                .allowedHeaders("Content-Type", "Accept")
                .exposedHeaders("Content-Type")
                .allowCredentials(false)
                .maxAge(3600);
    }
}
