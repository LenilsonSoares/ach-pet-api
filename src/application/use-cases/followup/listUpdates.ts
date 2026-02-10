import { AppError } from "../../../domain/errors/AppError.js";
import type { FollowupRepository } from "../../ports/FollowupRepository.js";

export function listUpdates(deps: { followupRepo: FollowupRepository }) {
  return async (params: { adoptionId: string; userId: string }) => {
    const participants = await deps.followupRepo.getAdoptionParticipants(params.adoptionId);
    if (!participants) throw new AppError(404, "Adoção não encontrada");

    if (params.userId !== participants.adopterId && params.userId !== participants.shelterId) {
      throw new AppError(403, "Sem permissão");
    }

    const updates = await deps.followupRepo.listUpdates(params.adoptionId);
    return { updates, followUpDays: participants.followUpDays, startsAt: participants.startsAt };
  };
}
