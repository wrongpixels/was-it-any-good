# WIAG <i>("Was It Any Good?")</i>

## About 

WIAG is a full-stack rating platform to discover and review movies, TV shows and games. Unlike traditional systems, WIAG uses a dynamic scoring approach that combines overall impressions with individual components (seasons/DLC), calculating a final score that shows how quality varies over time.

For example: Rate The Sopranos an '8' overall but Season 2 a '6' - WIAG considers both for the final score, while ignoring unwatched seasons.

## Features

- 🎯 **Dynamic Ratings** - Score entire series and individual seasons/DLC with weighted calculations
- 👤 **Users** - Accounts, friend following, and activity feeds
- 📝 **Reviews & Comments** - Share detailed opinions and discuss with others
- 🎬 **Media Library** - Comprehensive database of movies, TV shows, and games
- 🔍 **Discovery** - Genre filters, search, and community-driven top charts
- 📋 **Lists** - Auto-updating watchlists and custom collections
- 🔄 **API Integration** - Real-time data from TMDB and IGDB

## Technical Implementation

- **Backend:** Node.js, Express, TypeScript
- **Frontend:** React, TanStack Query, TypeScript
- **Database:** PostgreSQL with Sequelize ORM
- **Authentication:** JWT for session management
- **DevOps:** Automated CI/CD with GitHub Actions
- **Styling:** Bootstrap and Styled Components

### Data Architecture

The project is built around a dynamic, self-populating database shared between Films, Shows and Games. Rather than copying or mirroring external databases, TMDB and IGDB are used as the original information source.

- **On-Demand Data Handling:** When a user searches for media not present in WIAG's database, the system fetches the data from the appropriate external API in real-time.
- **Smart Data Processing:** The incoming data is converted to match WIAG's database structure. People appearing across different media are automatically linked together, creating a connected network of cast, crew and their work.
- **Efficient and Independent:** Once media is added to WIAG, it becomes fully independent from external sources. The database grows organically based on user interests, while maintaining consistent relationships between all entries.

## Development

```bash
# Clone the repository
git clone https://github.com/wrongpixels/wiag.git

# Install dependencies
cd wiag
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm run dev
```

License
MIT

---

Currently under active development
