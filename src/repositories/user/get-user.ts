import { QueryResult } from "pg";
import pool from "../../database/connection";
import { IPostgresGetUserRepository } from "../../interfaces/repositories/user";
import { User } from "../../models/schemas";

export class PostgresGetUserRepository implements IPostgresGetUserRepository {
  async getUser(userId: string): Promise<User> {
    const user: QueryResult = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [userId]
    );

    return user.rows[0];
  }
}
