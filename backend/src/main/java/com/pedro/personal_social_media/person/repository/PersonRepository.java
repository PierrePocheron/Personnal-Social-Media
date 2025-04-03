package com.pedro.personal_social_media.person.repository;

import com.pedro.personal_social_media.person.model.Person;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;


@Repository
public interface PersonRepository extends Neo4jRepository<Person, UUID> {
    // tu peux rajouter des méthodes personnalisées plus tard si besoin
}