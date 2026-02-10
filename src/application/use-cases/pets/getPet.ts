import { AppError } from "../../../domain/errors/AppError.js";
import type { PetsRepository } from "../../ports/PetsRepository.js";

export function getPet(deps: { petsRepo: PetsRepository }) {
  return async (id: string) => {
    const pet = await deps.petsRepo.getById(id);
    if (!pet) throw new AppError(404, "Pet não encontrado");
    return { pet };
  };
}
