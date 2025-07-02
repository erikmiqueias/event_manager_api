import { isUUID } from "validator";
import { IJoinEventController } from "../../interfaces/controllers/event";
import { IHttpRequest, IHttpResponse } from "../../interfaces/http";
import { EventPublicity, User } from "../../models/schemas";
import { PostgresGetEventByEventIdAndUserIdRepository } from "../../repositories/event/get-event-by-event-id-and-user-id";
import { PostgresJoinEventRepository } from "../../repositories/event/join-event";
import { PostgresGetUserRepository } from "../../repositories/user/get-user";
import { EventAccessValidator } from "./helpers/get-access-code";
import { PostgresGetEventByIdRepository } from "../../repositories/event/get-event-by-id";

export class JoinEventController implements IJoinEventController {
  constructor(
    private readonly postgresJoinEventRepository: PostgresJoinEventRepository,
    private readonly postgresGetUserRepository: PostgresGetUserRepository,
    private readonly postgresGetEventByIdRepository: PostgresGetEventByIdRepository
  ) {}

  async joinEvent(httpRequest: IHttpRequest): Promise<IHttpResponse<void>> {
    try {
      const { params, body } = httpRequest;

      if (!params?.eventId || !body) {
        return {
          statusCode: 400,
          body: "Missing params or body",
        };
      }

      const user: User = await this.postgresGetUserRepository.getUser(
        body.userId
      );
      if (!user) {
        return { statusCode: 404, body: "User not found" };
      }

      if (!isUUID(params.eventId)) {
        return { statusCode: 400, body: "Invalid eventId" };
      }

      const event = await this.postgresGetEventByIdRepository.getEventById(
        params.eventId
      );
      if (!event) {
        return { statusCode: 404, body: "Event not found" };
      }

      const allowedFields = [
        "userId",
        "accessCode",
        "email",
        "fullName",
        "agreedToTerms",
        "phoneNumber",
      ];

      const hasExtraFields = Object.keys(body).some(
        (field) => !allowedFields.includes(field)
      );
      if (hasExtraFields) {
        return { statusCode: 400, body: "Invalid fields in body" };
      }

      // Validação obrigatória condicional
      const requiredFields = [
        "userId",
        "email",
        "fullName",
        "agreedToTerms",
        "phoneNumber",
        ...(event.eventPublicity === EventPublicity.PRIVATE
          ? ["accessCode"]
          : []),
      ];

      const fieldsAreMissing = requiredFields.some(
        (field) => body[field] === undefined
      );
      if (fieldsAreMissing) {
        return { statusCode: 400, body: "Missing required fields" };
      }

      if (event.eventPublicity === EventPublicity.PRIVATE) {
        const isValidAccessCode = await EventAccessValidator.isAccessCodeValid(
          params.eventId,
          body.accessCode
        );

        if (!isValidAccessCode) {
          return {
            statusCode: 401,
            body: "Invalid access code",
          };
        }
      }

      const alreadyJoined =
        await this.postgresJoinEventRepository.checkIfUserJoinedEvent(
          body.userId,
          params.eventId
        );

      if (alreadyJoined) {
        return { statusCode: 400, body: "User already joined event" };
      }

      await this.postgresJoinEventRepository.joinEvent(
        params.eventId,
        body.userId,
        body.email,
        body.fullName,
        body.phoneNumber,
        body.agreedToTerms
      );

      return { statusCode: 200, body: "Joined event successfully" };
    } catch (err) {
      return {
        statusCode: 500,
        body: `Something went wrong: ${err}`,
      };
    }
  }
}
