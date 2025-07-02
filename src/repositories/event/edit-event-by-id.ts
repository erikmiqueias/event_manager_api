import { QueryResult } from "pg";
import { IPostgresEditEventRepositoryById } from "../../interfaces/repositories/event";
import { Event } from "../../models/schemas";
import pool from "../../database/connection";

export class PostgresEditEventByIdRepository
  implements IPostgresEditEventRepositoryById
{
  async editEventById(eventId: string, fields: Partial<Event>): Promise<Event> {
    const fieldToColumn = {
      eventName: "event_name",
      eventDetails: "event_details",
      eventDate: "event_date",
      eventLocal: "event_local",
      duration: "duration",
      durationUnit: "duration_unit",
      maxParticipants: "max_participants",
      eventFormat: "event_format",
      eventPublicity: "event_publicity",
      userId: "user_id",
      accessCode: "access_code",
      price: "price",
    };

    const keys = Object.keys(fields) as (keyof Event)[];
    if (keys.length === 0) {
      throw new Error("No fields to update");
    }

    const setClauses = keys.map(
      (key, index) =>
        `${(fieldToColumn as Record<keyof Event, string>)[key]} = $${index + 1}`
    );
    const values = keys.map((key) => fields[key]);
    values.push(eventId);

    const query = `
      UPDATE events
      SET ${setClauses.join(", ")}
      WHERE id = $${values.length}
      RETURNING *;
    `;

    const result: QueryResult = await pool.query(query, values);
    return result.rows[0];
  }
}
