import { isUUID } from "validator";
import { IDeleteEventController } from "../../interfaces/controllers/event";
import { IHttpRequest, IHttpResponse } from "../../interfaces/http";
import { Event } from "../../models/schemas";
import { PostgresDeleteEventRepository } from "../../repositories/event/delete-event";
import { PostgresGetEventByEventIdAndUserIdRepository } from "../../repositories/event/get-event-by-event-id-and-user-id";

export class DeleteEventController implements IDeleteEventController {
  constructor(
    private readonly postgresDeleteEventRepository: PostgresDeleteEventRepository,
    private readonly postgresGetEventByEventIdAndUserIdRepository: PostgresGetEventByEventIdAndUserIdRepository
  ) {}

  async deleteEvent(httpRequest: IHttpRequest): Promise<IHttpResponse<Event>> {
    try {
      const { params, body } = httpRequest;

      if (!params?.eventId || !body?.userId) {
        return {
          statusCode: 400,
          body: "Missing eventId or userId",
        };
      }

      if (!isUUID(params.eventId)) {
        return {
          statusCode: 400,
          body: "Invalid params or event not found",
        };
      }

      const eventExists: Event | null =
        await this.postgresGetEventByEventIdAndUserIdRepository.getEventByEventIdAndUserId(
          params.eventId,
          body.userId
        );

      if (!eventExists) {
        return {
          statusCode: 404,
          body: "Event not found",
        };
      }

      const event: Event = await this.postgresDeleteEventRepository.deleteEvent(
        params.eventId
      );

      return {
        statusCode: 200,
        body: event,
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: `Something went wrong: ${err}`,
      };
    }
  }
}
