package com.td.plra.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * SPA Forwarding Controller
 * 
 * Angular uses client-side routing. When a user refreshes the browser
 * on a deep link (e.g., /admin/rates), Spring Boot would normally return 404
 * because no server-side route exists for that path.
 * 
 * This controller catches ALL non-API, non-static-resource requests
 * and forwards them to index.html, letting Angular's router handle it.
 * 
 * Request flow:
 *   Browser → /admin/rates → Spring Boot → forward:/index.html → Angular Router → AdminRatesComponent
 */
@Controller
public class SpaForwardingController {

    /**
     * Forward all non-API routes to Angular's index.html.
     * 
     * The regex pattern ensures we DON'T intercept:
     *   - /api/** endpoints (your REST APIs)
     *   - Static files with extensions (.js, .css, .png, .ico, etc.)
     *   - /actuator/** endpoints (Spring Boot Actuator)
     * 
     * Everything else gets forwarded to index.html for Angular routing.
     */
    @RequestMapping(value = {
        "/{path:^(?!api|actuator).*$}",
        "/{path:^(?!api|actuator).*$}/**"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
