package com.pedro.personal_social_media.event.dto;

import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventSummaryDTO {
    private UUID id;
    private String title;
    private String type;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double averageNote; // Moyenne des notes des participants
}
