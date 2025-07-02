import { QueryResult } from "pg";
import { IPostgresGetEventByIdRepository } from "../../interfaces/repositories/event";
import { Event } from "../../models/schemas";
import pool from "../../database/connection";

export class PostgresGetEventByIdRepository
  implements IPostgresGetEventByIdRepository
{
  async getEventById(eventId: string): Promise<Event | null> {
    const result: QueryResult = await pool.query(
      "SELECT * FROM events WHERE id = $1",
      [eventId]
    );
    return result.rows[0] ?? null;
  }
}
