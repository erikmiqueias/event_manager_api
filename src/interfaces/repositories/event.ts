import { Event } from "../../models/schemas";

export interface IPostgresCreateEventRepository {
  createEvent(createEventParams: Omit<Event, "id">): Promise<Event>;
}

export interface IPostgresGetEventsByUserIdRepository {
  getEventByUserId(userId: string): Promise<Event[]>;
}

export interface IPostgresGetEventsByPaginationRepository {
  getEventsByPagination(
    limit: number,
    offset: number,
    userId: string
  ): Promise<Event[]>;
}

export interface IPostgresJoinEventRepository {
  joinEvent(
    eventId: string,
    userId: string,
    email: string,
    fullName: string,
    phoneNumber: string,
    agreedToTerms: boolean
  ): Promise<void>;
  checkIfUserJoinedEvent(
    eventId: string,
    userId: string,
    phoneNumber: string,
    agreedToTerms: boolean
  ): Promise<boolean>;
}

export interface IPostgresUserEventsRetrieverRepository {
  getUserEvents(userId: string): Promise<Event[]>;
}

export interface IPostgresDeleteEventRepository {
  deleteEvent(eventId: string): Promise<Event>;
}

export interface IPostgresGetEventByEventIdAndUserIdRepository {
  getEventByEventIdAndUserId(
    eventId: string,
    userId: string
  ): Promise<Event | null>;
}

export interface IPostgresGetEventIdByAccessCodeRepository {
  getEventId(accessCode: string): Promise<string | null>;
}

export interface IPostgresGetEventByIdRepository {
  getEventById(eventId: string): Promise<Event | null>;
}

export interface IPostgresEditEventRepositoryById {
  editEventById(eventId: string, fields: Partial<Event>): Promise<Event>;
}

export interface IPostgresDeleteAccessCodeRepository {
  deleteAccessCode(eventId: string): Promise<void>;
}
