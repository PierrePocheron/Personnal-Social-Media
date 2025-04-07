package com.pedro.personal_social_media.place.repository;

import com.pedro.personal_social_media.place.model.Place;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PlaceRepository extends Neo4jRepository<Place, UUID> {

}
