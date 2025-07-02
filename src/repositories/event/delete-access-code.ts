import pool from "../../database/connection";
import { IPostgresDeleteAccessCodeRepository } from "../../interfaces/repositories/event";

export class PostgresDeleteAccessCodeRepository
  implements IPostgresDeleteAccessCodeRepository
{
  async deleteAccessCode(eventId: string): Promise<void> {
    await pool.query("UPDATE events SET access_code = NULL WHERE id = $1", [
      eventId,
    ]);
  }
}
