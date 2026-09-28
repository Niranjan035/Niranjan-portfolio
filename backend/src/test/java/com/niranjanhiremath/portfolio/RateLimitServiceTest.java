package com.niranjanhiremath.portfolio.service;

import com.niranjanhiremath.portfolio.config.ContactProperties;
import com.niranjanhiremath.portfolio.exception.TooManyRequestsException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * Unit tests for {@link RateLimitService}.
 */
class RateLimitServiceTest {

    private ContactProperties properties;
    private RateLimitService service;

    private static ContactProperties props(int maxRequests, int windowMinutes) {
        return new ContactProperties(
                "niranjanhiremath11@gmail.com",
                "",
                "Portfolio",
                "New portfolio message",
                false,
                true,
                maxRequests,
                windowMinutes,
                List.of("http://localhost:5173")
        );
    }

    @BeforeEach
    void setUp() {
        properties = props(3, 10);
        service = new RateLimitService(properties);
    }

    @Test
    @DisplayName("allows requests up to the configured limit")
    void allowsUpToLimit() {
        assertThatCode(() -> {
            service.check("1.2.3.4");
            service.check("1.2.3.4");
            service.check("1.2.3.4");
        }).doesNotThrowAnyException();
    }

    @Test
    @DisplayName("rejects the request that exceeds the limit")
    void rejectsBeyondLimit() {
        service.check("1.2.3.4");
        service.check("1.2.3.4");
        service.check("1.2.3.4");

        assertThatThrownBy(() -> service.check("1.2.3.4"))
                .isInstanceOf(TooManyRequestsException.class)
                .hasMessageContaining("Too many messages sent");
    }

    @Test
    @DisplayName("tracks each client independently")
    void isolatesClients() {
        service.check("1.1.1.1");
        service.check("1.1.1.1");
        service.check("1.1.1.1");

        // A different address has its own budget.
        assertThatCode(() -> service.check("2.2.2.2")).doesNotThrowAnyException();
    }

    @Test
    @DisplayName("pruning a populated map is safe and does not reset budgets")
    void prunesWithoutThrowing() {
        service.check("1.2.3.4");
        service.check("5.6.7.8");
        assertThatCode(service::prune).doesNotThrowAnyException();

        // Pruning must not hand anyone a fresh budget.
        service.check("1.2.3.4");
        service.check("1.2.3.4");
        assertThatThrownBy(() -> service.check("1.2.3.4"))
                .isInstanceOf(TooManyRequestsException.class);
    }

    @Test
    @DisplayName("window length is derived from the configured minutes")
    void computesWindowSeconds() {
        assertThat(props(3, 10).windowSeconds()).isEqualTo(600);
        assertThat(props(3, 1).windowSeconds()).isEqualTo(60);
    }
}
