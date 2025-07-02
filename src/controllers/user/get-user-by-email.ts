import { IGetUserByEmailController } from "../../interfaces/controllers/user";
import { IHttpRequest, IHttpResponse } from "../../interfaces/http";
import { User } from "../../models/schemas";
import { PostgresGetUserRepository } from "../../repositories/user/get-user";
import { PostgresGetUserByEmailRepository } from "../../repositories/user/get-user-by-email";

export class GetUserByEmailController implements IGetUserByEmailController {
  constructor(
    private readonly getUserByEmailRepository: PostgresGetUserByEmailRepository
  ) {}

  async getUserByEmail(
    httpRequest: IHttpRequest
  ): Promise<IHttpResponse<User>> {
    try {
      const { body } = httpRequest;

      if (!body || !body.email || !body.password) {
        return {
          statusCode: 400,
          body: "Missing email or password",
        };
      }

      const user: User | null =
        await this.getUserByEmailRepository.findUserByEmail(body.email);

      if (!user) {
        return {
          statusCode: 401,
          body: "Invalid email or password or user not found",
        };
      }

      if (user.password !== body.password) {
        return {
          statusCode: 401,
          body: "Invalid password",
        };
      }

      return {
        statusCode: 200,
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
