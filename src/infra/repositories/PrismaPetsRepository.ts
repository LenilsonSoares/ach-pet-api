import type {
  CreatePetInput,
  PetDetails,
  PetListItem,
  PetsRepository,
  PetStatus,
  UpdatePetInput,
} from "../../application/ports/PetsRepository.js";
import { prisma } from "../db/prisma.js";

export class PrismaPetsRepository implements PetsRepository {
  async list(filters: { status?: PetStatus; species?: string; q?: string }): Promise<PetListItem[]> {
    return prisma.pet.findMany({
      where: {
        status: filters.status,
        species: filters.species,
        OR: filters.q
          ? [
              { name: { contains: filters.q, mode: "insensitive" } },
              { breed: { contains: filters.q, mode: "insensitive" } },
            ]
          : undefined,
      },
      include: { photos: true, shelter: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  }

  async listMine(shelterId: string): Promise<PetListItem[]> {
    return prisma.pet.findMany({
      where: { shelterId },
      include: { photos: true, shelter: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  }

  async getById(id: string): Promise<PetDetails | null> {
    return prisma.pet.findUnique({
      where: { id },
      include: { photos: true, shelter: { select: { id: true, name: true } } },
    });
  }

  async create(shelterId: string, input: CreatePetInput): Promise<PetDetails> {
    return prisma.pet.create({
      data: {
        shelterId,
        name: input.name,
        species: input.species,
        breed: input.breed,
        sex: input.sex,
        ageMonths: input.ageMonths,
        size: input.size,
        description: input.description,
      },
      include: { photos: true, shelter: { select: { id: true, name: true } } },
    });
  }

  async update(petId: string, input: UpdatePetInput): Promise<PetDetails> {
    return prisma.pet.update({
      where: { id: petId },
      data: {
        name: input.name,
        species: input.species,
        breed: input.breed,
        sex: input.sex,
        ageMonths: input.ageMonths,
        size: input.size,
        description: input.description,
        status: input.status,
      },
      include: { photos: true, shelter: { select: { id: true, name: true } } },
    });
  }

  async addPhoto(petId: string, url: string) {
    return prisma.petPhoto.create({ data: { petId, url }, select: { id: true, url: true } });
  }

  async getOwnerShelterId(petId: string): Promise<string | null> {
    const pet = await prisma.pet.findUnique({ where: { id: petId }, select: { shelterId: true } });
    return pet?.shelterId ?? null;
  }

  async favorite(userId: string, petId: string): Promise<void> {
    await prisma.favorite.upsert({
      where: { userId_petId: { userId, petId } },
      update: {},
      create: { userId, petId },
    });
  }

  async unfavorite(userId: string, petId: string): Promise<void> {
    await prisma.favorite.deleteMany({ where: { userId, petId } });
  }
}
