import { IGetUserController } from "../../interfaces/controllers/user";
import { IHttpRequest, IHttpResponse } from "../../interfaces/http";
import { User } from "../../models/schemas";
import { PostgresGetUserRepository } from "../../repositories/user/get-user";
import { isUUID } from "validator";
export class GetUserController implements IGetUserController {
  constructor(
    private readonly postgresGetUserRepository: PostgresGetUserRepository
  ) {}

  async getUser(httpRequest: IHttpRequest): Promise<IHttpResponse<User>> {
    try {
      const { params } = httpRequest;

      if (!isUUID(params.id)) {
        return {
          statusCode: 400,
          body: "Invalid params or user not found",
        };
      }

      if (!params) {
        return {
          statusCode: 400,
          body: "Missing params",
        };
      }
      const user: User = await this.postgresGetUserRepository.getUser(
        params.id
      );

      if (!user) {
        return {
          statusCode: 404,
          body: "User not found",
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
