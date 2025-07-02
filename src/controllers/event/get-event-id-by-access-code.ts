import { IGetEventIdByAccessCodeController } from "../../interfaces/controllers/event";
import { IHttpRequest, IHttpResponse } from "../../interfaces/http";
import { Event } from "../../models/schemas";
import { PostgresGetEventIdByAccessCodeRepository } from "../../repositories/event/get-event-id-by-access-code";

export class GetEventIdByAccessCodeController
  implements IGetEventIdByAccessCodeController
{
  constructor(
    private readonly postgresGetEventIdByAccessCodeRepository: PostgresGetEventIdByAccessCodeRepository
  ) {}
  async getEventById(httpRequest: IHttpRequest): Promise<IHttpResponse<Event>> {
    try {
      const { params } = httpRequest;

      if (!params) {
        return {
          statusCode: 400,
          body: "Missing params",
        };
      }

      if (!params.accessCode) {
        return {
          statusCode: 400,
          body: "Missing accessCode",
        };
      }

      const eventId: string | null =
        await this.postgresGetEventIdByAccessCodeRepository.getEventId(
          params.accessCode
        );

      if (!eventId) {
        return {
          statusCode: 404,
          body: "Event not found",
        };
      }

      return {
        statusCode: 200,
        body: eventId,
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: `Something went wrong: ${err}`,
      };
    }
  }
}
