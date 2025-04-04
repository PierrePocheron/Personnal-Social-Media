package com.pedro.personal_social_media.person.service;

import com.pedro.personal_social_media.person.model.Person;
import com.pedro.personal_social_media.person.repository.PersonRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class MeService {

    @Value("${app.me.uuid}")
    private UUID meId;

    private final PersonRepository personRepository;

    public MeService(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    public Person getMe() {
        return personRepository.findById(meId).orElse(null);
    }

    public Person createMeIfNotExists() {
        return personRepository.findById(meId).orElseGet(() -> {
            Person pedro = Person.builder()
                    .id(meId)
                    .firstName("Pierre")
                    .lastName("Pocheron")
                    .nickname("Pedro")
                    .email("pierre@example.com")
                    .phoneNumber("+33612345678")
                    .job("Développeur Fullstack")
                    .company("Pedro Corp")
                    .build();
            return personRepository.save(pedro);
        });
    }

    @PostConstruct
    public void initMe() {
        createMeIfNotExists();
    }
}
