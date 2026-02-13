import { Password } from "../src/domain/entities/Password.js";

describe("Password Value Object", () => {
  it("should accept valid password", () => {
    const pwd = new Password("123456");
    expect(pwd.toString()).toBe("123456");
  });

  it("should reject short password", () => {
    expect(() => new Password("123")).toThrow();
  });
});

import { Phone } from "../src/domain/entities/Phone.js";

describe("Phone Value Object", () => {
  it("should accept valid phone", () => {
    const phone = new Phone("+5511999999999");
    expect(phone.toString()).toBe("+5511999999999");
  });

  it("should reject invalid phone", () => {
    expect(() => new Phone("abc")).toThrow();
  });
});
