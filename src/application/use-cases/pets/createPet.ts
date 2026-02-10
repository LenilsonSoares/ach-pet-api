import type { CreatePetInput, PetsRepository } from "../../ports/PetsRepository.js";

export function createPet(deps: { petsRepo: PetsRepository }) {
  return async (shelterId: string, input: CreatePetInput) => {
    const pet = await deps.petsRepo.create(shelterId, input);
    return { pet };
  };
}
