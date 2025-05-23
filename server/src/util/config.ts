import dotenv from 'dotenv';
dotenv.config();

const POSTGRES_URI: string = process.env.POSTGRES_URI as string;
const PORT = parseInt(process.env.PORT || '6060', 10);

if (!POSTGRES_URI) {
  throw new Error('Missing POSTGRES_URI');
}
if (isNaN(PORT)) {
  throw new Error('PORT must be a number.');
}

export { POSTGRES_URI, PORT };
