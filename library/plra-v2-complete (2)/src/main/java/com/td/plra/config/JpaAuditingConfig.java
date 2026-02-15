package com.td.plra.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import java.util.Optional;

/**
 * JPA Auditing configuration.
 * Enables automatic population of @CreatedBy, @CreatedDate, @LastModifiedBy, @LastModifiedDate fields.
 */
@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
public class JpaAuditingConfig {
    
    /**
     * Provides the current auditor (user) for JPA auditing.
     * In a real application, this would return the currently authenticated user.
     */
    @Bean
    public AuditorAware<String> auditorAware() {
        // TODO: Replace with actual security context lookup in production
        // return () -> Optional.ofNullable(SecurityContextHolder.getContext())
        //         .map(SecurityContext::getAuthentication)
        //         .filter(Authentication::isAuthenticated)
        //         .map(Authentication::getName);
        return () -> Optional.of("system");
    }
}
