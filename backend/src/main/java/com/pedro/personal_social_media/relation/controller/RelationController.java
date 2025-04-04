package com.pedro.personal_social_media.relation.controller;

import com.pedro.personal_social_media.person.model.Person;
import com.pedro.personal_social_media.relation.dto.CreateRelationDTO;
import com.pedro.personal_social_media.relation.service.RelationService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/relations")
@CrossOrigin(origins = "*")
public class RelationController {

    private final RelationService relationService;

    public RelationController(RelationService relationService) {
        this.relationService = relationService;
    }

    @PostMapping
    public Person create(@RequestBody CreateRelationDTO dto) {
        return relationService.createRelation(dto);
    }
}
