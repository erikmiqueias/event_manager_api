import pg from "pg";
import { config } from "dotenv";

config();

// no caso só tem uma função de conexão
const pool: pg.Pool = new pg.Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  port: +process.env.POSTGRES_PORT!,
  database: process.env.POSTGRES_DB,
});

export default pool;
