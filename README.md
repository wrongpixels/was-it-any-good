# WIAG <i>("Was It Any Good?")</i>

## About

WIAG is a full-stack rating platform to discover and review movies, TV shows and games. Unlike traditional systems, WIAG uses a dynamic scoring approach that combines overall impressions with individual components (seasons/DLC), calculating a final score that shows how quality varies over time.

For example: Rate The Sopranos an '8' overall but Season 2 a '6' - WIAG considers both for the final score, while ignoring unwatched seasons.

## Features

- **Dynamic Rating System**: Overall scores influence components and vice versa, with weighted calculations and progress tracking
- **Personalized Content**: Rate only what you've watched, exclude seasons, and see quality evolution
- **Social Experience**: Follow friends, post reviews, leave comments, and build your review history
- **Smart Lists**: Create custom lists, "Watch Later" that automatically updates when you rate, see what friends are watching
- **Discovery Tools**: Genre filtering, name search, score sorting, top 10 aggregations across all users
- **Flexible Organization**: Maintain separate or combined lists for movies, TV shows, and games
- **Complete Media Library**: Movies, TV shows and games with comprehensive metadata
- **Full-Stack TypeScript**: React frontend and Node.js backend with Bootstrap styling
- **User Accounts**: Authentication, profiles, friend connections, and content interactions

## Technical Implementation

- TypeScript
- Frontend (React + TanStack Query) and Backend (Node.js/Express)
- PostgreSQL databases with Sequelize ORM and migrations
- JWT authentication and session management
- Automated CI/CD pipeline via GitHub Actions
- Bootstrap + Styled Components for design
- TMDB and IGDB API integrations

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
