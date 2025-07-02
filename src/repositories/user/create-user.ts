import { QueryResult } from "pg";
import pool from "../../database/connection";
import { IPostgresCreateUserRepository } from "../../interfaces/repositories/user";
import { User } from "../../models/schemas";

export class PostgresCreateUserRepository
  implements IPostgresCreateUserRepository
{
  async create(createUserParams: Omit<User, "id">): Promise<User> {
    const user: QueryResult = await pool.query(
      "INSERT INTO users (username, email, password, address, bio, company, image_url, job_title, phone_number) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;",
      [
        createUserParams.userName,
        createUserParams.email,
        createUserParams.password,
        createUserParams.address,
        createUserParams.bio,
        createUserParams.company,
        createUserParams.imageUrl,
        createUserParams.jobTitle,
        createUserParams.phoneNumber,
      ]
    ); // vai criar um usuário no banco de dados
    return user.rows[0];
  }
}
