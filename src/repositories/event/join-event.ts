import { QueryResult } from "pg";
import pool from "../../database/connection";
import { IPostgresJoinEventRepository } from "../../interfaces/repositories/event";

export class PostgresJoinEventRepository
  implements IPostgresJoinEventRepository
{
  async joinEvent(
    eventId: string,
    userId: string,
    email: string,
    fullName: string,
    phoneNumber: string,
    agreedToTerms: boolean
  ): Promise<void> {
    await pool.query(
      "INSERT INTO events_attendees (user_id, event_id, email, full_name, phone_number, agreed_to_terms) VALUES ($1, $2, $3, $4, $5, $6)",
      [userId, eventId, email, fullName, phoneNumber, agreedToTerms]
    );

    return;
  }

  async checkIfUserJoinedEvent(
    eventId: string,
    userId: string
  ): Promise<boolean> {
    const result: QueryResult = await pool.query(
      "SELECT * FROM events_attendees WHERE event_id = $1 AND user_id = $2",
      [eventId, userId]
    );
    return result.rows.length > 0;
  }
}
