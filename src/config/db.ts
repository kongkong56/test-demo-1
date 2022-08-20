import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const {
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_PORT,
  POSTGRES_USER_DEV,
  POSTGRES_PASSWORD_DEV,
  ENV
} = process.env;

let client: Pool = new Pool();
console.log('current env mode', ENV);

console.log(
  `database.ts: Accessing ${POSTGRES_DB} database for client connection`
);
client = new Pool({
  port: POSTGRES_PORT,
  host: POSTGRES_HOST,
  database: POSTGRES_DB,
  user: POSTGRES_USER_DEV,
  password: POSTGRES_PASSWORD_DEV
});

export default client;
