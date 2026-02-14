import { FollowUpUpdate } from "../../domain/entities/FollowUpUpdate.js";

export function prismaFollowUpUpdateToDomain(fu: any): FollowUpUpdate {
  return new FollowUpUpdate(
    fu.id,
    fu.adoptionId,
    fu.text ?? null,
    fu.photoUrl ?? null,
    fu.createdAt,
    fu.author,
  );
}

export function domainFollowUpUpdateToDTO(fu: FollowUpUpdate) {
  return {
    id: fu.id,
    adoptionId: fu.adoptionId,
    text: fu.text,
    photoUrl: fu.photoUrl,
    createdAt: fu.createdAt,
    author: fu.author,
  };
}
