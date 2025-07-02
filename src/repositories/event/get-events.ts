import { QueryResult } from "pg";
import pool from "../../database/connection";
import { IPostgresGetEventsByPaginationRepository } from "../../interfaces/repositories/event";
import { Event } from "../../models/schemas";

export class PostgresGetEventsByPaginationRepository
  implements IPostgresGetEventsByPaginationRepository
{
  async getEventsByPagination(
    limit: number,
    offset: number,
    userId: string
  ): Promise<Event[]> {
    const events: QueryResult = await pool.query(
      "SELECT * FROM events WHERE user_id NOT IN ($1) ORDER BY created_at DESC LIMIT $2 OFFSET $3",
      [userId, limit, offset]
    );
    return events.rows;
  }
}
