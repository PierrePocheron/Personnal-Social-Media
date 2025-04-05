package com.pedro.personal_social_media.event.controller;

import com.pedro.personal_social_media.event.service.EventService;
import org.springframework.web.bind.annotation.*;
import java.util.Map;



@RestController
@CrossOrigin(origins = "*")
public class HomeController {


  @GetMapping("/")
  public Map<String, String> home() {
      return Map.of(
          "message", "👋 Bienvenue sur le projet Social Graph de Pedro !",
          "documentation", "/api/me"
      );
  }
}
