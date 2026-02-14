import { AppError } from "../../../domain/errors/AppError.js";
import type { AdoptionsRepository } from "../../ports/AdoptionsRepository.js";
import { logger } from "../../../infra/observability/logger.js";

export function approveRequest(deps: { adoptionsRepo: AdoptionsRepository }) {
  return async (params: { shelterId: string; requestId: string; followUpDays: number }) => {
    const request = await deps.adoptionsRepo.getRequestForDecision(params.requestId);
    if (!request) throw new AppError(404, "Solicitação não encontrada");
    if (request.shelterId !== params.shelterId) throw new AppError(403, "Sem permissão");
    if (request.status !== "PENDING") throw new AppError(400, "Solicitação não está pendente");

    const result = await deps.adoptionsRepo.approveRequest(request.id, params.followUpDays);
    logger.info({ shelterId: params.shelterId, requestId: params.requestId }, "Solicitação de adoção aprovada");
    return result;
  };
}
