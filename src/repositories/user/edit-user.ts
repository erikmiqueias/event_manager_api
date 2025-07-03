import { QueryResult } from "pg";
import { IPostgresEditUserByIdRepository } from "../../interfaces/repositories/user";
import { User } from "../../models/schemas";
import pool from "../../database/connection";

export class PostgresEditUserByIdRepository
  implements IPostgresEditUserByIdRepository
{
  async editUserById(userId: string, fields: Partial<User>): Promise<User> {
    const fieldToColumn = {
      userName: "user_name",
      email: "email",
      password: "password",
      address: "address",
      bio: "bio",
      company: "company",
      imageUrl: "image_url",
      jobTitle: "job_title",
      phoneNumber: "phone_number",
    };

    const keys = Object.keys(fields) as (keyof User)[];
    if (keys.length === 0) {
      throw new Error("No fields to update");
    }

    const setClauses = keys.map(
      (key, index) =>
        `${(fieldToColumn as Record<keyof User, string>)[key]} = $${index + 1}`
    );
    const values = keys.map((key) => (fields as User)[key]);
    values.push(userId);

    const query = `
      UPDATE users
      SET ${setClauses.join(", ")}
      WHERE id = $${values.length}
      RETURNING *;
    `;

    const result: QueryResult = await pool.query(query, values);
    return result.rows[0];
  }
}
