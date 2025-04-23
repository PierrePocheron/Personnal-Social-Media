package com.pedro.personal_social_media.person.controller;

import com.pedro.personal_social_media.person.model.Person;
import com.pedro.personal_social_media.person.service.PersonService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;


import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/persons")
@CrossOrigin(origins = "*") // à restreindre plus tard pour la sécurité
public class PersonController {

    private final PersonService service;

    public PersonController(PersonService service) {
        this.service = service;
    }

    @GetMapping
    public List<Person> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Person getById(@PathVariable UUID id) {
        return service.getById(id);
    }

    @GetMapping("/main")
    public Person getMainUser() {
        return service.getMainUser()
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.NOT_FOUND,
            "Aucun utilisateur principal n'est défini."
        ));
    }

    @PostMapping
    public Person create(@Valid @RequestBody Person person) {
        return service.save(person);
    }

    @PostMapping("/{id}/set-main")
    public Person setMainUser(@PathVariable UUID id) {
        return service.setMainUser(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Utilisateur introuvable"
            ));
    }


    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}
