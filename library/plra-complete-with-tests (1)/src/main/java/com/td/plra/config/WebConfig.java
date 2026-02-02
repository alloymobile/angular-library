package com.td.plra.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    private static final int DEFAULT_PAGE_SIZE = 20;
    private static final int MAX_PAGE_SIZE = 100;
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(
                        "http://localhost:3000",
                        "http://localhost:4200",
                        "https://plra-dev.td.com",
                        "https://plra-uat.td.com",
                        "https://plra.td.com"
                )
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .exposedHeaders("X-Total-Count", "X-Page-Number", "X-Page-Size")
                .allowCredentials(true)
                .maxAge(3600);
    }
    
    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        PageableHandlerMethodArgumentResolver pageableResolver = new PageableHandlerMethodArgumentResolver();
        pageableResolver.setFallbackPageable(PageRequest.of(0, DEFAULT_PAGE_SIZE));
        pageableResolver.setMaxPageSize(MAX_PAGE_SIZE);
        pageableResolver.setOneIndexedParameters(false);  // 0-based page index
        // Note: Parameter names (page, size, sort) are defaults in Spring Data
        // They can be customized via application.properties if needed:
        // spring.data.web.pageable.page-parameter=page
        // spring.data.web.pageable.size-parameter=size
        // spring.data.web.sort.sort-parameter=sort
        resolvers.add(pageableResolver);
    }
}
