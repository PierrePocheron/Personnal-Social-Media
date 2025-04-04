package com.pedro.personal_social_media.event.model;

import lombok.*;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;
import com.pedro.personal_social_media.event.model.Participation;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Node("Event")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {

    @Id
    private UUID id;

    private String title;
    private String type; // restaurant, voyage, soirée, etc.
    private String location;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;

    private List<String> photoUrls; // stocke les liens vers les photos (S3, Cloud, etc.)

    @Relationship(type = "PARTICIPATED_IN", direction = Relationship.Direction.INCOMING)
    private List<Participation> participations;

}
