import { Pet } from "../../domain/entities/Pet.js";

export function prismaPetToDomain(pet: any): Pet {
  return new Pet(
    pet.id,
    pet.name,
    pet.species,
    pet.breed ?? null,
    pet.sex ?? null,
    pet.ageMonths ?? null,
    pet.size ?? null,
    pet.description ?? null,
    pet.status,
    pet.shelterId,
    pet.photos ?? [],
    pet.createdAt,
  );
}

export function domainPetToDTO(pet: Pet) {
  return {
    id: pet.id,
    name: pet.name,
    species: pet.species,
    breed: pet.breed,
    sex: pet.sex,
    ageMonths: pet.ageMonths,
    size: pet.size,
    description: pet.description,
    status: pet.status,
    shelterId: pet.shelterId,
    photos: pet.photos,
    createdAt: pet.createdAt,
  };
}
