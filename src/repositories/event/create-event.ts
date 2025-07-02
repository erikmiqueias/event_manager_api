import { QueryResult } from "pg";
import pool from "../../database/connection";
import { IPostgresCreateEventRepository } from "../../interfaces/repositories/event";
import { Event } from "../../models/schemas";

export class PostgresCreateEventRepository
  implements IPostgresCreateEventRepository
{
  async createEvent(createEventParams: Omit<Event, "id">): Promise<Event> {
    const event: QueryResult = await pool.query(
      `INSERT INTO events (event_name, event_details, event_date, event_local, duration, event_format, event_publicity, user_id, access_code, price, max_participants, duration_unit, status) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
        RETURNING *;`,
      [
        createEventParams.eventName,
        createEventParams.eventDetails,
        createEventParams.eventDate,
        createEventParams.eventLocal,
        createEventParams.duration,
        createEventParams.eventFormat,
        createEventParams.eventPublicity,
        createEventParams.userId,
        createEventParams.accessCode,
        createEventParams.price,
        createEventParams.maxParticipants,
        createEventParams.durationUnit,
        createEventParams.status,
      ]
    );

    return event.rows[0];
  }
}
