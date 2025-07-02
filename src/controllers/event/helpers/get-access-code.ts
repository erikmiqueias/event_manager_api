import { QueryResult } from "pg";
import pool from "../../../database/connection";

interface EventAccessInfo {
  access_code: string;
  event_publicity: "PUBLIC" | "PRIVATE";
}

export class EventAccessValidator {
  static async isAccessCodeValid(
    eventId: string,
    providedAccessCode?: string
  ): Promise<boolean> {
    const result: QueryResult = await pool.query<EventAccessInfo>(
      "SELECT access_code, event_publicity FROM events WHERE id = $1",
      [eventId]
    );

    const event: EventAccessInfo = result.rows[0];

    if (!event) {
      throw new Error("Event not found");
    }

    if (event.event_publicity === "PUBLIC") {
      return true;
    }

    if (!providedAccessCode) {
      return false; // código é obrigatório para eventos privados
    }

    return event.access_code === providedAccessCode;
  }
}
