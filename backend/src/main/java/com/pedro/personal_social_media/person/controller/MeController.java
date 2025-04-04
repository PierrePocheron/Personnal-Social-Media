package com.pedro.personal_social_media.person.controller;

import com.pedro.personal_social_media.person.model.Person;
import com.pedro.personal_social_media.person.service.MeService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/me")
@CrossOrigin(origins = "*")
public class MeController {

    private final MeService meService;

    public MeController(MeService meService) {
        this.meService = meService;
    }

    @GetMapping
    public Person getMe() {
        return meService.getMe();
    }

    @PostMapping("/install")
    public Person createMe() {
        return meService.createMeIfNotExists();
    }
}
