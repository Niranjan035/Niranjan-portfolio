package com.niranjanhiremath.portfolio;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Portfolio backend - REST API powering the contact form on the portfolio.
 *
 * <p>Responsibilities, in order of importance:
 * <ol>
 *   <li>Validate and sanitise incoming contact submissions.</li>
 *   <li>Deliver the message to the configured inbox via JavaMailSender.</li>
 *   <li>Record the submission in MySQL for reference.</li>
 * </ol>
 *
 * <p>No credentials are hardcoded: every secret is read from the environment.
 */
@SpringBootApplication
@ConfigurationPropertiesScan
@EnableScheduling
public class PortfolioBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(PortfolioBackendApplication.class, args);
    }
}
