import { AppError } from "../../../domain/errors/AppError.js";
import type { FollowupRepository } from "../../ports/FollowupRepository.js";

export function createUpdate(deps: { followupRepo: FollowupRepository }) {
  return async (params: { adoptionId: string; userId: string; text?: string; photoUrl?: string }) => {
    if (!params.text && !params.photoUrl) throw new AppError(400, "Envie texto ou fotoUrl");

    const participants = await deps.followupRepo.getAdoptionParticipants(params.adoptionId);
    if (!participants) throw new AppError(404, "Adoção não encontrada");

    if (params.userId !== participants.adopterId && params.userId !== participants.shelterId) {
      throw new AppError(403, "Sem permissão");
    }

    const update = await deps.followupRepo.createUpdate({
      adoptionId: params.adoptionId,
      authorId: params.userId,
      text: params.text,
      photoUrl: params.photoUrl,
    });

    return { update };
  };
}
