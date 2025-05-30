# Cool Chess Backend

> Select a language: [PL](#polish) / [EN](#english)

## English

> Backend is available here: [LINK](https://github.com/accodash/cool-chess-backend)

**Cool Chess** is a chess playing app developed as a school project in ZSK. 

### 🔍 What are the functionalities?

- 🎮 **Play Chess** - Try your skills against others in an online chess match.
- 🏆 **View Rankings** – Check how you stack up against other players.
- 👥 **User List** – Explore profiles of other users in the system.
- ➕ **Manage Friends & Followings** – Follow your favorite players and manage your chess circle.
- 📊 **Analyze Game History** – Revisit your previous matches and analyze your moves.

### 🛠️ Built With

- **NestJS** – Main backend framework used.
- **PostgreSQL** – SQL-based databased used to store data.
- **Redis** – For storing data needed in real time. 
- **Socket.io** – Web sockets that are running during gameplay. 
- **MinIO** – S3 compatible storage for user avatars. 

### 🚀 Setup Instructions

> You need to have docker compose installed on your machine first.

1. Copy `.env.example` to `.env` file and set up your app's environment
2. Run `npm i`
3. Run `npm run dev`

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
<br>

---

<br>
<br>

## Polish

> Backend jest dostępny tutaj: [LINK](https://github.com/accodash/cool-chess-backend)

**Cool Chess** to aplikacja do grania w szachy stworzona jako projekt szkolny w ZSK.

### 🔍 Jakie mamy funkcjonalności?

- 🎮 **Graj w Szachy** - Przetestuj swoje umiejętności mierząc się w innymi w sieciowej partii szachów.
- 🏆 **Przeglądanie Rankingu** – Zobacz swoją pozycję wśród innych graczy.
- 👥 **Lista Użytkowników** – Odkrywaj profile innych graczy.
- ➕ **Zarządzanie Znajomymi i Obserwowanymi** – Twórz swoją szachową społeczność.
- 📊 **Analiza Historii Gier** – Analizuj swoje rozegrane partie i wykonane ruchy.

### 🛠️ Technologie

- **NestJS** – Główny używany framework backendu.
- **PostgreSQL** – Relacyjna baza danych wykorzystywana do przechowywania większości wartości.
- **Redis** – Do przechowywania danych potrzebnych w czasie rzeczywistym. 
- **Socket.io** – Web sockety, które są potrzebne do działania rozgrywki. 
- **MinIO** – Przestrzeń pamięciowa kompatybilna z S3, na której zapisywane są avatary. 

### 🚀 Uruchomienie

> Musisz mieć zainstalowany docker compose na komputerze, aby uruchomić projekt.

1. Skopiuj `.env.example` do pliku `.env` i skonfiguruj w nim swoje środowisko.
2. Uruchom `npm i`
3. Uruchom `npm run dev`

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
