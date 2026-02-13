import { registerUser } from "../src/application/use-cases/auth/registerUser.js";

describe("RegisterUser Use Case", () => {
  it("should register user and return token", async () => {
    const mockRepo = {
      createUser: jest.fn((input) => Promise.resolve({
        id: "1",
        name: input.name,
        email: input.email,
        role: input.role,
      })),
    };
    const mockHasher = {
      hash: jest.fn((plain) => Promise.resolve("hashed")),
    };
    const mockToken = {
      signAccessToken: jest.fn(() => "token"),
    };
    const useCase = registerUser({
      authRepo: mockRepo,
      passwordHasher: mockHasher,
      tokenService: mockToken,
    });
    const result = await useCase({
      role: "ADOPTER",
      name: "Ana",
      email: "ana@email.com",
      password: "123456",
    });
    expect(result.user.name).toBe("Ana");
    expect(result.token).toBe("token");
    expect(mockRepo.createUser).toHaveBeenCalled();
    expect(mockHasher.hash).toHaveBeenCalled();
    expect(mockToken.signAccessToken).toHaveBeenCalled();
  });
});
