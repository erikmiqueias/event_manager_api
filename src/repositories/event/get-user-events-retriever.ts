import { QueryResult } from "pg";
import pool from "../../database/connection";
import { IPostgresUserEventsRetrieverRepository } from "../../interfaces/repositories/event";
import { Event } from "../../models/schemas";

export class PostgresUserEventsRetrieverRepository
  implements IPostgresUserEventsRetrieverRepository
{
  async getUserEvents(userId: string): Promise<Event[]> {
    const events: QueryResult = await pool.query(
      `
        SELECT e.*
            FROM events e
            INNER JOIN events_attendees ea ON e.id = ea.event_id
            WHERE ea.user_id = $1;
        `,
      [userId]
    );

    return events.rows;
  }
}
