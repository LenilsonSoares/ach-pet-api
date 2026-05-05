import { Password } from "../../../domain/entities/Password.js";
import { AppError } from "../../../domain/errors/AppError.js";
import type { AuthRepository } from "../../ports/AuthRepository.js";
import type { PasswordHasher } from "../../ports/PasswordHasher.js";
import { hashPasswordResetToken } from "./passwordResetToken.js";

export type ResetPasswordRequest = {
  token: string;
  newPassword: string;
  confirmPassword: string;
};

export type ResetPasswordResponse = {
  ok: true;
};

export async function resetPassword(deps: {
  authRepo: AuthRepository;
  passwordHasher: PasswordHasher;
  now?: () => Date;
}) {
  return async (req: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
    const token = req.token?.trim();
    if (!token) throw new AppError(400, "Token obrigatorio");
    if (!req.newPassword) throw new AppError(400, "Nova senha obrigatoria");
    if (!req.confirmPassword) throw new AppError(400, "Confirmacao de senha obrigatoria");

    if (req.newPassword !== req.confirmPassword) {
      throw new AppError(400, "Confirmacao de senha diferente", "PASSWORD_CONFIRMATION_MISMATCH");
    }

    try {
      new Password(req.newPassword);
    } catch {
      throw new AppError(400, "Nova senha invalida: minimo 6 caracteres", "INVALID_NEW_PASSWORD");
    }

    const tokenHash = hashPasswordResetToken(token);
    const resetToken = await deps.authRepo.findPasswordResetTokenByHash(tokenHash);
    const now = deps.now?.() ?? new Date();

    if (!resetToken || resetToken.usedAt || resetToken.expiresAt.getTime() <= now.getTime()) {
      throw new AppError(400, "Token invalido ou expirado", "INVALID_RESET_TOKEN");
    }

    const user = await deps.authRepo.findAuthById(resetToken.userId);
    if (!user) throw new AppError(400, "Token invalido ou expirado", "INVALID_RESET_TOKEN");

    const passwordHash = await deps.passwordHasher.hash(req.newPassword);
    await deps.authRepo.updatePasswordHash(user.id, passwordHash);
    await deps.authRepo.markPasswordResetTokenUsed(resetToken.id, now);

    return { ok: true };
  };
}
