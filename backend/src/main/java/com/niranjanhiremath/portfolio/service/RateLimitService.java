package com.niranjanhiremath.portfolio.service;

import com.niranjanhiremath.portfolio.config.ContactProperties;
import com.niranjanhiremath.portfolio.exception.TooManyRequestsException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * In-memory sliding-window rate limiter, keyed by client address.
 *
 * <p>Purpose is to stop casual form spam, not to withstand a determined
 * distributed attack. It trades precision for the fact that it needs no extra
 * infrastructure.
 *
 * <p><strong>Scaling note:</strong> state is per JVM. If the API is deployed
 * behind more than one instance, each instance enforces its own limit, so the
 * effective ceiling multiplies by the instance count. Swap the store for Redis
 * (or a database table) before scaling out — see the README.
 *
 * <p>The map is pruned on a fixed schedule so an attacker rotating source
 * addresses cannot grow it without bound.
 */
@Service
public class RateLimitService {

    private static final Logger log = LoggerFactory.getLogger(RateLimitService.class);

    private final ContactProperties properties;
    private final Map<String, Window> windows = new ConcurrentHashMap<>();

    public RateLimitService(ContactProperties properties) {
        this.properties = properties;
    }

    /**
     * Records an attempt for the given key and throws if it exceeds the limit.
     *
     * @throws TooManyRequestsException when the limit has been reached
     */
    public void check(String clientKey) {
        long now = System.currentTimeMillis();
        long windowMillis = properties.windowSeconds() * 1000L;

        Window window = windows.compute(clientKey, (key, existing) -> {
            if (existing == null || now - existing.startedAt >= windowMillis) {
                Window fresh = new Window(now);
                fresh.count.incrementAndGet();
                return fresh;
            }
            existing.count.incrementAndGet();
            return existing;
        });

        if (window.count.get() > properties.rateLimitMaxRequests()) {
            log.warn("Rate limit exceeded for client key {}", clientKey);
            throw new TooManyRequestsException(
                    "Too many messages sent. Please wait a few minutes and try again.");
        }
    }

    /**
     * Drops windows that have already expired.
     *
     * <p>Runs on a fixed delay so the map cannot grow without bound; the
     * interval is deliberately coarse because a slightly stale entry costs
     * nothing.
     */
    @Scheduled(fixedDelay = 300_000L, initialDelay = 300_000L)
    public void prune() {
        long cutoff = System.currentTimeMillis() - properties.windowSeconds() * 1000L;
        int before = windows.size();
        windows.entrySet().removeIf(entry -> entry.getValue().startedAt < cutoff);
        int removed = before - windows.size();
        if (removed > 0) {
            log.debug("Pruned {} expired rate limit window(s)", removed);
        }
    }

    private static final class Window {
        private final long startedAt;
        private final AtomicInteger count = new AtomicInteger();

        private Window(long startedAt) {
            this.startedAt = startedAt;
        }
    }
}
