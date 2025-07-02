import { customAlphabet } from "nanoid";
import { ICreateEventController } from "../../interfaces/controllers/event";
import { IHttpRequest, IHttpResponse } from "../../interfaces/http";
import { Event, User } from "../../models/schemas";
import { PostgresCreateEventRepository } from "../../repositories/event/create-event";
import { PostgresGetUserRepository } from "../../repositories/user/get-user";
import { convertToMinutes } from "./helpers/modify-duration";
import { generateCode } from "./helpers/create-access-code";

export class CreateEventController implements ICreateEventController {
  constructor(
    private readonly postgresCreateEventRepository: PostgresCreateEventRepository,
    private readonly postgresGetUserRepository: PostgresGetUserRepository
  ) {}
  async createEvent(httpRequest: IHttpRequest): Promise<IHttpResponse<Event>> {
    try {
      const { body } = httpRequest;

      if (!body) {
        // mesma coisa no evento, caso o body seja vazio
        return {
          statusCode: 400,
          body: "Missing params",
        };
      }

      const user: User = await this.postgresGetUserRepository.getUser(
        body.userId
      );

      if (!user) {
        return {
          statusCode: 404,
          body: "User not found",
        };
      }

      const allowedFields: string[] = [
        "eventName",
        "eventDetails",
        "eventDate",
        "eventLocal",
        "duration",
        "eventFormat",
        "eventPublicity",
        "userId",
        "accessCode",
        "price",
        "maxParticipants",
        "durationUnit",
        "status",
      ];

      const allowedEventTypes: string[] = ["PRESENCIAL", "REMOTE"];
      const allowedEventPublicity: string[] = ["PUBLIC", "PRIVATE"];

      if (
        !allowedEventTypes.includes(body.eventFormat) ||
        !allowedEventPublicity.includes(body.eventPublicity)
      ) {
        return {
          statusCode: 400,
          body: "Allowed values for eventFormat and eventPublicity are: PRESENCIAL, REMOTE and PUBLIC, PRIVATE",
        };
      }

      const invalidFields: boolean = Object.keys(body).some(
        (field) => !allowedFields.includes(field)
      );

      if (invalidFields) {
        return {
          statusCode: 400,
          body: "Invalid fields",
        };
      }

      if (body.eventPublicity === "PRIVATE") {
        body.accessCode = generateCode();
      } else {
        body.accessCode = null;
      }

      const event = await this.postgresCreateEventRepository.createEvent({
        ...body,
        duration: convertToMinutes(body.duration, body.durationUnit),
      });
      return {
        statusCode: 201,
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
