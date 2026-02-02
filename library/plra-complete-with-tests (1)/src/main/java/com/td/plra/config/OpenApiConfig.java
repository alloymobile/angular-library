package com.td.plra.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {
    
    @Value("${spring.application.name:PLRA API}")
    private String applicationName;
    
    @Value("${server.servlet.context-path:}")
    private String contextPath;
    
    @Bean
    public OpenAPI plraOpenAPI() {
        return new OpenAPI()
                .info(apiInfo())
                .servers(servers())
                .tags(tags())
                .components(components())
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"));
    }
    
    private Info apiInfo() {
        return new Info()
                .title("PLRA - Product Lending Rate Advisor API")
                .description("""
                        ## Overview
                        The PLRA API provides endpoints for managing lending rates for:
                        - **ULOC** (Unsecured Line of Credit)
                        - **ILOC** (Investment Line of Credit)
                        
                        ## Features
                        - Product hierarchy management (Product → Category → SubCategory → CVP Code)
                        - Amount tier configuration
                        - Rate lifecycle management (Draft → Pending Approval → Approved → Active → History)
                        - Full audit trail via workflow tracking
                        - Prime rate management
                        
                        ## Rate Workflow States
                        | Status | Description |
                        |--------|-------------|
                        | DRAFT | Initial state, editable |
                        | PENDING_APPROVAL | Submitted for review |
                        | APPROVED | Ready for activation |
                        | ACTIVE | Currently in effect |
                        | REJECTED | Returned for revision |
                        | EXPIRED | Manually expired |
                        | SUPERSEDED | Replaced by newer rate |
                        | CANCELLED | Soft deleted |
                        """)
                .version("1.0.0")
                .contact(new Contact()
                        .name("TD PLRA Team")
                        .email("plra-support@td.com"))
                .license(new License()
                        .name("Proprietary")
                        .url("https://www.td.com"));
    }
    
    private List<Server> servers() {
        return List.of(
                new Server()
                        .url("http://localhost:8080" + contextPath)
                        .description("Local Development Server"),
                new Server()
                        .url("https://api-dev.td.com/plra")
                        .description("Development Server"),
                new Server()
                        .url("https://api-uat.td.com/plra")
                        .description("UAT Server"),
                new Server()
                        .url("https://api.td.com/plra")
                        .description("Production Server")
        );
    }
    
    private List<Tag> tags() {
        return List.of(
                new Tag().name("Products").description("Product management - Top level of hierarchy"),
                new Tag().name("Categories").description("Category management - Second level of hierarchy"),
                new Tag().name("SubCategories").description("SubCategory management - Third level of hierarchy"),
                new Tag().name("CVP Codes").description("CVP Code management - Fourth level (ULOC specific)"),
                new Tag().name("Amount Tiers").description("Amount tier configuration for rate bands"),
                new Tag().name("Prime Rates").description("Prime rate management"),
                new Tag().name("Notifications").description("Notification management"),
                new Tag().name("Workflows").description("Workflow audit trail and history"),
                new Tag().name("ILOC Rates").description("Investment LOC rate management - Draft, Active, and History"),
                new Tag().name("ULOC Rates").description("Unsecured LOC rate management - Draft, Active, and History")
        );
    }
    
    private Components components() {
        return new Components()
                .addSecuritySchemes("bearerAuth", new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")
                        .description("JWT token authentication"));
    }
}
