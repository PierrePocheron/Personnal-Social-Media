package com.pedro.personal_social_media.event.repository;

import com.pedro.personal_social_media.event.model.Event;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EventRepository extends CrudRepository<Event, UUID> {

    @Query("""
        MATCH (p:Person {id: $personId})-[r:PARTICIPATED_IN]->(e:Event)
        OPTIONAL MATCH (other:Person)-[r2:PARTICIPATED_IN]->(e)
        RETURN e, collect(r), collect(other), collect(r2)
    """)
    List<Event> findEventsByParticipant(UUID personId);
}
