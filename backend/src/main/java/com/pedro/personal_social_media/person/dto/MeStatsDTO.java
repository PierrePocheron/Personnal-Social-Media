package com.pedro.personal_social_media.person.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class MeStatsDTO {
    private UUID id;
    private String name;
    private int relationsCount;
    private int eventsCount;
    private double averageNote;
}
