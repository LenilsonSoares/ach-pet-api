// Exemplo de uso dos módulos para registrar dependências por feature
// src/modules/chat/index.ts
import { PrismaChatRepository } from "../../infra/repositories/PrismaChatRepository.js";

export function createChatModule() {
  return {
    chatRepo: new PrismaChatRepository(),
  };
}
