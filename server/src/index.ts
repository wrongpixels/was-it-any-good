import express from 'express';
import cors from 'cors';
import path from 'path';
import { PORT } from './util/config';
import { initializeDB } from './util/db';
import {
  filmsRouter,
  genresRouter,
  showsRouter,
  usersRouter,
  loginRouter,
  logoutRouter,
  sessionsRouter,
  ratingsRouter,
  peopleRouter,
  mediaIndexRouter,
  suggestionsRouter,
  searchRouter,
  browseRouter,
  trendingRouter,
} from './controllers';
import errorHandler from './middleware/error-handler';
import { authHandler } from './middleware/auth-handler';
import { NotFoundError } from './util/customError';

const app = express();
app.use(cors());
app.use(express.json());
app.use(authHandler);

//API Routes
app.use('/api/films', filmsRouter);
app.use('/api/shows', showsRouter);
app.use('/api/genres', genresRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth/login', loginRouter);
app.use('/api/auth/logout', logoutRouter);
app.use('/api/auth/sessions', sessionsRouter);
app.use('/api/ratings', ratingsRouter);
app.use('/api/people', peopleRouter);
app.use('/api/index-media', mediaIndexRouter);
app.use('/api/suggest', suggestionsRouter);
app.use('/api/search', searchRouter);
app.use('/api/trending', trendingRouter);
app.use('/api/browse', browseRouter);

app.all('/api/*rest', (_req, _res, next) => {
  next(new NotFoundError('API endpoint'));
});

if (process.env.NODE_ENV === 'production') {
  const distPath: string = path.join(__dirname, '..', '..', 'client', 'dist');
  app.use(express.static(distPath));
  app.get('/*rest', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.use((_req, _res, next) => {
  next(new NotFoundError());
});

app.use(errorHandler);

app.listen(PORT, async () => {
  await initializeDB();
  console.log(`Server running on PORT ${PORT}`);
});
