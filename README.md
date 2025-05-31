# Cool Chess Frontend

> Select a language: [PL](#polish) / [EN](#english)

## English

> Backend is available here: [LINK](https://github.com/accodash/cool-chess-backend)

**Cool Chess** is a chess playing app developed as a school project in ZSK. 

<br>

### 🔍 What are the functionalities?

- 🎮 **Play Chess** - Try your skills against others in an online chess match.
- 🏆 **View Rankings** – Check how you stack up against other players.
- 👥 **User List** – Explore profiles of other users in the system.
- ➕ **Manage Friends & Followings** – Follow your favorite players and manage your chess circle.
- 📊 **Analyze Game History** – Revisit your previous matches and analyze your moves.

<br>

### 🛠️ Built With

- **ReactJS** – Frontend library used.
- **Tanstack** – Used for backend API calls.
- **MaterialUI** – React library that helped a lot with designing stuff.

<br>

### 🚀 Setup Instructions

> You need to have docker compose installed on your machine first.

1. Copy `.env.example` to `.env` file and set up your app's environment
2. Run:
```
npm i
```
3. Run:
```
npm run dev
```

<br>

### 🗃️ Databases Schema

<a href="https://github.com/accodash/cool-chess-frontend/blob/main/database-diagram.jpg" target="_blank"><img src="https://github.com/accodash/cool-chess-frontend/blob/main/database-diagram.jpg" /></a>

#### Backend – PostgreSQL

The backend uses a relational PostgreSQL database to manage all user data, matches, moves, and social interactions. Here's an overview of the main tables:

#### 🧑‍💼 `user`
Stores information about each user:
- `uuid` – unique user identifier (PK)
- `username`, `image_url`, `created_at`

#### 📊 `rating`
Stores a user's rating for a specific game mode:
- `user_uuid` – links to the `user` table (FK)
- `rating`, `mode`

#### 🧩 `match`
Represents a completed or in-progress match:
- `id` – match identifier (PK)
- `white_uuid`, `black_uuid` – players (FK → `user`)
- `start_at`, `end_at`, `is_ranked`, `is_completed`, `winner_uuid`, `mode`

#### ➡️ `move`
Records each move made during a match:
- `match_id` – link to the `match` table (FK)
- `from`, `to` – board positions
- `uuid` – user who made the move (FK → `user`)
- `moved_at`, `time_left`

#### 👥 `friend_relation`
Stores friendships between users:
- `first_uuid`, `second_uuid` – users involved in the friendship (FK → `user`)
- `created_at`, `befriended_at`

#### 👣 `following`
Tracks user follow relationships:
- `follower_uuid`, `followed_user_uuid` – users in a follow relationship (FK → `user`)

<br>

### 🧪 Testing Summary

To ensure the highest quality and stability of the **Cool Chess** application, a comprehensive testing process was carried out. It included both manual testing and automated unit tests.

#### ✅ Manual Testing

The application was thoroughly tested manually – from start to finish – by simulating real user interactions. All major features were covered during testing, including:

- user registration and login,
- playing online chess matches,
- managing friends and following players,
- browsing game history and rankings,
- checking UI responsiveness across devices and browsers.

This testing phase ensured that every part of the application functions as intended and provides a smooth user experience.

#### 🧪 Unit Testing

All application components were covered by unit tests using the **Jest** testing framework. The goal was to guarantee code reliability and catch potential issues early in the development process.

A **100% code coverage** was achieved, including **all lines and branches**. The HTML test coverage report is available at the following path: `/coverage/lcov-report`

To run the test suite, simply execute the following command:
```
npx jest
```

This rigorous testing approach confirms that **Cool Chess** is stable, reliable, and well-prepared for future development or deployment to production environments.

<br>
<br>
<br>

---

<br>
<br>
<br>

## Polish

> Backend jest dostępny tutaj: [LINK](https://github.com/accodash/cool-chess-backend)

**Cool Chess** to aplikacja do grania w szachy stworzona jako projekt szkolny w ZSK.

<br>

### 🔍 Jakie mamy funkcjonalności?

- 🎮 **Graj w Szachy** - Przetestuj swoje umiejętności mierząc się w innymi w sieciowej partii szachów.
- 🏆 **Przeglądanie Rankingu** – Zobacz swoją pozycję wśród innych graczy.
- 👥 **Lista Użytkowników** – Odkrywaj profile innych graczy.
- ➕ **Zarządzanie Znajomymi i Obserwowanymi** – Twórz swoją szachową społeczność.
- 📊 **Analiza Historii Gier** – Analizuj swoje rozegrane partie i wykonane ruchy.

<br>

### 🛠️ Technologie

- **ReactJS** – Biblioteka używana do frontendu.
- **Tanstack** – Wykorzystywany do zapytań API.
- **MaterialUI** – Bliblioteka Reacta, która ułatwiła budowanie interfejsu.

<br>

### 🚀 Uruchomienie

> Musisz mieć zainstalowany docker compose na komputerze, aby uruchomić projekt.

1. Skopiuj `.env.example` do pliku `.env` i skonfiguruj w nim swoje środowisko.
2. Uruchom:
```
npm i
```
3. Uruchom:
```
npm run dev
```

<br>

### 🗃️ Schemat baz danych

<a href="https://github.com/accodash/cool-chess-frontend/blob/main/database-diagram.jpg" target="_blank"><img src="https://github.com/accodash/cool-chess-frontend/blob/main/database-diagram.jpg" /></a>

#### Backend – PostgreSQL

Backend korzysta z relacyjnej bazy danych PostgreSQL i zarządza wszystkimi danymi użytkowników, meczów, ruchów oraz relacji społecznych. Oto przegląd najważniejszych tabel:

#### 🧑‍💼 `user`
Przechowuje dane każdego użytkownika:
- `uuid` – unikalny identyfikator użytkownika (PK)
- `username`, `image_url`, `created_at`

#### 📊 `rating`
Przechowuje ranking użytkownika dla danego trybu gry:
- `user_uuid` – powiązanie z tabelą `user` (FK)
- `rating`, `mode`

#### 🧩 `match`
Reprezentuje rozegrany mecz:
- `id` – identyfikator meczu (PK)
- `white_uuid`, `black_uuid` – gracze (FK → `user`)
- `start_at`, `end_at`, `is_ranked`, `is_completed`, `winner_uuid`, `mode`

#### ➡️ `move`
Rejestruje ruchy wykonane w ramach meczu:
- `match_id` – powiązanie z tabelą `match` (FK)
- `from`, `to` – pozycje na szachownicy
- `uuid` – kto wykonał ruch (FK → `user`)
- `moved_at`, `time_left`

#### 👥 `friend_relation`
Przechowuje relacje znajomości między użytkownikami:
- `first_uuid`, `second_uuid` – użytkownicy (FK → `user`)
- `created_at`, `befriended_at`

#### 👣 `following`
Rejestruje, kto kogo obserwuje:
- `follower_uuid`, `followed_user_uuid` – użytkownicy (FK → `user`)

<br>

### 🧪 Sprawozdanie z testów
Aby zapewnić wysoką jakość oraz stabilność aplikacji Cool Chess, przeprowadzono kompleksowy proces testowania, obejmujący zarówno testy manualne, jak i automatyczne.

#### ✅ Testy manualne
Aplikacja została dokładnie przetestowana ręcznie – od A do Z – przez użytkownika końcowego. Przetestowano wszystkie kluczowe funkcjonalności, w tym:

- logowanie i rejestrację,
- rozgrywkę online w szachy,
- zarządzanie znajomymi i obserwowanymi graczami,
- przeglądanie historii gier oraz rankingów,
- responsywność interfejsu na różnych urządzeniach i przeglądarkach.

Dzięki temu upewniono się, że każda część aplikacji działa zgodnie z założeniami i zapewnia pozytywne doświadczenie użytkownika.

#### 🧪 Testy jednostkowe
Wszystkie komponenty aplikacji zostały objęte testami jednostkowymi przy użyciu biblioteki Jest. Celem było zapewnienie niezawodności działania aplikacji również od strony kodu.

Osiągnięto 100% pokrycia kodu testami, zarówno jeśli chodzi o linie kodu, jak i gałęzie logiczne. Potwierdzenie tego można znaleźć w wygenerowanym raporcie HTML, który dostępny jest pod ścieżką: `/coverage/lcov-report`

Aby uruchomić testy, wystarczy wykonać następujące polecenie:
```
npx jest
```
Dzięki zastosowaniu takiej strategii testowania aplikacja Cool Chess charakteryzuje się wysoką jakością kodu, niezawodnością oraz gotowością do dalszego rozwoju lub wdrożenia na produkcję.
