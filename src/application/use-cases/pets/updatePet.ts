import { AppError } from "../../../domain/errors/AppError.js";
import type { PetsRepository, UpdatePetInput } from "../../ports/PetsRepository.js";

export function updatePet(deps: { petsRepo: PetsRepository }) {
  return async (params: { petId: string; shelterId: string; input: UpdatePetInput }) => {
    const ownerShelterId = await deps.petsRepo.getOwnerShelterId(params.petId);
    if (!ownerShelterId) throw new AppError(404, "Pet não encontrado");
    if (ownerShelterId !== params.shelterId) throw new AppError(403, "Sem permissão");

    if (params.input.status) {
      const pet = await deps.petsRepo.getById(params.petId);
      if (!pet) throw new AppError(404, "Pet não encontrado");
      if (pet.status === "ADOPTED") {
        throw new AppError(400, "Não é permitido alterar status de pet adotado");
      }
    }

    const pet = await deps.petsRepo.update(params.petId, params.input);
    return { pet };
  };
}
