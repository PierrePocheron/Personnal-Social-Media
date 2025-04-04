package com.pedro.personal_social_media.person.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
public class NetworkDTO {

    private UUID id;
    private String firstName;
    private String lastName;
    private String nickname;

    private List<RelationDTO> relations;

    @Data
    @AllArgsConstructor
    public static class RelationDTO {
        private UUID targetId;
        private String firstName;
        private String lastName;
        private String nickname;

        private String type;
        private String context;
        private LocalDate since;
    }
}
