import { AppError } from "../../../domain/errors/AppError.js";
import type { PetsRepository } from "../../ports/PetsRepository.js";

export function favoritePet(deps: { petsRepo: PetsRepository }) {
  return async (params: { userId: string; petId: string }) => {
    const pet = await deps.petsRepo.getById(params.petId);
    if (!pet) throw new AppError(404, "Pet não encontrado");

    await deps.petsRepo.favorite(params.userId, params.petId);
    return;
  };
}
