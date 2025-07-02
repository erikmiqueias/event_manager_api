import { ICreateUserController } from "../../interfaces/controllers/user";
import { IHttpRequest, IHttpResponse } from "../../interfaces/http";
import { User } from "../../models/schemas";
import { PostgresCreateUserRepository } from "../../repositories/user/create-user";

export class CreateUserController implements ICreateUserController {
  constructor(
    private readonly postgresCreateUserRepository: PostgresCreateUserRepository
  ) {}
  async create(httpRequest: IHttpRequest): Promise<IHttpResponse<User>> {
    try {
      const { body } = httpRequest;

      if (!body) {
        return {
          statusCode: 400,
          body: "Missing params",
        };
      }

      const allowedFields: (keyof User)[] = [
        "userName",
        "email",
        "password",
        "imageUrl",
        "jobTitle",
        "company",
        "bio",
        "phoneNumber",
        "address",
      ];
      const invalidFields: boolean = Object.keys(body).some(
        (field) => !allowedFields.includes(field as keyof User)
      );

      if (invalidFields) {
        return {
          statusCode: 400,
          body: "Invalid fields",
        };
      }

      const user: User = await this.postgresCreateUserRepository.create(body);
      return {
        statusCode: 201,
        body: user,
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: `Something went wrong: ${err}`,
      };
    }
  }
}
