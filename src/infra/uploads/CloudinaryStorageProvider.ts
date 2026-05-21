import { logger } from "../observability/logger.js";

import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { StorageProvider } from "../../application/ports/StorageProvider.js";

export class CloudinaryStorageProvider implements StorageProvider {
  constructor() {
    const cloudinaryUrl = process.env.CLOUDINARY_URL;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (cloudinaryUrl) {
      cloudinary.config({ url: cloudinaryUrl });
      return;
    }

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error(
        "Configure CLOUDINARY_URL ou CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY e CLOUDINARY_API_SECRET.",
      );
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
  }

  /**
   * Salva um arquivo no Cloudinary e retorna a URL publica.
   */
  async save(buffer: Buffer, filename: string, mimetype: string): Promise<string> {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (!allowedTypes.includes(mimetype)) {
      throw new Error("Tipo de arquivo nao suportado. Apenas imagens JPEG, PNG, GIF ou WEBP.");
    }
    if (buffer.length > maxSize) {
      throw new Error("Arquivo excede o tamanho maximo de 10MB.");
    }

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
      throw new Error(
        "Falha ao salvar arquivo na nuvem. Tente novamente mais tarde. Detalhe: " +
          ((err as Error)?.message || err),
      );
    }
  }

  /**
   * Remove um arquivo do Cloudinary a partir da URL publica.
   */
  async delete(url: string): Promise<void> {
    const matches = url.match(/\/([^/]+)\.[a-zA-Z]+$/);
    if (!matches) return;
    const publicId = (process.env.CLOUDINARY_FOLDER || "ach-pet-api") + "/" + matches[1];
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
      logger.info({ publicId }, "Remocao Cloudinary realizada com sucesso");
    } catch (err) {
      logger.error({ err, publicId }, "Falha ao remover arquivo do Cloudinary");
      throw new Error("Falha ao remover arquivo da nuvem. Tente novamente mais tarde.");
    }
  }
}
