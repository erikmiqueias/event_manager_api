import { QueryResult } from "pg";
import pool from "../../database/connection";
import { IPostgresGetEventsByUserIdRepository } from "../../interfaces/repositories/event";
import { Event } from "../../models/schemas";

export class PostgresGetEventsByUserIdRepository
  implements IPostgresGetEventsByUserIdRepository
{
  async getEventByUserId(userId: string): Promise<Event[]> {
    const events: QueryResult = await pool.query(
      "SELECT * FROM events WHERE user_id = $1",
      [userId]
    );

    return events.rows;
  }
}
