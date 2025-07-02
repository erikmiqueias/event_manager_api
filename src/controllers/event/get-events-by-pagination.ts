import { IGetEventsByPaginationController } from "../../interfaces/controllers/event";
import { IHttpRequest, IHttpResponse } from "../../interfaces/http";
import { Event } from "../../models/schemas";
import { PostgresGetEventsByPaginationRepository } from "../../repositories/event/get-events";

export class GetEventsByPaginationController
  implements IGetEventsByPaginationController
{
  constructor(
    private readonly postgresGetEventsByPaginationRepository: PostgresGetEventsByPaginationRepository
  ) {}

  async getEventsByPagination(
    httpRequest: IHttpRequest
  ): Promise<IHttpResponse<Event[]>> {
    try {
      const { query } = httpRequest;

      if (!query) {
        return {
          statusCode: 400,
          body: "Missing query or body",
        };
      }

      const allowedFields: string[] = ["limit", "offset", "userId"];

      const invalidFields: boolean = Object.keys(query).some(
        (field) => !allowedFields.includes(field)
      );

      if (invalidFields) {
        return {
          statusCode: 400,
          body: "Invalid fields",
        };
      }

      if (!query.limit || !query.offset || !query.userId) {
        return {
          statusCode: 400,
          body: "Missing limit, offset or userId",
        };
      }

      const { limit, offset, userId } = query;

      const events: Event[] =
        await this.postgresGetEventsByPaginationRepository.getEventsByPagination(
          limit,
          offset,
          userId
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
