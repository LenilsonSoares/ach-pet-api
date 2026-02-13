import request from "supertest";
import { app } from "../src/app.js";

describe("Integration: Edge cases", () => {
  it("should return 404 for pet not found", async () => {
    const res = await request(app).get("/pets/nonexistent");
    expect(res.status).toBe(404);
  });

  it("should return 400 for invalid register payload", async () => {
    const res = await request(app).post("/auth/register").send({ name: "", email: "invalid", password: "123" });
    expect(res.status).toBe(400);
  });

  it("should return 401 for protected route without token", async () => {
    const res = await request(app).post("/pets").send({ name: "Rex", species: "Dog" });
    expect(res.status).toBe(401);
  });

  it("should return 405 for invalid method", async () => {
    const res = await request(app).put("/pets");
    expect([404, 405]).toContain(res.status); // Express pode retornar 404 ou 405
  });
});
