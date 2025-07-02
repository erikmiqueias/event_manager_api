import { isUUID } from "validator";
import { IEditUserByIdController } from "../../interfaces/controllers/user";
import { IHttpRequest, IHttpResponse } from "../../interfaces/http";
import { User } from "../../models/schemas";
import { PostgresEditUserByIdRepository } from "../../repositories/user/edit-user";
import { PostgresGetUserRepository } from "../../repositories/user/get-user";
import { UploadFileIntoCloudinary } from "../../repositories/user/upload-file";

export class EditUserByIdController implements IEditUserByIdController {
  constructor(
    private readonly postgresEditUserByIdRepository: PostgresEditUserByIdRepository,
    private readonly postgresGetUserRepository: PostgresGetUserRepository,
    private readonly uploadFileIntoCloudinary: UploadFileIntoCloudinary
  ) {}
  async editUserById(httpRequest: IHttpRequest): Promise<IHttpResponse<User>> {
    try {
      const { params, body, file } = httpRequest;

      if (!isUUID(params.userId)) {
        return {
          statusCode: 400,
          body: "Invalid params or user not found",
        };
      }

      const userExists: User | null =
        await this.postgresGetUserRepository.getUser(params.userId);

      if (!userExists) {
        return {
          statusCode: 404,
          body: "User not found",
        };
      }

      const allowedFields: (keyof User)[] = [
        "userName",
        "password",
        "imageUrl",
        "jobTitle",
        "email",
        "company",
        "bio",
        "phoneNumber",
        "address",
      ];

      if (!params?.userId) {
        return {
          statusCode: 400,
          body: "Missing userId",
        };
      }

      const hasUpdateFields = body && Object.keys(body).length > 0;
      if (!hasUpdateFields && !file) {
        return {
          statusCode: 400,
          body: "No fields or file to update",
        };
      }

      const invalidFields: boolean = Object.keys(body).some(
        (field) => !allowedFields.includes(field as keyof User)
      );

      if (invalidFields) {
        return {
          statusCode: 400,
          body: "Invalid fields",
        };
      }

      const fields: Partial<User> = {};

      if (file) {
        const imageUrl = await this.uploadFileIntoCloudinary.upload(file);
        fields.imageUrl = imageUrl;
      }

      for (const field of allowedFields) {
        if (body[field]) {
          fields[field] = body[field];
        }
      }

      const user: User = await this.postgresEditUserByIdRepository.editUserById(
        params.userId,
        fields
      );

      return {
        statusCode: 200,
        body: user,
      };
    } catch (err) {
      console.log(err);
      return {
        statusCode: 500,
        body: `Something went wrong: ${err}`,
      };
    }
  }
}
