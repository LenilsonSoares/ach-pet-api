import { AppError } from "../../../domain/errors/AppError.js";
import type { AdoptionsRepository } from "../../ports/AdoptionsRepository.js";

export function interveneAdoption(deps: { adoptionsRepo: AdoptionsRepository }) {
  return async (params: { adoptionId: string; shelterId: string }) => {
    const adoption = await deps.adoptionsRepo.getAdoptionForAction(params.adoptionId);
    if (!adoption) throw new AppError(404, "Adoção não encontrada");
    if (adoption.shelterId !== params.shelterId) throw new AppError(403, "Sem permissão");

    if (adoption.status !== "ACTIVE" && adoption.status !== "INTERVENTION") {
      throw new AppError(409, "Adoção não está ativa para intervenção");
    }

    const updated = await deps.adoptionsRepo.interveneAdoption(params.adoptionId);
    return { adoption: updated };
  };
}
