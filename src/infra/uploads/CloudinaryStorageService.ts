// @ts-ignore
import { logger } from '../observability/logger.js';
import { v2 as cloudinary } from "cloudinary";
import type { StorageService } from "../../application/ports/StorageService.js";
import type { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";

if (!process.env.CLOUDINARY_URL) {
  throw new Error('Variável de ambiente CLOUDINARY_URL não definida.');
}
cloudinary.config({
  url: process.env.CLOUDINARY_URL,
});

export class CloudinaryStorageService implements StorageService {
  async save(file: Buffer, filename: string, mimetype: string): Promise<string> {
    // cloudinary.uploader.upload_stream is callback-based, so we need to wrap in a Promise
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          public_id: filename.split(".")[0],
          folder: process.env.CLOUDINARY_FOLDER || "uploads",
        },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            logger.error({ error, filename }, "Falha ao fazer upload no Cloudinary (Service)");
            return reject(new Error("Falha ao salvar arquivo na nuvem. Tente novamente mais tarde."));
          }
          logger.info({ filename }, "Upload Cloudinary realizado com sucesso (Service)");
          resolve(result.secure_url);
        }
      );
      stream.end(file);
    });
  }

  async delete(filename: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(filename, { resource_type: "image" });
      logger.info({ filename }, "Remoção Cloudinary realizada com sucesso (Service)");
    } catch (err) {
      logger.error({ err, filename }, "Falha ao remover arquivo do Cloudinary (Service)");
      throw new Error("Falha ao remover arquivo da nuvem. Tente novamente mais tarde.");
    }
  }
}
