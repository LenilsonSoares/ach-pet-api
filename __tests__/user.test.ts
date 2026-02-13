import { User } from "../src/domain/entities/User.js";

describe("User Entity", () => {
  it("should identify adopter", () => {
    const user = new User("1", "Ana", "ana@email.com", "ADOPTER", "hash");
    expect(user.isAdopter()).toBe(true);
    expect(user.isShelter()).toBe(false);
  });

  it("should identify shelter", () => {
    const user = new User("2", "ONG", "ong@email.com", "SHELTER", "hash");
    expect(user.isShelter()).toBe(true);
    expect(user.isAdopter()).toBe(false);
  });

  it("should update name", () => {
    const user = new User("1", "Ana", "ana@email.com", "ADOPTER", "hash");
    user.updateName("Ana Maria");
    expect(user.name).toBe("Ana Maria");
  });
});
