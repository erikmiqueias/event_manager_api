import { QueryResult } from "pg";
import { IPostgresGetEventIdByAccessCodeRepository } from "../../interfaces/repositories/event";
import pool from "../../database/connection";

export class PostgresGetEventIdByAccessCodeRepository
  implements IPostgresGetEventIdByAccessCodeRepository
{
  async getEventId(accessCode: string): Promise<string | null> {
    const result: QueryResult = await pool.query(
      "SELECT id FROM events WHERE access_code = $1",
      [accessCode]
    );
    return result.rows[0]?.id ?? null;
  }
}
