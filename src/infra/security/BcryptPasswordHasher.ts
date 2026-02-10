import bcrypt from "bcrypt";
import type { PasswordHasher } from "../../application/ports/PasswordHasher.js";

export class BcryptPasswordHasher implements PasswordHasher {
  async hash(plain: string) {
    return bcrypt.hash(plain, 10);
  }

  async compare(plain: string, hash: string) {
    return bcrypt.compare(plain, hash);
  }
}
