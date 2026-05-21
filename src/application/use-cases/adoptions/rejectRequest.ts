import { AppError } from "../../../domain/errors/AppError.js";
import type { AdoptionsRepository } from "../../ports/AdoptionsRepository.js";
import type { PushNotificationRepository, PushNotificationService } from "../../ports/PushNotifications.js";
import { logger } from "../../../infra/observability/logger.js";
import { notifyUser } from "../notifications/notifyUser.js";

export function rejectRequest(deps: {
  adoptionsRepo: AdoptionsRepository;
  pushNotificationsRepo?: PushNotificationRepository;
  pushNotificationService?: PushNotificationService;
}) {
  return async (params: { shelterId: string; requestId: string; rejectionReason: string }) => {
    const rejectionReason = params.rejectionReason.trim();
    if (rejectionReason.length < 3) throw new AppError(400, "Informe o motivo da recusa");

    const request = await deps.adoptionsRepo.getRequestForDecision(params.requestId);
    if (!request) throw new AppError(404, "Solicitação não encontrada");
    if (request.shelterId !== params.shelterId) throw new AppError(403, "Sem permissão");
    if (request.status !== "PENDING") throw new AppError(400, "Solicitação não está pendente");

    const updated = await deps.adoptionsRepo.rejectRequest(request.id, rejectionReason);
    logger.info({ shelterId: params.shelterId, requestId: params.requestId }, "Solicitação de adoção rejeitada");
    void notifyUser(deps)({
      userId: request.adopterId,
      category: "ADOPTION",
      message: {
        title: "Solicitação de adoção recusada",
        body: `O abrigo analisou sua solicitação para ${request.petName}.`,
        data: { type: "adoption_rejected", requestId: request.id, petId: request.petId },
      },
    });
    return { request: updated };
  };
}
