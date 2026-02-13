import { createPet } from "../src/application/use-cases/pets/createPet.js";
import { Pet } from "../src/domain/entities/Pet.js";

describe("CreatePet Use Case", () => {
  it("should create a pet", async () => {
    const mockRepo = {
      create: jest.fn((shelterId, input) => {
        return Promise.resolve(
          new Pet(
            "1",
            input.name,
            input.species,
            input.breed ?? null,
            input.sex ?? null,
            input.ageMonths ?? null,
            input.size ?? null,
            input.description ?? null,
            "AVAILABLE",
            shelterId,
            [],
            new Date(),
          ),
        );
      }),
    };
    const useCase = createPet({ petsRepo: mockRepo });
    const result = await useCase("shelter1", {
      name: "Rex",
      species: "Dog",
    });
    expect(result.pet.name).toBe("Rex");
    expect(mockRepo.create).toHaveBeenCalled();
  });
});
