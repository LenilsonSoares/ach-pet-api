import { logger } from '../observability/logger.js';

import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { StorageProvider } from "../../application/ports/StorageProvider.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});


export class CloudinaryStorageProvider implements StorageProvider {
  /**
   * Salva um arquivo no Cloudinary e retorna a URL pública.
   */
  async save(buffer: Buffer, filename: string, mimetype: string): Promise<string> {
    // Converte buffer para base64 data URI
    const base64 = buffer.toString("base64");
    const dataUri = `data:${mimetype};base64,${base64}`;
    try {
      const res: UploadApiResponse = await cloudinary.uploader.upload(dataUri, {
        folder: process.env.CLOUDINARY_FOLDER || "ach-pet-api",
        public_id: filename.split(".")[0],
        resource_type: "image",
        overwrite: true,
      });
      logger.info({ filename }, "Upload Cloudinary realizado com sucesso");
      return res.secure_url;
    } catch (err) {
      logger.error({ err, filename }, "Falha ao fazer upload no Cloudinary");
      // Retorna erro amigável para a aplicação
      throw new Error("Falha ao salvar arquivo na nuvem. Tente novamente mais tarde.");
    }
  }

  /**
   * Remove um arquivo do Cloudinary a partir da URL pública.
   */
  async delete(url: string): Promise<void> {
    // Extrai public_id da URL
    const matches = url.match(/\/([^\/]+)\.[a-zA-Z]+$/);
    if (!matches) return;
    const publicId = (process.env.CLOUDINARY_FOLDER || "ach-pet-api") + "/" + matches[1];
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
      logger.info({ publicId }, "Remoção Cloudinary realizada com sucesso");
    } catch (err) {
      logger.error({ err, publicId }, "Falha ao remover arquivo do Cloudinary");
      throw new Error("Falha ao remover arquivo da nuvem. Tente novamente mais tarde.");
    }
  }
}
