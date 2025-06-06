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

- TypeScript
- Frontend (React + TanStack Query) and Backend (Node.js/Express)
- PostgreSQL databases with Sequelize ORM and migrations
- JWT authentication and session management
- Automated CI/CD pipeline via GitHub Actions
- Bootstrap + Styled Components for design
- TMDB + IGDB API integrations

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
