package com.td.plra.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaForwardingController {
    @RequestMapping({
        "/{path:^(?!api|actuator|swagger-ui|api-docs|h2-console)[\\w-]+$}",
        "/{path:^(?!api|actuator|swagger-ui|api-docs|h2-console)[\\w-]+$}/**"
    })
    public String forwardToAngular() {
        return "forward:/index.html";
    }
}
