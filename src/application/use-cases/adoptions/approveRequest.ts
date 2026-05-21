import { AppError } from "../../../domain/errors/AppError.js";
import type { AdoptionsRepository } from "../../ports/AdoptionsRepository.js";
import type { PushNotificationRepository, PushNotificationService } from "../../ports/PushNotifications.js";
import { logger } from "../../../infra/observability/logger.js";
import { notifyUser } from "../notifications/notifyUser.js";

export function approveRequest(deps: {
  adoptionsRepo: AdoptionsRepository;
  pushNotificationsRepo?: PushNotificationRepository;
  pushNotificationService?: PushNotificationService;
}) {
  return async (params: { shelterId: string; requestId: string; followUpDays: number }) => {
    const request = await deps.adoptionsRepo.getRequestForDecision(params.requestId);
    if (!request) throw new AppError(404, "Solicitação não encontrada");
    if (request.shelterId !== params.shelterId) throw new AppError(403, "Sem permissão");
    if (request.status !== "PENDING") throw new AppError(400, "Solicitação não está pendente");

    const result = await deps.adoptionsRepo.approveRequest(request.id, params.followUpDays);
    logger.info({ shelterId: params.shelterId, requestId: params.requestId }, "Solicitação de adoção aprovada");
    void notifyUser(deps)({
      userId: request.adopterId,
      category: "ADOPTION",
      message: {
        title: "Adoção aprovada",
        body: `Sua solicitação para adotar ${request.petName} foi aprovada.`,
        data: { type: "adoption_approved", requestId: request.id, petId: request.petId },
      },
    });
    return result;
  };
}
