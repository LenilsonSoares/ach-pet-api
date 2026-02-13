import request from "supertest";
import { app } from "../src/app.js";

describe("Integration: Auth routes", () => {
  it("should return 400 for invalid login", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "invalid", password: "123" });
    expect(res.status).toBe(400);
  });
});
