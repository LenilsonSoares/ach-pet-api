import { Pet } from "../src/domain/entities/Pet.js";

describe("Pet business rules", () => {
  it("should not allow adoption if status is PAUSED", () => {
    const pet = new Pet("1", "Rex", "Dog", "Labrador", "M", 12, "Large", "Ótimo cão", "PAUSED", "shelter1", [], new Date());
    expect(() => pet.adopt()).toThrow();
  });
});

import { FollowUpUpdate } from "../src/domain/entities/FollowUpUpdate.js";

describe("FollowUpUpdate business rules", () => {
  it("should require at least text or photo", () => {
    const update = new FollowUpUpdate("1", "adopt1", null, null, new Date(), { id: "u1", name: "Ana", role: "ADOPTER" });
    expect(update.hasText()).toBe(false);
    expect(update.hasPhoto()).toBe(false);
  });
});
