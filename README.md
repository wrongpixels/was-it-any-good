# WIAG ("Was It Any Good?")

Currently deployed at:

- [wiag.io](https://wiag.io)

## About

WIAG is a full-stack media rating platform that uses a dynamic scoring approach to combine overall user impressions with their ratings of individual components _(like seasons or DLC)_. The result is a more nuanced average score that better reflects user engagement and how a piece of media's quality evolves over time.

<p align="center">
  <img src="https://github.com/user-attachments/assets/d0a5de83-61ae-4e99-8e9f-cbb81ec5dee5" alt="image" height="600">
</p>

**For example:**
In WIAG, you can rate _Futurama_ an '_8_' overall, but then give _Season 1_ a '_9_', _Season 2_ a '_10_', _Season 3_ a '_6_'... and leave the rest unvoted. WIAG's algorithm will consider all these votes for the final score, ignoring the unvoted Seasons.

### Why I'm Building This

The idea stemmed from frustration with other rating platforms, which either combined Shows into a single blob independently of its Seasons _(IMDB)_, or outright listed each Season seaparately, making it hard to tell a "general consensus" on a Show as a whole _(Metacritic/FilmAffinity)_. With WIAG, the goal was to offer a place where a Show and its Seasons could be checked and voted at once, and where they all worked together to build a more accurate final score from and for its users.

---

## Features & Development Status

The project is currently [live](https://wiag.io) with its core feature set, while social and community-oriented features are in active development.

### ✅ Implemented & Live

- **On-Demand Data Architecture:**
  - **Live Entry Creation:** When a user selects a search result or provides a TMDB ID, the system fetches the data from the external API and transforms it into WIAG's own database structure on-the-fly. If the entry already exists, it is simply retrieved.
  - **Relational Data Growth:** When new media is added, all associated people also get created (or retrieved if already existing), and get linked with their specific roles. This allows the database to grow an interconnected network of media and talent organically.
  - **Efficient Search:** Typeahead suggestions are generated from media previously searched by other users, significantly reducing external API calls.
- **Media Discovery:**
  - **Search:** Search on TMDB's database to add to WIAG any Film or Show by just clicking on it.
  - **Browse:** Explore the existing database with shortcuts for Popular and Top-rated Films, Shows, and overall media.
  - **Filter & Sort:** Filter media by Genre, Country, or Year, and sort results by Ranking, Popularity, Title or Release date.
- **Dynamic Rating System:** Users can create accounts and submit weighted ratings for Films, Shows and their individual seasons. All rating calculations happen in real-time and update instantly on the front end without a page refresh.
- **User Authentication:** Secure user registration, login, and session management using JSON Web Tokens (JWT).

### ⏳ In Development / Planned

- 🎮 **Game Integration:** Adding IGDB API support to expand the library to video games and DLCs.
- 👥 **Social Features:** Friend-following system and personalized activity feeds.
- 📝 **Community Engagement:** Written reviews and comment sections.
- 📋 **Collections:** Custom user-created lists and auto-updating watchlists.

---

## Technical Architecture

**WIAG is not an API client**, but an independent platform engineered for scalability and data integrity. The data architecture was a primary focus of the project.

1.  **Data Independence:** External APIs like TMDB are treated **only** as initial data sources. All information is transformed and stored in custom-designed, normalized data models. The platform is not dependent on the structure of any external API. Once a Film, Show, Season or Person has been created, it becomes 100% independent of external APIs.

2.  **Performance Optimization:** WIAG stores brief versions of all media returned from external API searches, allowing for instantaneous typeahead suggestions for subsequent users, minimizing latency and external API rate-limiting concerns. The server also employs Redis for caching ranked lists and media data separately, minimizing database hits while guaranteeing data freshness with event-driven invalidation.

3.  **Self-Sustaining Ecosystem:** The database grows organically based on user activity. Media, People and their relationships are populated on-demand, ensuring the database remains lean and relevant without requiring bulk data imports. This creates a robust, interconnected graph of information entirely within WIAG's ecosystem.

4.  **Pull‑on‑demand Media Refresh System:** To ensure Shows stay updated as new seasons are released, WIAG automatically refreshes their data whenever a user accesses them and enough time has passed since the last update. A single API call then checks for new seasons or episodes, updating WIAG's database with any new information. _(Films follow a similar process, but at a much lower frequency!)_

Together, these systems keep the database maintained and up‑to‑date while focusing on the media users actively engage with, significantly reducing background maintenance overhead and API load compared to traditional scheduled jobs.

### Tech Stack

- **Backend:** Node.js, Express, TypeScript, Redis
- **Frontend:** React, TypeScript, TanStack Query
- **Database:** PostgreSQL with Sequelize ORM, Umzug for Migrations
- **Styling:** Tailwind CSS
- **Authentication:** JWT (Session Management)
- **Testing:** Vitest and Supertest (Unit), Playwright (End-to-end)
- **DevOps:** Containerized with Docker and deployed on Railway via a Continuous Deployment (CD) pipeline integrated with GitHub.

---

## Local Installation

To run the project locally, you will need **npm**, a running **PostgreSQL** database, and a free **TMDB API Token** _(read [here](https://developer.themoviedb.org/docs/getting-started) how to get one!)_

```bash
# First, clone the repository
git clone https://github.com/wrongpixels/was-it-any-good.git

# Install dependencies
cd was-it-any-good
npm install

# And run this command:
node scripts/setup-env.js
```

### Environment Variables

Before running the project for the first time, you will need to provide your **environment variables**.
The previous command has created a '**.env**' file at '**was-it-any-good/server**'

Open it, and edit it providing your own:

- **API_SECRET**
  - A random, private string that will be used for encrypting data (passwords, etc).
- **POSTGRES_URI**
  - The connection URI for your PostgreSQL database.
- **API_TOKEN_TMDB**
  - Your own TMDB API Token _(read [here](https://developer.themoviedb.org/docs/getting-started) how to get one!)_.
- **PORT** _(Optional!)_
  - The Port the WIAG server will be running on. It defaults to 6060 if not set.
- **REDIS_URI** _(Optional!)_
  - The connection URI for your Redis server, in case you want to use it (WIAG can work without it.)

Example of a valid .env file:

```bash
API_SECRET=quite-a-long-random-string
POSTGRES_URI=postgresql://user:pass@host:port/database
API_TOKEN_TMDB=eyJhbGciOijrjer84040344rfEDdD...
PORT=6060
```

Once that's done, you can run the project.

### Running WIAG

- **For Development:**

```bash
# Run
npm run dev

# By default, the client will run on:
http://localhost:5173/

# And the server on the PORT your provided
http://localhost:6060/
```

- **For a Local Production Build:**

```bash
# Build the project with
npm run build

# Then run it with
npm run start

# And the project will run on the PORT you provided before.
http://localhost:6060/
```

---

## Security Notes

Basic measures to keep things secure:

- Input validation and sanitization on all endpoints.
- Parameterized queries to prevent SQL injection.
- Secure password hashing with bcrypt.
- Rate limiting on sensitive routes.
- Same-origin deployment: frontend and API are served from the same origin in production. If future use-cases required it, CORS will be enabled for specific trusted origins.

## Contributing

This started as a solo portfolio project, but if you spot bugs or have ideas _(especially for the planned features)_, please open an issue or PR. I'm open to collaboration as I continue building it out.

## License

MIT

---

Currently under active development.
