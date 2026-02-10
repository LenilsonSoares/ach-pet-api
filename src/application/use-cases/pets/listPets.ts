import type { PetsRepository } from "../../ports/PetsRepository.js";

export function listPets(deps: { petsRepo: PetsRepository }) {
  return async (filters: {
    status?: "AVAILABLE" | "ADOPTED" | "PAUSED";
    species?: string;
    q?: string;
    page?: number;
    pageSize?: number;
    order?: "asc" | "desc";
  }) => {
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 20;
    const order = filters.order ?? "desc";

    const { items, total } = await deps.petsRepo.list({
      status: filters.status,
      species: filters.species,
      q: filters.q,
      page,
      pageSize,
      order,
    });

    return {
      pets: items,
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  };
}
