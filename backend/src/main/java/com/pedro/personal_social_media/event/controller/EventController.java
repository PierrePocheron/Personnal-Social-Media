package com.pedro.personal_social_media.event.controller;

import com.pedro.personal_social_media.event.dto.CreateEventDTO;
import com.pedro.personal_social_media.event.dto.EventSummaryDTO;
import com.pedro.personal_social_media.event.model.Event;
import com.pedro.personal_social_media.event.service.EventService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {

    private final EventService eventService;

    @Value("${app.me.id}")
    private UUID meId;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @PostMapping
    public Event create(@RequestBody CreateEventDTO dto) {
        return eventService.createEvent(dto);
    }

    @GetMapping("/mine")
    public List<Event> getMyEvents() {
        return eventService.getMyEvents(meId);
    }

    @GetMapping("/mine/summary")
    public List<EventSummaryDTO> getMyEventSummaries() {
        return eventService.getMyEventSummaries(meId);
    }

    @GetMapping("/mine/upcoming")
    public List<Event> getMyUpcomingEvents() {
        return eventService.getMyUpcomingEvents(meId);
    }

    @GetMapping("/mine/past")
    public List<Event> getMyPastEvents() {
        return eventService.getMyPastEvents(meId);
    }
}
