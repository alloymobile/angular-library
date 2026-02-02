package com.td.plra.common;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import java.util.Optional;

/**
 * Test configuration for JPA Auditing.
 * Enables automatic population of audit fields in repository tests.
 */
@TestConfiguration
@EnableJpaAuditing(auditorAwareRef = "testAuditorAware")
public class TestJpaConfig {
    
    @Bean
    public AuditorAware<String> testAuditorAware() {
        return () -> Optional.of("test-user");
    }
}
