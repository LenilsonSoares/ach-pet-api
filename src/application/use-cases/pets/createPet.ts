import type { CreatePetInput, PetsRepository } from "../../ports/PetsRepository.js";
import { logger } from "../../../infra/observability/logger.js";

export function createPet(deps: { petsRepo: PetsRepository }) {
  return async (shelterId: string, input: CreatePetInput) => {
    const pet = await deps.petsRepo.create(shelterId, input);
    logger.info({ shelterId, petId: pet.id, name: input.name }, "Pet criado");
    return { pet };
  };
}
