import { QueryResult } from "pg";
import pool from "../../database/connection";
import { IPostgresGetUserByEmailRepository } from "../../interfaces/repositories/login";
import { User } from "../../models/schemas";

export class PostgresGetUserByEmailRepository
  implements IPostgresGetUserByEmailRepository
{
  async findUserByEmail(email: string): Promise<User | null> {
    const user: QueryResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    return user.rows[0] ?? null;
  }
}
