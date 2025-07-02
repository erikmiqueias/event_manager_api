import { isUUID } from "validator";
import { IEditEventByIdController } from "../../interfaces/controllers/event";
import { IHttpRequest, IHttpResponse } from "../../interfaces/http";
import { Event } from "../../models/schemas";
import { PostgresEditEventByIdRepository } from "../../repositories/event/edit-event-by-id";
import { PostgresGetEventByIdRepository } from "../../repositories/event/get-event-by-id";
import { EventAccessValidator } from "./helpers/get-access-code";
import { generateCode } from "./helpers/create-access-code";
import { PostgresDeleteAccessCodeRepository } from "../../repositories/event/delete-access-code";

export class EditEventByIdController implements IEditEventByIdController {
  constructor(
    private readonly postgresEditEventByIdRepository: PostgresEditEventByIdRepository,
    private readonly postgresGetEventByIdRepository: PostgresGetEventByIdRepository,
    private readonly postgresDeleteAccessCodeRepository: PostgresDeleteAccessCodeRepository
  ) {}

  async editEventById(
    httpRequest: IHttpRequest
  ): Promise<IHttpResponse<Event>> {
    try {
      const { params, body } = httpRequest;

      if (!params?.eventId || !body) {
        return {
          statusCode: 400,
          body: "Missing eventId or body",
        };
      }

      if (!isUUID(params.eventId)) {
        return {
          statusCode: 400,
          body: "Invalid params or event not found",
        };
      }

      const eventExists =
        await this.postgresGetEventByIdRepository.getEventById(params.eventId);

      if (!eventExists) {
        return {
          statusCode: 404,
          body: "Event not found",
        };
      }

      const allowedFields: (keyof Event)[] = [
        "eventName",
        "eventDetails",
        "eventDate",
        "eventLocal",
        "duration",
        "eventFormat",
        "eventPublicity",
        "price",
        "durationUnit",
        "maxParticipants",
      ];

      const bodyKeys: (keyof Event)[] = Object.keys(body) as (keyof Event)[];

      const invalidFields: boolean = bodyKeys.some(
        (field) => !allowedFields.includes(field)
      );

      if (invalidFields) {
        return {
          statusCode: 400,
          body: "Invalid fields",
        };
      }

      const fields: Partial<Event> = {};

      for (const field of allowedFields) {
        if (body[field] !== undefined) {
          fields[field] = body[field];
        }
      }

      if (body.eventPublicity === "PRIVATE" && !eventExists.accessCode) {
        fields.accessCode = generateCode();
      }

      if (body.eventPublicity === "PUBLIC" && eventExists.accessCode) {
        await this.postgresDeleteAccessCodeRepository.deleteAccessCode(
          params.eventId
        );
      }

      const updatedEvent: Event =
        await this.postgresEditEventByIdRepository.editEventById(
          params.eventId,
          fields as Event
        );

      return {
        statusCode: 200,
        body: updatedEvent,
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: `Something went wrong: ${err}`,
      };
    }
  }
}
