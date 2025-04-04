package com.pedro.personal_social_media.relation.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class CreateRelationDTO {
    private UUID sourcePersonId;
    private UUID targetPersonId;
    private String type;
    private String context;
    private LocalDate since;
}
