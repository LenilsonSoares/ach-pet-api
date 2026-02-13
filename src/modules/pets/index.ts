// Exemplo de uso dos módulos para registrar dependências por feature
// src/modules/pets/index.ts
import { PrismaPetsRepository } from "../../infra/repositories/PrismaPetsRepository.js";

export function createPetsModule() {
  return {
    petsRepo: new PrismaPetsRepository(),
  };
}
