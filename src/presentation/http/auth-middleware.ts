import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../domain/errors/AppError.js";
import type { TokenService } from "../../application/ports/TokenService.js";

/**
 * Request com usuário autenticado anexado após validação do JWT.
 *
 * Observação: `user` só existe depois de passar por `requireAuth`.
 */
export type AuthenticatedRequest = Request & {
  user?: { id: string; role: "ADOPTER" | "SHELTER" };
};

/**
 * Constrói middlewares de autenticação/autorização a partir do TokenService.
 *
 * Mantém o acoplamento com JWT isolado em infra (TokenService) e deixa o HTTP
 * com regras simples: autenticar e checar perfil.
 */
export function buildAuthMiddlewares(tokenService: TokenService) {
  function requireAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
    const auth = req.header("authorization");
    if (!auth) throw new AppError(401, "Sem autorização");

    const [type, token] = auth.split(" ");
    if (type !== "Bearer" || !token) throw new AppError(401, "Token ausente");

    const payload = tokenService.verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role };
    next();
  }

  function requireRole(role: "ADOPTER" | "SHELTER") {
    return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
      if (!req.user) throw new AppError(401, "Sem autorização");
      if (req.user.role !== role) throw new AppError(403, "Sem permissão");
      next();
    };
  }

  return { requireAuth, requireRole };
}
