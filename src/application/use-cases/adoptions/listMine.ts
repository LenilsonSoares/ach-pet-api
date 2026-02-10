import type { AdoptionsRepository } from "../../ports/AdoptionsRepository.js";

export function listMine(deps: { adoptionsRepo: AdoptionsRepository }) {
  return async (adopterId: string) => {
    const requests = await deps.adoptionsRepo.listMine(adopterId);
    return { requests };
  };
}
