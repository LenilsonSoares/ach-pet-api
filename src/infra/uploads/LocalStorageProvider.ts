import { StorageProvider } from "../../application/ports/StorageProvider.js";
import { promises as fs } from "fs";
import path from "path";
// @ts-ignore
import { logger } from "../observability/logger.js";

const UPLOADS_DIR = path.resolve(process.cwd(), "uploads");

export class LocalStorageProvider implements StorageProvider {
  async save(buffer: Buffer, filename: string, _mimetype: string): Promise<string> {
    try {
      await fs.mkdir(UPLOADS_DIR, { recursive: true });
      const filePath = path.join(UPLOADS_DIR, filename);
      await fs.writeFile(filePath, buffer);
      logger.info({ filePath }, "Upload local realizado com sucesso");
      return `/uploads/${filename}`;
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