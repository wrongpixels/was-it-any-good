import express from 'express';
import { PORT } from './util/config';
import db from './util/db';
const app = express();

app.listen(PORT, async () => {
  await db.initializeDB();
  console.log(`Server running on PORT ${PORT}`);
});
