import { Router } from "express";
import { z } from "zod";

import { registerUser } from "../../../application/use-cases/auth/registerUser.js";
import { loginUser } from "../../../application/use-cases/auth/loginUser.js";
import type { AuthRepository } from "../../../application/ports/AuthRepository.js";
import type { PasswordHasher } from "../../../application/ports/PasswordHasher.js";
import type { TokenService } from "../../../application/ports/TokenService.js";
import { asyncHandler } from "../async-handler.js";
import { AppError } from "../../../domain/errors/AppError.js";
import { buildAuthMiddlewares, type AuthenticatedRequest } from "../auth-middleware.js";

/**
 * Rotas de autenticação.
 *
 * Responsabilidade: validar payload HTTP (Zod) e delegar para os use cases.
 */
export function createAuthRouter(deps: {
  authRepo: AuthRepository;
  passwordHasher: PasswordHasher;
  tokenService: TokenService;
}) {
  const router = Router();
  const auth = buildAuthMiddlewares(deps.tokenService);
  const optionalTrimmed = z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined));

  const registerSchema = z.object({
    role: z.enum(["ADOPTER", "SHELTER"]),
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    phone: optionalTrimmed,
    orgName: optionalTrimmed,
    cpf: optionalTrimmed,
    birthDate: optionalTrimmed,
    address: optionalTrimmed,
    cnpj: optionalTrimmed,
    responsible: optionalTrimmed,
    site: optionalTrimmed,
  });

  const updateProfileSchema = z.object({
    name: z.string().trim().min(2).optional(),
    email: z.string().trim().email().optional(),
    phone: optionalTrimmed,
    orgName: optionalTrimmed,
    cpf: optionalTrimmed,
    birthDate: optionalTrimmed,
    address: optionalTrimmed,
    cnpj: optionalTrimmed,
    responsible: optionalTrimmed,
    site: optionalTrimmed,
  });

  router.post(
    "/register",
    asyncHandler(async (req, res) => {
    const body = registerSchema.parse(req.body);
    const handlerFactory = await registerUser(deps);
    const result = await handlerFactory(body);
    return res.status(201).json(result);
    }),
  );

  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
  });

  router.post(
    "/login",
    asyncHandler(async (req, res) => {
      const body = loginSchema.parse(req.body);
      const handlerFactory = await loginUser(deps);
      const result = await handlerFactory(body);
      return res.status(200).json(result);
    }),
  );

  router.get(
    "/me",
    auth.requireAuth,
    asyncHandler(async (req, res) => {
      const userId = (req as AuthenticatedRequest).user?.id;
      if (!userId) throw new AppError(401, "Sem autorização");

      const user = await deps.authRepo.findById(userId);
      if (!user) throw new AppError(404, "Usuário não encontrado");

      return res.status(200).json({ user });
    }),
  );

  router.patch(
    "/me",
    auth.requireAuth,
    asyncHandler(async (req, res) => {
      const userId = (req as AuthenticatedRequest).user?.id;
      if (!userId) throw new AppError(401, "Sem autorização");

      const body = updateProfileSchema.parse(req.body);
      const user = await deps.authRepo.updateUser(userId, body);
      if (!user) throw new AppError(404, "Usuário não encontrado");

      return res.status(200).json({ user });
    }),
  );

  return router;
}
