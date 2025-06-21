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
} from './controllers';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/films', filmsRouter);
app.use('/api/shows', showsRouter);
app.use('/api/genres', genresRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.listen(PORT, async () => {
  await initializeDB();
  console.log(`Server running on PORT ${PORT}`);
});
