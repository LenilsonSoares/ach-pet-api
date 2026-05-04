// Exemplo de uso dos módulos para registrar dependências por feature
// src/modules/pets/index.ts
import { PrismaPetsRepository } from "../../infra/repositories/PrismaPetsRepository.js";
import { CloudinaryStorageProvider } from "../../infra/uploads/CloudinaryStorageProvider.js";
import { LocalStorageProvider } from "../../infra/uploads/LocalStorageProvider.js";
import type { StorageProvider } from "../../application/ports/StorageProvider.js";

export function createPetsModule(storageProvider?: StorageProvider) {
  return {
    petsRepo: new PrismaPetsRepository(),
    storageProvider:
      storageProvider ??
      (process.env.CLOUDINARY_URL ? new CloudinaryStorageProvider() : new LocalStorageProvider()),
  };
}
