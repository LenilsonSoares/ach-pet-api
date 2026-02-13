import request from "supertest";
import { app } from "../src/app.js";

describe("Integration: Pets routes", () => {
  it("should list pets", async () => {
    const res = await request(app).get("/pets");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.pets)).toBe(true);
  });
});

describe("Integration: Adoptions routes", () => {
  it("should return 401 for request without token", async () => {
    const res = await request(app).post("/adoptions/request").send({ petId: "1", message: "Quero adotar" });
    expect(res.status).toBe(401);
  });
});

describe("Integration: Followup routes", () => {
  it("should return 401 for update without token", async () => {
    const res = await request(app).post("/followup/update").send({ adoptionId: "1", text: "Tudo bem" });
    expect(res.status).toBe(401);
  });
});

describe("Integration: Chat routes", () => {
  it("should return 401 for send message without token", async () => {
    const res = await request(app).post("/chat/send").send({ threadId: "1", content: "Oi" });
    expect(res.status).toBe(401);
  });
});
