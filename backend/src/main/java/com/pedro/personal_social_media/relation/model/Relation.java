package com.pedro.personal_social_media.relation.model;

import com.pedro.personal_social_media.person.model.Person;
import lombok.*;
import org.springframework.data.neo4j.core.schema.*;

import java.time.LocalDate;
import java.util.UUID;

@RelationshipProperties
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Relation {

    @Id
    @GeneratedValue
    private Long id;

    @TargetNode
    private Person target;

    private String type;     // friend, date, couple, plan_q, colleague...

    private String context;  // soirée, boulot, sport, collège...

    private LocalDate since;
}
