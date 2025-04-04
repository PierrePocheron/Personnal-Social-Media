package com.pedro.personal_social_media.person.service;

import com.pedro.personal_social_media.person.dto.NetworkDTO;
import com.pedro.personal_social_media.person.model.Person;
import com.pedro.personal_social_media.relation.model.Relation;
import com.pedro.personal_social_media.person.repository.PersonRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class MeNetworkService {

    private final PersonRepository personRepository;

    @Value("${app.me.id}")
    private UUID meId;

    public MeNetworkService(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    public NetworkDTO getMyNetwork() {
        Person me = personRepository.findById(meId).orElseThrow();

        List<NetworkDTO.RelationDTO> relations = new ArrayList<>();
        if (me.getRelations() != null) {
            for (Relation rel : me.getRelations()) {
                Person target = rel.getTarget();
                relations.add(new NetworkDTO.RelationDTO(
                        target.getId(),
                        target.getFirstName(),
                        target.getLastName(),
                        target.getNickname(),
                        rel.getType(),
                        rel.getContext(),
                        rel.getSince()
                ));
            }
        }

        return new NetworkDTO(
                me.getId(),
                me.getFirstName(),
                me.getLastName(),
                me.getNickname(),
                relations
        );
    }
}
