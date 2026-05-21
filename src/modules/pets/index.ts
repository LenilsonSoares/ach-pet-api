// Exemplo de uso dos módulos para registrar dependências por feature
// src/modules/pets/index.ts
import { PrismaPetsRepository } from "../../infra/repositories/PrismaPetsRepository.js";
import { CloudinaryStorageProvider } from "../../infra/uploads/CloudinaryStorageProvider.js";
import { LocalStorageProvider } from "../../infra/uploads/LocalStorageProvider.js";
import type { StorageProvider } from "../../application/ports/StorageProvider.js";

function hasCloudinaryConfig() {
  return Boolean(
    process.env.CLOUDINARY_URL ||
      (process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET),
  );
}

export function createPetsModule(storageProvider?: StorageProvider) {
  return {
    petsRepo: new PrismaPetsRepository(),
    storageProvider:
      storageProvider ??
      (hasCloudinaryConfig() ? new CloudinaryStorageProvider() : new LocalStorageProvider()),
  };
}
