import { AppError } from "../../../domain/errors/AppError.js";
import type { ChatRepository } from "../../ports/ChatRepository.js";

export function listMessages(deps: { chatRepo: ChatRepository }) {
  return async (params: { threadId: string; userId: string }) => {
    const participants = await deps.chatRepo.getThreadParticipants(params.threadId);
    if (!participants) throw new AppError(404, "Thread não encontrada");

    if (params.userId !== participants.adopterId && params.userId !== participants.shelterId) {
      throw new AppError(403, "Sem permissão");
    }

    const messages = await deps.chatRepo.listMessages(params.threadId);
    return { messages };
  };
}
