import { v2 as cloudinary } from "cloudinary";
import type { StorageService } from "../../application/ports/StorageService.js";
import type { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class CloudinaryStorageService implements StorageService {
  async save(file: Buffer, filename: string, mimetype: string): Promise<string> {
    const upload = await cloudinary.uploader.upload_stream({
      resource_type: "image",
      public_id: filename.split(".")[0],
      folder: process.env.CLOUDINARY_FOLDER || "uploads",
    }, (error, result) => {
      if (error || !result) throw error || new Error("Upload failed");
      return result.secure_url;
    });
    // cloudinary.uploader.upload_stream is callback-based, so we need to wrap in a Promise
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          public_id: filename.split(".")[0],
          folder: process.env.CLOUDINARY_FOLDER || "uploads",
        },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error || !result) return reject(error || new Error("Upload failed"));
          resolve(result.secure_url);
        }
      );
      stream.end(file);
    });
  }

  async delete(filename: string): Promise<void> {
    await cloudinary.uploader.destroy(filename, { resource_type: "image" });
  }
}
