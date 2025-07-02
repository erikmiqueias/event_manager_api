import cloudinary from "../../config/cloudinary";
import { IUploadFileIntoCloudinary } from "../../interfaces/repositories/user";
import { unlinkSync } from "fs";

export class UploadFileIntoCloudinary implements IUploadFileIntoCloudinary {
  async upload(file: Express.Multer.File): Promise<string> {
    const { secure_url } = await cloudinary.uploader.upload(file.path);

    unlinkSync(file.path);

    return secure_url;
  }
}
