# 🧠 Personal Social Media 

Une application sociale privée pour organiser, visualiser et enrichir tes relations humaines avec un graphe vivant 📈

---

<details>
<summary>

## 🏗️ Getting Started

</summary>

### ✅ Prérequis

- Java 21
- Maven 3+
- Node.js + npm (pour le frontend)
- Neo4j (local ou Docker)
- IDE compatible Java/JS (Cursor, IntelliJ, VSCode...)

### ⚙️ Lancer le backend

```bash
cd backend
mvn spring-boot:run
```

### ⚙️ Lancer le frontend

```bash
cd frontend
npm install
npm run dev
```

</details>

---

<details>
<summary>

## 🛠️ Configuration

</summary>

### 🔐 `application.properties`

```properties
# ID du profil Pedro
app.me.id=10c6b3f4-13c4-4e7c-8aa6-123456789abc

# Générer des fausses données
app.init.fake-data=true

# Connexion à Neo4j
spring.neo4j.uri=bolt://localhost:7687
spring.neo4j.authentication.username=neo4j
spring.neo4j.authentication.password=admin
```

### 🌐 Réinitialisation de la base

```bash
curl http://localhost:8080/api/init/data
```

</details>

---

<details>
<summary>

## 🧰 Technologies Utilisées

</summary>

| Technologie       | Rôle |
|------------------|------|
| **Spring Boot 3.4**       | Backend Java |
| **Neo4j + Spring Data**   | Base graphe |
| **Lombok**                | Génération de code |
| **Java 21**               | Backend |
| **Node.js + Vite + React** (à venir) | Frontend |
| **Maven**                 | Build backend |
| **Docker** (optionnel)    | Neo4j local |

</details>

---

<details>
<summary>

## 🧱 Modèle de Données (Neo4j)

</summary>

### 🎭 `Person`
Relations :
- `[:PARTICIPATED_IN]` → `Event`
- `[:KNOWS]` → `Person`
- `[:IS_ASSOCIATED_WITH]` → `Place`

### 🗓️ `Event`
- Infos : titre, type, lieu, dates...
- Participants via `Participation`

### 👥 `Relation`
- type, contexte, since

### 📍 `Place`
- name
- categories : Sport, Travail, École, etc.
- relié à plusieurs personnes

</details>

---

<details>
<summary>

## ✅ Fonctionnalités

</summary>

### 👤 `/api/me`
- Voir/éditer son profil
- Stats : nb de relations, événements, moyenne notes

### 📅 `/api/events`
- Création d’événements
- Affichage & résumé d’événements

### 🧠 Intelligence relationnelle
- Classement des relations selon :
  - Fréquence de participation
  - Moyenne des notes
  - Dernière interaction

### 🔁 `/api/me/network`
- Exploration réseau
- Amis d’amis & relations indirectes (à venir)

### 📍 `Places`
- Lieux associés aux personnes
- Catégories multiples

</details>

---

<details>
<summary>

## 🧪 Données Fictives

</summary>

- Générées automatiquement au démarrage si activé
- Sinon appel manuel via `/api/init/data`
- Inclut plusieurs :
  - Personnes
  - Relations
  - Événements
  - Places

### 🧼 Nettoyage manuel de la BDD

```cypher
MATCH (n) DETACH DELETE n;
```

</details>

---

💡 *Tu peux adapter ce README à ton futur frontend ou ajouter une démo visuelle en bonus plus tard !*