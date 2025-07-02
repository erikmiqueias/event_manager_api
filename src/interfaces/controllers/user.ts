import { User } from "../../models/schemas";
import { IHttpRequest, IHttpResponse } from "../http";

export interface IGetUserController {
  getUser(httpRequest: IHttpRequest): Promise<IHttpResponse<User>>;
}

export interface ICreateUserController {
  create(httpRequest: IHttpRequest): Promise<IHttpResponse<User>>;
}

export interface IGetUserByEmailController {
  getUserByEmail(httpRequest: IHttpRequest): Promise<IHttpResponse<User>>;
}

export interface IEditUserByIdController {
  editUserById(httpRequest: IHttpRequest): Promise<IHttpResponse<User>>;
}
