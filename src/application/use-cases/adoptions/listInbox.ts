import type { AdoptionsRepository } from "../../ports/AdoptionsRepository.js";

export function listInbox(deps: { adoptionsRepo: AdoptionsRepository }) {
  return async (shelterId: string) => {
    const requests = await deps.adoptionsRepo.listInbox(shelterId);
    return { requests };
  };
}
