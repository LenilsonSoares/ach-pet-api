// Exemplo de uso dos módulos para registrar dependências por feature
// src/modules/followup/index.ts
import { PrismaFollowupRepository } from "../../infra/repositories/PrismaFollowupRepository.js";

export function createFollowupModule() {
  return {
    followupRepo: new PrismaFollowupRepository(),
  };
}
