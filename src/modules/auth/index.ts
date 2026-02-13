// Exemplo de uso dos módulos para registrar dependências por feature
// src/modules/auth/index.ts
import { PrismaAuthRepository } from "../../infra/repositories/PrismaAuthRepository.js";
import { BcryptPasswordHasher } from "../../infra/security/BcryptPasswordHasher.js";
import { JwtTokenService } from "../../infra/security/JwtTokenService.js";

export function createAuthModule() {
  return {
    authRepo: new PrismaAuthRepository(),
    passwordHasher: new BcryptPasswordHasher(),
    tokenService: new JwtTokenService(),
  };
}
