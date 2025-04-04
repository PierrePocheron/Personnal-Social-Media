package com.pedro.personal_social_media.event.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
public class CreateEventDTO {

    private String title;
    private String type;
    private String location;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<String> photoUrls;

    // participants
    private List<ParticipantDTO> participants;

    @Data
    public static class ParticipantDTO {
        private UUID personId;
        private String role;
        private int note;
        private String comment;
        private LocalDate joinedAt;
    }
}
