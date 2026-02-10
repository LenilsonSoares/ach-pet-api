import { Router } from "express";
import { z } from "zod";

import { registerUser } from "../../../application/use-cases/auth/registerUser.js";
import { loginUser } from "../../../application/use-cases/auth/loginUser.js";
import type { AuthRepository } from "../../../application/ports/AuthRepository.js";
import type { PasswordHasher } from "../../../application/ports/PasswordHasher.js";
import type { TokenService } from "../../../application/ports/TokenService.js";

export function createAuthRouter(deps: {
  authRepo: AuthRepository;
  passwordHasher: PasswordHasher;
  tokenService: TokenService;
}) {
  const router = Router();

  const registerSchema = z.object({
    role: z.enum(["ADOPTER", "SHELTER"]),
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    phone: z.string().min(8).optional(),
    orgName: z.string().min(2).optional(),
  });

  router.post("/register", async (req, res) => {
    const body = registerSchema.parse(req.body);
    const handler = registerUser(deps);
    const result = await handler(body);
    return res.status(201).json(result);
  });

  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
  });

  router.post("/login", async (req, res) => {
    const body = loginSchema.parse(req.body);
    const handler = loginUser(deps);
    const result = await handler(body);
    return res.json(result);
  });

  return router;
}
