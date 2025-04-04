package com.pedro.personal_social_media.person.controller;

import com.pedro.personal_social_media.person.dto.NetworkDTO;
import com.pedro.personal_social_media.person.service.MeNetworkService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/me")
@CrossOrigin(origins = "*")
public class MeNetworkController {

    private final MeNetworkService meNetworkService;

    public MeNetworkController(MeNetworkService meNetworkService) {
        this.meNetworkService = meNetworkService;
    }

    @GetMapping("/network")
    public NetworkDTO getMyNetwork() {
        return meNetworkService.getMyNetwork();
    }
}
