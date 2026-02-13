// Exemplo de uso dos módulos para registrar dependências por feature
// src/modules/adoptions/index.ts
import { PrismaAdoptionsRepository } from "../../infra/repositories/PrismaAdoptionsRepository.js";

export function createAdoptionsModule() {
  return {
    adoptionsRepo: new PrismaAdoptionsRepository(),
    // Adicione outros serviços/ports se necessário
  };
}
