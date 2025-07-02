import { User } from "../../models/schemas";

export interface IPostgresCreateUserRepository {
  create(createUserParams: Omit<User, "id">): Promise<User>;
}

export interface IPostgresGetUserRepository {
  getUser(userId: string): Promise<User>;
}

export interface IPostgresEditUserByIdRepository {
  editUserById(userId: string, fields: Partial<User>): Promise<User>;
}

export interface IUploadFileIntoCloudinary {
  upload(file: Express.Multer.File): Promise<string>;
}
