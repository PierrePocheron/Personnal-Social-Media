package com.pedro.personal_social_media;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, String> home() {
        return Map.of(
                "message", "👋 Bienvenue sur le projet Social Graph de Pedro !",
                "documentation", "/api/me"
        );
    }
}
