import { AppError } from "../../../domain/errors/AppError.js";
import type { AdoptionsRepository } from "../../ports/AdoptionsRepository.js";
import { logger } from "../../../infra/observability/logger.js";

export function createAdoptionRequest(deps: { adoptionsRepo: AdoptionsRepository }) {
  return async (params: { adopterId: string; petId: string; message?: string }) => {
    const pet = await deps.adoptionsRepo.getPetSnapshot(params.petId);
    if (!pet) throw new AppError(404, "Pet não encontrado");
    if (pet.status !== "AVAILABLE") throw new AppError(400, "Pet indisponível");

    const existing = await deps.adoptionsRepo.findExistingRequest(pet.id, params.adopterId);
    if (existing) throw new AppError(409, "Solicitação já existe");

    const request = await deps.adoptionsRepo.createRequest({
      petId: pet.id,
      adopterId: params.adopterId,
      shelterId: pet.shelterId,
      message: params.message,
    });
    logger.info({ adopterId: params.adopterId, petId: params.petId }, "Solicitação de adoção criada");
    return { request };
  };
}
