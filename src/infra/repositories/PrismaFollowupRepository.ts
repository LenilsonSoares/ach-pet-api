import type { AdoptionParticipants, FollowUpUpdate, FollowupRepository } from "../../application/ports/FollowupRepository.js";
import { prisma } from "../db/prisma.js";

export class PrismaFollowupRepository implements FollowupRepository {
  async getAdoptionParticipants(adoptionId: string): Promise<AdoptionParticipants | null> {
    const adoption = await prisma.adoption.findUnique({
      where: { id: adoptionId },
      select: {
        followUpDays: true,
        startsAt: true,
        adoptionRequest: { select: { adopterId: true, shelterId: true } },
      },
    });

    if (!adoption) return null;

    return {
      adopterId: adoption.adoptionRequest.adopterId,
      shelterId: adoption.adoptionRequest.shelterId,
      followUpDays: adoption.followUpDays,
      startsAt: adoption.startsAt,
    };
  }

  async listUpdates(adoptionId: string): Promise<FollowUpUpdate[]> {
    return prisma.followUpUpdate.findMany({
      where: { adoptionId },
      orderBy: { createdAt: "desc" },
      take: 200,
      include: { author: { select: { id: true, name: true, role: true } } },
    });
  }

  async createUpdate(input: { adoptionId: string; authorId: string; text?: string; photoUrl?: string }): Promise<FollowUpUpdate> {
    return prisma.followUpUpdate.create({
      data: {
        adoptionId: input.adoptionId,
        authorId: input.authorId,
        text: input.text,
        photoUrl: input.photoUrl,
      },
      include: { author: { select: { id: true, name: true, role: true } } },
    });
  }
}
