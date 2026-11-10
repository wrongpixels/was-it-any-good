const fs = require('fs');
const path = require('path');

//tsc does not emit the CA. The image then copies dist/server/src onto
// /app/server/src, so the cert has to land beside the compiled db module.
const source = path.join(__dirname, '..', 'certs', 'ca.crt');
const destination = path.join(
  __dirname,
  '..',
  'dist',
  'server',
  'src',
  'util',
  'db',
  'ca.crt'
);

if (!fs.existsSync(source)) {
  console.error(`Postgres CA not found at ${source}`);
  process.exit(1);
}

fs.mkdirSync(path.dirname(destination), { recursive: true });
fs.copyFileSync(source, destination);
