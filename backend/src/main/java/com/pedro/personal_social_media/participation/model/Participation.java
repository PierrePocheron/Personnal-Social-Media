package com.pedro.personal_social_media.event.model;

import com.pedro.personal_social_media.event.model.Event;
import lombok.*;
import org.springframework.data.neo4j.core.schema.*;

import java.time.LocalDate;

@RelationshipProperties
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Participation {

    @Id
    @GeneratedValue
    private Long id;

    @TargetNode
    private Event event;

    private String role;        // organisateur, invité, etc.
    private int note;           // note sur 10
    private String comment;     // souvenir ou sentiment
    private LocalDate joinedAt; // date de participation
}
