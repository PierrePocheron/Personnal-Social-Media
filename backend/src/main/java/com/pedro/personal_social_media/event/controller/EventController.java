package com.pedro.personal_social_media.event.controller;

import com.pedro.personal_social_media.event.dto.CreateEventDTO;
import com.pedro.personal_social_media.event.model.Event;
import com.pedro.personal_social_media.event.service.EventService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @PostMapping
    public Event create(@RequestBody CreateEventDTO dto) {
        return eventService.createEvent(dto);
    }
}
