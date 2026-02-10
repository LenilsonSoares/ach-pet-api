import type { PetsRepository } from "../../ports/PetsRepository.js";

export function listMyPets(deps: { petsRepo: PetsRepository }) {
  return async (shelterId: string) => {
    const pets = await deps.petsRepo.listMine(shelterId);
    return { pets };
  };
}
