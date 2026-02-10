import type { PetsRepository } from "../../ports/PetsRepository.js";

export function listPets(deps: { petsRepo: PetsRepository }) {
  return async (filters: { status?: "AVAILABLE" | "ADOPTED" | "PAUSED"; species?: string; q?: string }) => {
    const pets = await deps.petsRepo.list(filters);
    return { pets };
  };
}
