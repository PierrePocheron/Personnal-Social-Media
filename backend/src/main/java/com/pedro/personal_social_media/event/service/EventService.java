package com.pedro.personal_social_media.event.service;

import com.pedro.personal_social_media.event.dto.CreateEventDTO;
import com.pedro.personal_social_media.event.dto.CreateEventDTO.ParticipantDTO;
import com.pedro.personal_social_media.event.model.Event;
import com.pedro.personal_social_media.event.model.Participation;
import com.pedro.personal_social_media.person.model.Person;
import com.pedro.personal_social_media.person.repository.PersonRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class EventService {

    private final PersonRepository personRepository;

    public EventService(PersonRepository personRepository) {
        this.personRepository = personRepository;
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
}
