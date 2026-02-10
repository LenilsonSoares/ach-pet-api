import { AppError } from "../../../domain/errors/AppError.js";
import type { PetsRepository } from "../../ports/PetsRepository.js";

export function addPetPhoto(deps: { petsRepo: PetsRepository }) {
  return async (params: { petId: string; shelterId: string; url: string }) => {
    const ownerShelterId = await deps.petsRepo.getOwnerShelterId(params.petId);
    if (!ownerShelterId) throw new AppError(404, "Pet não encontrado");
    if (ownerShelterId !== params.shelterId) throw new AppError(403, "Sem permissão");

    const photo = await deps.petsRepo.addPhoto(params.petId, params.url);
    return { photo };
  };
}
