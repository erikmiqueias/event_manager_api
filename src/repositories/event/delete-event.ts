import { QueryResult } from "pg";
import pool from "../../database/connection";
import { IPostgresDeleteEventRepository } from "../../interfaces/repositories/event";
import { Event } from "../../models/schemas";

export class PostgresDeleteEventRepository
  implements IPostgresDeleteEventRepository
{
  async deleteEvent(eventId: string): Promise<Event> {
    const result: QueryResult = await pool.query(
      "DELETE FROM events WHERE id = $1 RETURNING *",
      [eventId]
    );
    return result.rows[0];
  }
}
