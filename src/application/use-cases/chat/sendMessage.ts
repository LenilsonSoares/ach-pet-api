import { AppError } from "../../../domain/errors/AppError.js";
import type { ChatRepository } from "../../ports/ChatRepository.js";
import type { PushNotificationRepository, PushNotificationService } from "../../ports/PushNotifications.js";
import { notifyUser } from "../notifications/notifyUser.js";

export function sendMessage(deps: {
  chatRepo: ChatRepository;
  pushNotificationsRepo?: PushNotificationRepository;
  pushNotificationService?: PushNotificationService;
}) {
  return async (params: { threadId: string; userId: string; content: string }) => {
    const participants = await deps.chatRepo.getThreadParticipants(params.threadId);
    if (!participants) throw new AppError(404, "Thread não encontrada");

    if (params.userId !== participants.adopterId && params.userId !== participants.shelterId) {
      throw new AppError(403, "Sem permissão");
    }

    const message = await deps.chatRepo.createMessage({
      threadId: params.threadId,
      senderId: params.userId,
      content: params.content,
    });

    const recipientId = params.userId === participants.adopterId ? participants.shelterId : participants.adopterId;
    void notifyUser(deps)({
      userId: recipientId,
      category: "CHAT",
      message: {
        title: `Nova mensagem de ${message.sender.name}`,
        body: params.content.length > 80 ? `${params.content.slice(0, 77)}...` : params.content,
        data: { type: "chat", threadId: params.threadId },
      },
    });

    return { message };
  };
}
