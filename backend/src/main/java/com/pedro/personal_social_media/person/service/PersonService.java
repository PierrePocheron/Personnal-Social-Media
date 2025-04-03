package com.pedro.personal_social_media.person.service;

import com.pedro.personal_social_media.person.model.Person;
import com.pedro.personal_social_media.person.repository.PersonRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class PersonService {

    private final PersonRepository repository;

    public PersonService(PersonRepository repository) {
        this.repository = repository;
    }

    public List<Person> getAll() {
        return repository.findAll();
    }

    public Person getById(UUID id) {
        return repository.findById(id).orElse(null);
    }

    public Person save(Person person) {
        return repository.save(person);
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }
}
