import pg from "pg";
import { config } from "dotenv";

config();

// no caso só tem uma função de conexão
const pool: pg.Pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

export default pool;
