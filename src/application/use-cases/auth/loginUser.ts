import { AppError } from "../../../domain/errors/AppError.js";
import type { AuthRepository, PublicUser } from "../../ports/AuthRepository.js";
import type { PasswordHasher } from "../../ports/PasswordHasher.js";
import type { TokenService } from "../../ports/TokenService.js";

export type LoginUserRequest = {
  email: string;
  password: string;
};

export type LoginUserResponse = {
  user: PublicUser;
  token: string;
};

export async function loginUser(deps: {
  authRepo: AuthRepository;
  passwordHasher: PasswordHasher;
  tokenService: TokenService;
}) {
  // Importa logger
  const { logger } = await import("../../../infra/observability/logger.js");
  return async (req: LoginUserRequest): Promise<LoginUserResponse> => {
    logger.info({ email: req.email }, "Tentativa de login");
    const user = await deps.authRepo.findByEmail(req.email);

    if (!user) {
      logger.warn({ email: req.email }, "Login falhou: usuário não encontrado");
      throw new AppError(401, "Usuário não encontrado");
    }

    const ok = await deps.passwordHasher.compare(req.password, user.passwordHash);
    if (!ok) {
      logger.warn({ email: req.email, userId: user.id }, "Login falhou: senha inválida");
      throw new AppError(401, "Senha inválida");
    }

    const token = deps.tokenService.signAccessToken({ sub: user.id, role: user.role });
    logger.info({ userId: user.id, email: user.email, role: user.role }, "Login bem-sucedido");
    return {
      user: { id: user.id, role: user.role, name: user.name, email: user.email },
      token,
    };
  };
}
