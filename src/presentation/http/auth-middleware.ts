import { logger } from '../../infra/observability/logger.js';
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
    if (!auth) {
      logger.warn({ ip: req.ip }, "Tentativa de acesso sem autorização");
      throw new AppError(401, "Sem autorização");
    }

    const [type, token] = auth.split(" ");
    if (type !== "Bearer" || !token) {
      logger.warn({ ip: req.ip }, "Token ausente ou formato inválido");
      throw new AppError(401, "Token ausente");
    }

    try {
      const payload = tokenService.verifyAccessToken(token);
      req.user = { id: payload.sub, role: payload.role };
      logger.info({ userId: payload.sub, role: payload.role }, "Usuário autenticado com sucesso");
      next();
    } catch (err) {
      logger.warn({ err, ip: req.ip }, "Falha na autenticação JWT");
      throw err;
    }
  }

  function requireRole(role: "ADOPTER" | "SHELTER") {
    return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
      if (!req.user) {
        logger.warn({ ip: req.ip }, "Acesso negado: usuário não autenticado");
        throw new AppError(401, "Sem autorização");
      }
      if (req.user.role !== role) {
        logger.warn({ userId: req.user.id, role: req.user.role, required: role }, "Acesso negado: perfil insuficiente");
        throw new AppError(403, "Sem permissão");
      }
      logger.info({ userId: req.user.id, role: req.user.role }, "Permissão concedida para rota protegida");
      next();
    };
  }

  return { requireAuth, requireRole };
}
