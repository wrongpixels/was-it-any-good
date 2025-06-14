import express from 'express';
import { PORT } from './util/config';
import { initializeDB } from './util/db';
import { filmsRouter, genresRouter, showsRouter } from './controllers';

const app = express();

app.use(express.json());
app.use('/api/films', filmsRouter);
app.use('/api/shows', showsRouter);
app.use('/api/genres', genresRouter);

app.listen(PORT, async () => {
  await initializeDB();
  console.log(`Server running on PORT ${PORT}`);
});
