import { Pet } from "../src/domain/entities/Pet.js";

describe("Pet Entity", () => {
  it("should be available for adoption", () => {
    const pet = new Pet("1", "Rex", "Dog", "Labrador", "M", 12, "Large", "Ótimo cão", "AVAILABLE", "shelter1", [], new Date());
    expect(pet.isAvailable()).toBe(true);
  });

  it("should adopt pet", () => {
    const pet = new Pet("1", "Rex", "Dog", "Labrador", "M", 12, "Large", "Ótimo cão", "AVAILABLE", "shelter1", [], new Date());
    pet.adopt();
    expect(pet.status).toBe("ADOPTED");
  });

  it("should throw if not available", () => {
    const pet = new Pet("1", "Rex", "Dog", "Labrador", "M", 12, "Large", "Ótimo cão", "ADOPTED", "shelter1", [], new Date());
    expect(() => pet.adopt()).toThrow();
  });
});
