import { AppError } from "../../../domain/errors/AppError.js";
import type { AuthRepository } from "../../ports/AuthRepository.js";
import { generatePasswordResetToken, hashPasswordResetToken } from "./passwordResetToken.js";

const DEFAULT_EXPIRATION_MINUTES = 30;
const GENERIC_MESSAGE = "Se o e-mail estiver cadastrado, enviaremos instrucoes para redefinir a senha.";

export type RequestPasswordResetRequest = {
  email: string;
};

export type RequestPasswordResetResponse = {
  message: string;
  resetToken?: string;
  expiresAt?: string;
};

export async function requestPasswordReset(deps: {
  authRepo: AuthRepository;
  now?: () => Date;
  generateToken?: () => string;
  exposeResetToken?: boolean;
  expirationMinutes?: number;
}) {
  return async (req: RequestPasswordResetRequest): Promise<RequestPasswordResetResponse> => {
    const email = req.email?.trim().toLowerCase();
    if (!email) throw new AppError(400, "E-mail obrigatorio");

    const user = await deps.authRepo.findByEmail(email);
    if (!user) return { message: GENERIC_MESSAGE };

    const now = deps.now?.() ?? new Date();
    const expirationMinutes = deps.expirationMinutes ?? DEFAULT_EXPIRATION_MINUTES;
    const expiresAt = new Date(now.getTime() + expirationMinutes * 60 * 1000);
    const resetToken = deps.generateToken?.() ?? generatePasswordResetToken();
    const tokenHash = hashPasswordResetToken(resetToken);

    await deps.authRepo.createPasswordResetToken({
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    if (deps.exposeResetToken) {
      return { message: GENERIC_MESSAGE, resetToken, expiresAt: expiresAt.toISOString() };
    }

    return { message: GENERIC_MESSAGE };
  };
}
