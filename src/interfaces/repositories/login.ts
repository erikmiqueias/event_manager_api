import { User } from "../../models/schemas";

export interface IPostgresGetUserByEmailRepository {
  findUserByEmail(email: string): Promise<User | null>;
}
