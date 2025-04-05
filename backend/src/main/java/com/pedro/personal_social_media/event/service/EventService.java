package com.pedro.personal_social_media.event.service;

import com.pedro.personal_social_media.event.dto.CreateEventDTO;
import com.pedro.personal_social_media.event.dto.CreateEventDTO.ParticipantDTO;
import com.pedro.personal_social_media.event.dto.EventSummaryDTO;
import com.pedro.personal_social_media.event.model.Event;
import com.pedro.personal_social_media.event.model.Participation;
import com.pedro.personal_social_media.person.model.Person;
import com.pedro.personal_social_media.person.repository.PersonRepository;
import com.pedro.personal_social_media.event.repository.EventRepository;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class EventService {

    private final PersonRepository personRepository;
    private final EventRepository eventRepository;

    public EventService(PersonRepository personRepository, EventRepository eventRepository) {
        this.personRepository = personRepository;
        this.eventRepository = eventRepository;
    }

    public Event createEvent(CreateEventDTO dto) {
        Event event = Event.builder()
                .id(UUID.randomUUID())
                .title(dto.getTitle())
                .type(dto.getType())
                .location(dto.getLocation())
                .description(dto.getDescription())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .photoUrls(dto.getPhotoUrls())
                .build();

        List<Person> personsToSave = new ArrayList<>();

        for (ParticipantDTO p : dto.getParticipants()) {
            personRepository.findById(p.getPersonId()).ifPresent(person -> {
                Participation participation = Participation.builder()
                        .event(event)
                        .role(p.getRole())
                        .note(p.getNote())
                        .comment(p.getComment())
                        .joinedAt(p.getJoinedAt())
                        .build();

                if (person.getParticipations() == null) {
                    person.setParticipations(new ArrayList<>());
                }
                person.getParticipations().add(participation);

                personsToSave.add(person);
            });
        }

        personRepository.saveAll(personsToSave);
        return event;
    }

    public List<Event> getMyEvents(UUID meId) {
      return eventRepository.findEventsByParticipant(meId);
    }

    public List<EventSummaryDTO> getMyEventSummaries(UUID meId) {
    Person me = personRepository.findById(meId).orElseThrow(() -> new RuntimeException("User not found"));

    return me.getParticipations().stream()
        .map(participation -> {
            Event event = participation.getEvent();

            double avgNote = event.getParticipations() == null || event.getParticipations().isEmpty()
                    ? 0.0
                    : event.getParticipations().stream()
                        .mapToInt(Participation::getNote)
                        .average()
                        .orElse(0.0);

            return EventSummaryDTO.builder()
                    .id(event.getId())
                    .title(event.getTitle())
                    .type(event.getType())
                    .startDate(event.getStartDate())
                    .endDate(event.getEndDate())
                    .averageNote(avgNote)
                    .build();
        })
        .collect(Collectors.toList());
    }

    public List<Event> getMyUpcomingEvents(UUID meId) {
        return getMyEvents(meId).stream()
                .filter(event -> event.getStartDate() != null && !event.getStartDate().isBefore(LocalDate.now()))
                .toList();
    }

    public List<Event> getMyPastEvents(UUID meId) {
        return getMyEvents(meId).stream()
                .filter(event -> event.getEndDate() != null && event.getEndDate().isBefore(LocalDate.now()))
                .toList();
}
}
