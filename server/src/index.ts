import express from 'express';
import cors from 'cors';
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
} from './controllers';
import errorHandler from './middleware/error-handler';
import { authHandler } from './middleware/auth-handler';

const app = express();
app.use(cors());
app.use(express.json());
app.use(authHandler);
app.use('/api/films', filmsRouter);
app.use('/api/shows', showsRouter);
app.use('/api/genres', genresRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth/login', loginRouter);
app.use('/api/auth/logout', logoutRouter);
app.use('/api/auth/sessions', sessionsRouter);
app.use('/api/ratings', ratingsRouter);
app.use('/api/people', peopleRouter);
app.use('/api/media-index', mediaIndexRouter);
app.use('/api/suggest', suggestionsRouter);

app.use(errorHandler);

app.listen(PORT, async () => {
  await initializeDB();
  console.log(`Server running on PORT ${PORT}`);
});
