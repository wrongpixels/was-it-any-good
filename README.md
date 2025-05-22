## WIAG <i>("Was It Any Good?")</i>

<div align="center">
  <p><h2>"Score a good one"</h2>
  Will eventually have a live demo at: <a href="https://wiag.io">wiag.io</a></p>
</div>

## About

WIAG is a full-stack entertainment rating platform that helps users discover and review movies, TV shows, and games. It features a unique rating system to show how TV shows evolve across seasons and how games expand through DLC.

### Key Features (Coming Soon)

#### Content

- 🎬 Movies and TV shows (powered by TMDB)
- 🎮 Games and DLC content
- 🔍 Advanced search and filtering
- 📱 Responsive design

#### Smart Rating System

- 📊 Overall ratings that cascade to seasons/DLC
- 🎯 Individual season/DLC rating overrides
- 📈 Rating progression visualization
- ⭐ Detailed review system

#### User Features

- 👥 User authentication
- 📝 Personalized review history
- 👑 Admin dashboard

### Tech Stack

- **Frontend:** React, TanStack Query, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** PostgreSQL with Sequelize
- **Authentication:** JWT with session management
- **APIs:** TMDB, IGDB

## Rating System

WIAG features a unique approach to ratings:

- TV Shows can be rated as a whole or season by season
- Overall show ratings cascade to individual seasons
- Users can override specific season ratings
- Same system applies to games and their DLC
- Weighted averages consider both overall and specific ratings

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
