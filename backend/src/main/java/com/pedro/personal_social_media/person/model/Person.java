package com.pedro.personal_social_media.person.model;

import lombok.*;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;

import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.util.UUID;

@Node("Person")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class Person {

    @Id
    @GeneratedValue
    private UUID id; // ⚠️ identifiant unique, généré automatiquement par Neo4J

    @NotBlank(message = "Le prénom est requis")
    private String firstName;

    @NotBlank(message = "Le nom est requis")
    private String lastName;

    private String nickname; // facultatif, remplace ton "username"

    private String job;
    private String company;

    @Pattern(regexp = "^\\+?[0-9. ()-]{7,25}$", message = "Numéro de téléphone invalide")
    private String phoneNumber;

    @Email(message = "Email invalide")
    private String email;

    private String instagram;
    private String address;

    @Past(message = "La date de naissance doit être dans le passé")
    private LocalDate birthdate;
}
