import { IHttpRequest, IHttpResponse } from "../http";
import { Event } from "../../models/schemas";

export interface ICreateEventController {
  createEvent(httpRequest: IHttpRequest): Promise<IHttpResponse<Event>>;
}

export interface IGetEventsByUserIdController {
  getEventsByUserId(httpRequest: IHttpRequest): Promise<IHttpResponse<Event[]>>;
}

export interface IGetEventsByPaginationController {
  getEventsByPagination(
    httpRequest: IHttpRequest
  ): Promise<IHttpResponse<Event[]>>;
}

export interface IJoinEventController {
  joinEvent(httpRequest: IHttpRequest): Promise<IHttpResponse<void>>;
}

export interface IUserEventsRetrieverController {
  getUserEvents(httpRequest: IHttpRequest): Promise<IHttpResponse<Event[]>>;
}

export interface IDeleteEventController {
  deleteEvent(httpRequest: IHttpRequest): Promise<IHttpResponse<Event>>;
}

export interface IGetEventIdByAccessCodeController {
  getEventById(httpRequest: IHttpRequest): Promise<IHttpResponse<Event>>;
}

export interface IEditEventByIdController {
  editEventById(httpRequest: IHttpRequest): Promise<IHttpResponse<Event>>;
}
