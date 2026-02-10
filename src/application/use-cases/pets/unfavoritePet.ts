import type { PetsRepository } from "../../ports/PetsRepository.js";

export function unfavoritePet(deps: { petsRepo: PetsRepository }) {
  return async (params: { userId: string; petId: string }) => {
    await deps.petsRepo.unfavorite(params.userId, params.petId);
    return;
  };
}
