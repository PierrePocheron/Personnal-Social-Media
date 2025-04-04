package com.pedro.personal_social_media.relation.service;

import com.pedro.personal_social_media.person.model.Person;
import com.pedro.personal_social_media.person.repository.PersonRepository;
import com.pedro.personal_social_media.relation.dto.CreateRelationDTO;
import com.pedro.personal_social_media.relation.model.Relation;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RelationService {

    private final PersonRepository personRepository;

    public RelationService(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    public Person createRelation(CreateRelationDTO dto) {
        var source = personRepository.findById(dto.getSourcePersonId()).orElse(null);
        var target = personRepository.findById(dto.getTargetPersonId()).orElse(null);

        if (source == null || target == null) {
            throw new RuntimeException("Source ou cible introuvable");
        }

        Relation relation = Relation.builder()
                .target(target)
                .type(dto.getType())
                .context(dto.getContext())
                .since(dto.getSince())
                .build();

        if (source.getRelations() == null) {
            source.setRelations(List.of(relation));
        } else {
            source.getRelations().add(relation);
        }

        return personRepository.save(source);
    }
}
