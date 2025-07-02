import { QueryResult } from "pg";
import pool from "../../database/connection";
import { IPostgresGetEventByEventIdAndUserIdRepository } from "../../interfaces/repositories/event";
import { Event } from "../../models/schemas";

export class PostgresGetEventByEventIdAndUserIdRepository
  implements IPostgresGetEventByEventIdAndUserIdRepository
{
  async getEventByEventIdAndUserId(
    eventId: string,
    userId: string
  ): Promise<Event | null> {
    const result: QueryResult = await pool.query(
      "SELECT * FROM events WHERE id = $1 AND user_id = $2",
      [eventId, userId]
    );
    return result.rows[0] ?? null;
  }
}
