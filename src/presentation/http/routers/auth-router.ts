import { Router } from "express";
import { z } from "zod";

import { registerUser } from "../../../application/use-cases/auth/registerUser.js";
import { loginUser } from "../../../application/use-cases/auth/loginUser.js";
import { changePassword } from "../../../application/use-cases/auth/changePassword.js";
import { requestPasswordReset } from "../../../application/use-cases/auth/requestPasswordReset.js";
import { resetPassword } from "../../../application/use-cases/auth/resetPassword.js";
import { normalizeUpdateProfileInput } from "../../../application/use-cases/auth/profileValidation.js";
import type { AuthRepository } from "../../../application/ports/AuthRepository.js";
import type { PushNotificationRepository } from "../../../application/ports/PushNotifications.js";
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
  pushNotificationsRepo?: PushNotificationRepository;
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
    cep: optionalTrimmed,
    street: optionalTrimmed,
    addressNumber: optionalTrimmed,
    addressComplement: optionalTrimmed,
    neighborhood: optionalTrimmed,
    city: optionalTrimmed,
    state: optionalTrimmed,
    latitude: z.coerce.number().min(-90).max(90).optional(),
    longitude: z.coerce.number().min(-180).max(180).optional(),
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
    cep: optionalTrimmed,
    street: optionalTrimmed,
    addressNumber: optionalTrimmed,
    addressComplement: optionalTrimmed,
    neighborhood: optionalTrimmed,
    city: optionalTrimmed,
    state: optionalTrimmed,
    latitude: z.coerce.number().min(-90).max(90).optional(),
    longitude: z.coerce.number().min(-180).max(180).optional(),
    cnpj: optionalTrimmed,
    responsible: optionalTrimmed,
    site: optionalTrimmed,
  });

  const changePasswordSchema = z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(6),
    confirmPassword: z.string().min(1),
  });

  const forgotPasswordSchema = z.object({
    email: z.string().trim().email(),
  });

  const resetPasswordSchema = z.object({
    token: z.string().trim().min(1),
    newPassword: z.string().min(6),
    confirmPassword: z.string().min(1),
  });

  const pushTokenSchema = z.object({
    token: z.string().trim().min(10).max(300),
    platform: optionalTrimmed,
    deviceName: optionalTrimmed,
  });

  const notificationPreferencesSchema = z
    .object({
      pushChatEnabled: z.boolean().optional(),
      pushAdoptionEnabled: z.boolean().optional(),
    })
    .refine((value) => value.pushChatEnabled !== undefined || value.pushAdoptionEnabled !== undefined, {
      message: "Informe ao menos uma preferencia",
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

  router.post(
    "/forgot-password",
    asyncHandler(async (req, res) => {
      const body = forgotPasswordSchema.parse(req.body);
      const handlerFactory = await requestPasswordReset({
        authRepo: deps.authRepo,
        exposeResetToken: process.env.NODE_ENV === "test",
      });
      const result = await handlerFactory(body);

      return res.status(200).json(result);
    }),
  );

  router.post(
    "/reset-password",
    asyncHandler(async (req, res) => {
      const body = resetPasswordSchema.parse(req.body);
      const handlerFactory = await resetPassword({
        authRepo: deps.authRepo,
        passwordHasher: deps.passwordHasher,
      });
      const result = await handlerFactory(body);

      return res.status(200).json(result);
    }),
  );

  router.get(
    "/me",
    auth.requireAuth,
    asyncHandler(async (req, res) => {
      const authUser = (req as AuthenticatedRequest).user;
      const userId = authUser?.id;
      if (!userId || !authUser) throw new AppError(401, "Sem autorização");

      const user = await deps.authRepo.findById(userId);
      if (!user) throw new AppError(404, "Usuário não encontrado");

      return res.status(200).json({ user });
    }),
  );

  router.patch(
    "/me",
    auth.requireAuth,
    asyncHandler(async (req, res) => {
      const authUser = (req as AuthenticatedRequest).user;
      const userId = authUser?.id;
      if (!userId || !authUser) throw new AppError(401, "Sem autorização");

      const body = updateProfileSchema.parse(req.body);
      const user = await deps.authRepo.updateUser(userId, normalizeUpdateProfileInput(authUser.role, body));
      if (!user) throw new AppError(404, "Usuário não encontrado");

      return res.status(200).json({ user });
    }),
  );

  router.post(
    "/me/push-tokens",
    auth.requireAuth,
    asyncHandler(async (req, res) => {
      if (!deps.pushNotificationsRepo) throw new AppError(503, "Notificações indisponíveis");

      const authUser = (req as AuthenticatedRequest).user;
      const userId = authUser?.id;
      if (!userId) throw new AppError(401, "Sem autorização");

      const body = pushTokenSchema.parse(req.body);
      await deps.pushNotificationsRepo.upsertToken({
        userId,
        token: body.token,
        platform: body.platform,
        deviceName: body.deviceName,
      });

      return res.status(201).json({ ok: true });
    }),
  );

  router.patch(
    "/me/notification-preferences",
    auth.requireAuth,
    asyncHandler(async (req, res) => {
      if (!deps.pushNotificationsRepo) throw new AppError(503, "Notificações indisponíveis");

      const authUser = (req as AuthenticatedRequest).user;
      const userId = authUser?.id;
      if (!userId) throw new AppError(401, "Sem autorização");

      const body = notificationPreferencesSchema.parse(req.body);
      const preferences = await deps.pushNotificationsRepo.updatePreferences(userId, body);
      if (!preferences) throw new AppError(404, "Usuário não encontrado");

      return res.status(200).json({ preferences });
    }),
  );

  router.patch(
    "/me/password",
    auth.requireAuth,
    asyncHandler(async (req, res) => {
      const authUser = (req as AuthenticatedRequest).user;
      const userId = authUser?.id;
      if (!userId || !authUser) throw new AppError(401, "Sem autorizacao");

      const body = changePasswordSchema.parse(req.body);
      const handlerFactory = await changePassword({
        authRepo: deps.authRepo,
        passwordHasher: deps.passwordHasher,
      });
      const result = await handlerFactory({ userId, ...body });

      return res.status(200).json(result);
    }),
  );

  return router;
}
