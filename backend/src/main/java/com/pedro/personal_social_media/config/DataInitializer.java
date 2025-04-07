package com.pedro.personal_social_media.config;

import com.pedro.personal_social_media.event.model.Event;
import com.pedro.personal_social_media.event.model.Participation;
import com.pedro.personal_social_media.person.model.Person;
import com.pedro.personal_social_media.relation.model.Relation;
import com.pedro.personal_social_media.place.model.Place;
import com.pedro.personal_social_media.person.repository.PersonRepository;
import com.pedro.personal_social_media.event.repository.EventRepository;
import com.pedro.personal_social_media.place.repository.PlaceRepository;
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
    private final PlaceRepository placeRepository;

    @Value("${app.init.fake-data:false}")
    private boolean initFakeData;

    @Value("${app.me.id}")
    private UUID meId;

    public DataInitializer(PersonRepository personRepository, EventRepository eventRepository, PlaceRepository placeRepository) {
        this.personRepository = personRepository;
        this.eventRepository = eventRepository;
        this.placeRepository = placeRepository;
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
        // --- PLACES ---
        Place ynov = Place.builder().name("Ynov Lyon").categories(List.of("École", "Amis")).build();
        Place clubVH = Place.builder().name("Club Victor Hugo").categories(List.of("Sport")).build();
        Place d4care = Place.builder().name("D4Care").categories(List.of("Travail")).build();
        Place avenir = Place.builder().name("Avenir Multimedia").categories(List.of("Travail")).build();
        Place icof = Place.builder().name("ICOF Lyon").categories(List.of("École")).build();
        Place ort = Place.builder().name("ORT Lyon").categories(List.of("École")).build();
        Place maisonFamille = Place.builder().name("Maison de Famille").categories(List.of("Famille")).build();

        placeRepository.saveAll(List.of(ynov, clubVH, d4care, avenir, icof, ort, maisonFamille));

        // --- PERSONNES ---
        Person me = Person.builder()
                .id(meId)
                .firstName("Pierre").lastName("Pocheron").nickname("Pedro")
                .email("pierre@example.com").phoneNumber("+33612345678")
                .job("Développeur Fullstack").company("Pedro Corp")
                .places(List.of(ynov, d4care, clubVH))
                .build();

        Person alice = createPerson("Alice", "Durand", "Ali", "alice@example.com");
        alice.setPlaces(List.of(ynov, clubVH, maisonFamille));

        Person bob = createPerson("Bob", "Martin", "Bobby", "bob@example.com");
        bob.setPlaces(List.of(clubVH, avenir));

        Person clara = createPerson("Clara", "Lemoine", "Cla", "clara@example.com");
        clara.setPlaces(List.of(ynov, icof));

        Person david = createPerson("David", "Bernard", "Dada", "david@example.com");
        david.setPlaces(List.of(ynov, ort, clubVH));

        Person emma = createPerson("Emma", "Morel", "Em", "emma@example.com");
        emma.setPlaces(List.of(ort, maisonFamille));

        Person farid = createPerson("Farid", "Amrani", "Far", "farid@example.com");
        farid.setPlaces(List.of(d4care, clubVH));

        // --- ÉVÉNEMENTS ---
        Event resto = createEvent("Soirée Resto", "restaurant", "Lyon", LocalDate.now().minusDays(15), LocalDate.now().minusDays(15));
        Event trip = createEvent("Week-end à Annecy", "voyage", "Annecy", LocalDate.now().minusDays(30), LocalDate.now().minusDays(28));
        Event apéro = createEvent("Apéro du Vendredi", "soirée", "Chez Pedro", LocalDate.now().minusDays(7), LocalDate.now().minusDays(7));
        Event sport = createEvent("Séance de muscu", "sport", "Club Victor Hugo", LocalDate.now().minusDays(2), LocalDate.now().minusDays(2));
        Event alumni = createEvent("Retrouvailles ICOF", "rencontre", "ICOF", LocalDate.now().minusDays(60), LocalDate.now().minusDays(60));

        // --- PARTICIPATIONS ---
        me.setParticipations(List.of(
                buildParticipation(resto, "organisateur", 8, "Super soirée"),
                buildParticipation(trip, "organisateur", 9, "Trop stylé"),
                buildParticipation(apéro, "organisateur", 7, "Ambiance chill"),
                buildParticipation(sport, "coach", 10, "Grosse perf")
        ));

        alice.setParticipations(List.of(
                buildParticipation(resto, "invitée", 7, "Sympa"),
                buildParticipation(apéro, "invitée", 8, "Bonne vibes"),
                buildParticipation(sport, "partenaire", 9, "Squat PR !")
        ));

        bob.setParticipations(List.of(
                buildParticipation(trip, "invité", 9, "Magnifique"),
                buildParticipation(apéro, "invité", 6, "Trop fatigué"),
                buildParticipation(sport, "partenaire", 7, "Pas mal")
        ));

        clara.setParticipations(List.of(
                buildParticipation(resto, "invitée", 8, "Excellente bouffe"),
                buildParticipation(trip, "invitée", 9, "J’ai kiffé"),
                buildParticipation(alumni, "organisatrice", 9, "Trop d’émotion")
        ));

        david.setParticipations(List.of(
                buildParticipation(sport, "partenaire", 10, "Monstre 💪")
        ));

        emma.setParticipations(List.of(
                buildParticipation(alumni, "invitée", 8, "Que de souvenirs")
        ));

        farid.setParticipations(List.of(
                buildParticipation(sport, "coaché", 8, "Progrès visibles !")
        ));

        // --- RELATIONS (exemples simples) ---
        me.setRelations(List.of(
                buildRelation(me, alice, "amie", "Collège", LocalDate.of(2010, 9, 1)),
                buildRelation(me, bob, "ami", "Soirée Dev", LocalDate.of(2022, 1, 20)),
                buildRelation(me, clara, "ancienne collègue", "Travail", LocalDate.of(2018, 5, 10)),
                buildRelation(me, david, "pote de la salle", "Muscu", LocalDate.of(2023, 2, 1)),
                buildRelation(me, farid, "collègue", "D4Care", LocalDate.of(2021, 9, 15))
        ));

        // --- ENREGISTREMENTS ---
        personRepository.saveAll(List.of(me, alice, bob, clara, david, emma, farid));
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
