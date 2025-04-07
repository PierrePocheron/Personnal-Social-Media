package com.pedro.personal_social_media.config;

import com.pedro.personal_social_media.event.model.Event;
import com.pedro.personal_social_media.event.model.Participation;
import com.pedro.personal_social_media.person.model.Person;
import com.pedro.personal_social_media.person.repository.PersonRepository;
import com.pedro.personal_social_media.relation.model.Relation;
import com.pedro.personal_social_media.event.repository.EventRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@Component
@RestController
@RequestMapping("/api/init")
@CrossOrigin
public class DataInitializer {

    private final PersonRepository personRepository;
    private final EventRepository eventRepository;

    @Value("${app.init.fake-data:false}")
    private boolean initFakeData;

    @Value("${app.me.id}")
    private UUID meId;

    public DataInitializer(PersonRepository personRepository, EventRepository eventRepository) {
        this.personRepository = personRepository;
        this.eventRepository = eventRepository;
    }

    @PostConstruct
    public void initDataIfEmpty() {
        if (initFakeData && !personRepository.findById(meId).isPresent()) {
            generateFakeData();
        }
    }

    @GetMapping("/data")
    public String manualInitData() {
        clearDatabase();
        generateFakeData();
        return "Base de données réinitialisée avec des données fictives ✅";
    }

    private void clearDatabase() {
        personRepository.deleteAll();
        eventRepository.deleteAll();
    }

    private void generateFakeData() {
        Person me = Person.builder()
                .id(meId)
                .firstName("Pierre")
                .lastName("Pocheron")
                .nickname("Pedro")
                .email("pierre@example.com")
                .phoneNumber("+33612345678")
                .job("Développeur Fullstack")
                .company("Pedro Corp")
                .build();

        Person alice = createPerson("Alice", "Durand", "Ali", "alice@example.com");
        Person bob = createPerson("Bob", "Martin", "Bobby", "bob@example.com");
        Person clara = createPerson("Clara", "Lemoine", "Cla", "clara@example.com");

        Event resto = createEvent("Soirée Resto", "restaurant", "Lyon", LocalDate.now().minusDays(15), LocalDate.now().minusDays(15));
        Event trip = createEvent("Week-end à Annecy", "voyage", "Annecy", LocalDate.now().minusDays(30), LocalDate.now().minusDays(28));
        Event apéro = createEvent("Apéro du Vendredi", "soirée", "Chez Pedro", LocalDate.now().minusDays(7), LocalDate.now().minusDays(7));

        me.setParticipations(List.of(
                buildParticipation(resto, "organisateur", 8, "Super soirée"),
                buildParticipation(trip, "organisateur", 9, "Trop stylé"),
                buildParticipation(apéro, "organisateur", 7, "Ambiance chill")
        ));

        alice.setParticipations(List.of(
                buildParticipation(resto, "invitée", 7, "Sympa"),
                buildParticipation(apéro, "invitée", 8, "Bonne vibes")
        ));

        bob.setParticipations(List.of(
                buildParticipation(trip, "invité", 9, "Magnifique"),
                buildParticipation(apéro, "invité", 6, "Trop fatigué")
        ));

        clara.setParticipations(List.of(
                buildParticipation(resto, "invitée", 8, "Excellente bouffe"),
                buildParticipation(trip, "invitée", 9, "J’ai kiffé")
        ));

        me.setRelations(List.of(
                buildRelation(me, alice, "amie", "Collège", LocalDate.of(2010, 9, 1)),
                buildRelation(me, bob, "ami", "Soirée Dev", LocalDate.of(2022, 1, 20)),
                buildRelation(me, clara, "ancienne collègue", "Travail", LocalDate.of(2018, 5, 10))
        ));

        personRepository.saveAll(List.of(me, alice, bob, clara));
    }

    private Person createPerson(String firstName, String lastName, String nickname, String email) {
        return Person.builder()
                .id(UUID.randomUUID())
                .firstName(firstName)
                .lastName(lastName)
                .nickname(nickname)
                .email(email)
                .build();
    }

    private Event createEvent(String title, String type, String location, LocalDate start, LocalDate end) {
        return Event.builder()
                .id(UUID.randomUUID())
                .title(title)
                .type(type)
                .location(location)
                .startDate(start)
                .endDate(end)
                .build();
    }

    private Participation buildParticipation(Event event, String role, int note, String comment) {
        return Participation.builder()
                .event(event)
                .role(role)
                .note(note)
                .comment(comment)
                .joinedAt(LocalDate.now())
                .build();
    }

    private Relation buildRelation(Person source, Person target, String type, String context, LocalDate since) {
        return Relation.builder()
                .target(target)
                .type(type)
                .context(context)
                .since(since)
                .build();
    }
}
