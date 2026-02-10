import { AppError } from "../../../domain/errors/AppError.js";
import type { AdoptionsRepository } from "../../ports/AdoptionsRepository.js";

export function rejectRequest(deps: { adoptionsRepo: AdoptionsRepository }) {
  return async (params: { shelterId: string; requestId: string }) => {
    const request = await deps.adoptionsRepo.getRequestForDecision(params.requestId);
    if (!request) throw new AppError(404, "Solicitação não encontrada");
    if (request.shelterId !== params.shelterId) throw new AppError(403, "Sem permissão");
    if (request.status !== "PENDING") throw new AppError(400, "Solicitação não está pendente");

    const updated = await deps.adoptionsRepo.rejectRequest(request.id);
    return { request: updated };
  };
}
