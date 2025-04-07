package com.pedro.personal_social_media.place.controller;

import com.pedro.personal_social_media.place.model.Place;
import com.pedro.personal_social_media.place.repository.PlaceRepository;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/places")
@CrossOrigin
public class PlaceController {

    private final PlaceRepository placeRepository;

    public PlaceController(PlaceRepository placeRepository) {
        this.placeRepository = placeRepository;
    }

    @PostMapping
    public Place createPlace(@RequestBody Place place) {
        place.setId(UUID.randomUUID());
        return placeRepository.save(place);
    }
}
