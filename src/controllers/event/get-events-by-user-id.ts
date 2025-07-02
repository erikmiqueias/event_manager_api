import { isUUID } from "validator";
import { IGetEventsByUserIdController } from "../../interfaces/controllers/event";
import { IHttpRequest, IHttpResponse } from "../../interfaces/http";
import { IPostgresGetEventsByUserIdRepository } from "../../interfaces/repositories/event";
import { Event } from "../../models/schemas";

export class GetEventsByUserIdController
  implements IGetEventsByUserIdController
{
  constructor(
    private readonly postgresGetEventsByUserIdRepository: IPostgresGetEventsByUserIdRepository
  ) {}

  async getEventsByUserId(
    httpRequest: IHttpRequest
  ): Promise<IHttpResponse<Event[]>> {
    try {
      const { params } = httpRequest;

      if (!params) {
        return {
          statusCode: 400,
          body: "Missing params",
        };
      }

      if (!isUUID(params.userId)) {
        return {
          statusCode: 400,
          body: "Invalid params or user not found",
        };
      }

      const events: Event[] =
        await this.postgresGetEventsByUserIdRepository.getEventByUserId(
          params.userId
        );

      return {
        statusCode: 200,
        body: events,
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: `Something went wrong: ${err}`,
      };
    }
  }
}
