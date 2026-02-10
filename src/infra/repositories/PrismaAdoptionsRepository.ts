import type {
  AdoptionRequest,
  AdoptionsRepository,
  InboxRequest,
  MineRequest,
  PetSnapshot,
} from "../../application/ports/AdoptionsRepository.js";
import { prisma } from "../db/prisma.js";

export class PrismaAdoptionsRepository implements AdoptionsRepository {
  async getPetSnapshot(petId: string): Promise<PetSnapshot | null> {
    return prisma.pet.findUnique({ where: { id: petId }, select: { id: true, status: true, shelterId: true } });
  }

  async findExistingRequest(petId: string, adopterId: string): Promise<AdoptionRequest | null> {
    return prisma.adoptionRequest.findFirst({
      where: { petId, adopterId, status: { in: ["PENDING", "APPROVED"] } },
      select: {
        id: true,
        petId: true,
        adopterId: true,
        shelterId: true,
        message: true,
        status: true,
        createdAt: true,
      },
    });
  }

  async createRequest(input: {
    petId: string;
    adopterId: string;
    shelterId: string;
    message?: string;
  }): Promise<AdoptionRequest> {
    return prisma.adoptionRequest.create({
      data: {
        petId: input.petId,
        adopterId: input.adopterId,
        shelterId: input.shelterId,
        message: input.message,
      },
      select: {
        id: true,
        petId: true,
        adopterId: true,
        shelterId: true,
        message: true,
        status: true,
        createdAt: true,
      },
    });
  }

  async listInbox(shelterId: string): Promise<InboxRequest[]> {
    return prisma.adoptionRequest.findMany({
      where: { shelterId },
      include: {
        pet: { include: { photos: true } },
        adopter: { select: { id: true, name: true, email: true } },
        adoption: { include: { thread: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async listMine(adopterId: string): Promise<MineRequest[]> {
    return prisma.adoptionRequest.findMany({
      where: { adopterId },
      include: { pet: { include: { photos: true } }, adoption: { include: { thread: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  async getRequestForDecision(requestId: string) {
    return prisma.adoptionRequest.findUnique({
      where: { id: requestId },
      select: { id: true, status: true, shelterId: true, petId: true },
    });
  }

  async approveRequest(requestId: string, followUpDays: number) {
    const adoption = await prisma.$transaction(async (tx: any) => {
      const req = await tx.adoptionRequest.update({
        where: { id: requestId },
        data: { status: "APPROVED" },
        select: { id: true, petId: true },
      });

      await tx.pet.update({ where: { id: req.petId }, data: { status: "ADOPTED" } });

      return tx.adoption.create({
        data: {
          adoptionRequestId: req.id,
          followUpDays,
          thread: { create: {} },
        },
        include: { thread: true },
      });
    });

    return { adoption: { id: adoption.id, followUpDays: adoption.followUpDays, thread: { id: adoption.thread!.id } } };
  }

  async rejectRequest(requestId: string): Promise<AdoptionRequest> {
    return prisma.adoptionRequest.update({
      where: { id: requestId },
      data: { status: "REJECTED" },
      select: {
        id: true,
        petId: true,
        adopterId: true,
        shelterId: true,
        message: true,
        status: true,
        createdAt: true,
      },
    });
  }
}
