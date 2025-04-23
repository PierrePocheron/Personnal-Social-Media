package com.pedro.personal_social_media.person.repository;

import com.pedro.personal_social_media.person.model.Person;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PersonRepository extends Neo4jRepository<Person, UUID> {

    // 🔁 Met à jour tous les utilisateurs pour les désactiver comme "main"
    @Query("MATCH (p:Person {isMainUser: true}) SET p.isMainUser = false")
    void clearMainUser();

    // 👤 Trouve l'utilisateur principal actuel
    Optional<Person> findByIsMainUserTrue();
}
