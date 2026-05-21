import { StorageProvider } from "../../application/ports/StorageProvider.js";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
// @ts-ignore
import { logger } from "../observability/logger.js";

const UPLOADS_DIR = path.resolve(process.cwd(), "uploads");

const extensionByMimeType: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

function buildSafeFilename(filename: string, mimetype: string) {
  const originalExtension = path.extname(filename).toLowerCase();
  const extension = originalExtension || extensionByMimeType[mimetype] || ".jpg";
  const baseName =
    path
      .basename(filename, originalExtension)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "pet-photo";

  return `${Date.now()}-${randomUUID().slice(0, 8)}-${baseName}${extension}`;
}

export class LocalStorageProvider implements StorageProvider {
  async save(buffer: Buffer, filename: string, mimetype: string): Promise<string> {
    try {
      await fs.mkdir(UPLOADS_DIR, { recursive: true });
      const safeFilename = buildSafeFilename(filename, mimetype);
      const filePath = path.join(UPLOADS_DIR, safeFilename);
      await fs.writeFile(filePath, buffer);
      logger.info({ filePath }, "Upload local realizado com sucesso");
      return `/uploads/${safeFilename}`;
    } catch (err) {
      logger.error({ err, filename }, "Falha ao salvar arquivo localmente");
      throw new Error("Falha ao salvar arquivo localmente. Tente novamente mais tarde.");
    }
  }

  async delete(url: string): Promise<void> {
    try {
      const filename = url.replace("/uploads/", "");
      const filePath = path.join(UPLOADS_DIR, filename);
      await fs.unlink(filePath);
      logger.info({ filePath }, "Arquivo local removido com sucesso");
    } catch (err) {
      logger.error({ err, url }, "Falha ao remover arquivo local");
      // Não lança erro para não quebrar fluxo principal
    }
  }
}
