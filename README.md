# WIAG ("Was It Any Good?")

## About

WIAG is a full-stack media rating platform built to address a common flaw in traditional review systems. It uses a dynamic scoring approach that combines a user's overall impression with their ratings of individual components (like seasons or DLC). The result is a more nuanced final score that accurately reflects how a piece of media's quality evolves over time.

For example: A user can rate *The Sopranos* an '8' overall but give its second season a '6'. WIAG's algorithm considers both votes to calculate the final score, ignoring unwatched seasons.

---

## Features & Development Status

The project is currently live with its core feature set, while social and community-oriented features are in active development.

### ✅ Implemented & Live

*   **On-Demand Data Architecture:**
    *   **Efficient Search:** Typeahead suggestions are generated from media previously searched by other users, significantly reducing external API calls.
    *   **Live Entry Creation:** When a user selects a search result or provides a TMDB ID, the system fetches the data from the external API and transforms it into WIAG's own database structure on-the-fly. If the entry already exists, it is simply retrieved.
    *   **Relational Data Growth:** When new media is added, all associated people also get created (or retrieved if already existing), and get linked with their specific roles. This allows the database to grow an interconnected network of media and talent organically.
*   **Media Discovery:**
    *   **Browse:** Explore the existing database with shortcuts for Popular and Top-rated Films, Shows, and overall media.
    *   **Filter & Sort:** Filter media by Genre, Country, or Year, and sort results by Ranking, Popularity, Title or Release date.
*   **Dynamic Rating System:** Users can create accounts and submit weighted ratings for Films, Shows and their individual seasons. All rating calculations happen in real-time and update instantly on the front end without a page refresh.
*   **User Authentication:** Secure user registration, login, and session management using JSON Web Tokens (JWT).

### ⏳ In Development / Planned

*   🎮 **Game Integration:** Adding IGDB API support to expand the library to video games and DLCs.
*   👥 **Social Features:** Friend-following system and personalized activity feeds.
*   📝 **Community Engagement:** Written reviews and comment sections.
*   📋 **Collections:** Custom user-created lists and auto-updating watchlists.

---

## Technical Architecture

WIAG is more than a simple API client, it's an independent platform engineered for scalability and data integrity. The architecture was a primary focus of the project.

1.  **Data Independence:** External APIs like TMDB are treated strictly as initial data sources. All information is transformed and stored in custom-designed, normalized data models. The platform is not dependent on the structure of any external API. Once a Film, Show or Person has been created, it becomes 100% independent of external APIs.

2.  **Performance Optimization:** WIAG stores brief versions of all media returned from external API searches. This allows for instantaneous typeahead suggestions for subsequent users, minimizing latency and external API rate-limiting concerns.

3.  **Self-Sustaining Ecosystem:** The database grows organically based on user activity. Media, People and their relationships are populated on-demand, ensuring the database remains lean and relevant without requiring bulk data imports. This creates a robust, interconnected graph of information entirely within WIAG's ecosystem.

### Tech Stack

*   **Backend:** Node.js, Express, TypeScript
*   **Frontend:** React, TypeScript, TanStack Query
*   **Database:** PostgreSQL with Sequelize ORM
*   **Styling:** Tailwind CSS
*   **Authentication:** JWT (Session Management)
*   **DevOps:** GitHub Actions for CI/CD

---

## Local Development

```bash
# Clone the repository
git clone https://github.com/wrongpixels/was-it-any-good.git

# Install dependencies
cd was-it-any-good
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm run dev
```

License
MIT

---

Currently under active development.
