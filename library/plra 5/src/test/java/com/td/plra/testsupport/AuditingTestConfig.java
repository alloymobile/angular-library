package com.td.plra.testsupport;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import java.util.Optional;

@TestConfiguration
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
public class AuditingTestConfig {

    @Bean
    public AuditorAware<String> auditorAware() {
        return () -> Optional.of("test-user");
    }
}
