import { AppError } from "../../../domain/errors/AppError.js";
import { Password } from "../../../domain/entities/Password.js";
import type { AuthRepository } from "../../ports/AuthRepository.js";
import type { PasswordHasher } from "../../ports/PasswordHasher.js";

export type ChangePasswordRequest = {
  userId: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type ChangePasswordResponse = {
  ok: true;
};

export async function changePassword(deps: {
  authRepo: AuthRepository;
  passwordHasher: PasswordHasher;
}) {
  return async (req: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
    if (!req.userId) throw new AppError(401, "Sem autorizacao");
    if (!req.currentPassword) throw new AppError(400, "Senha atual obrigatoria");
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

    if (req.newPassword === req.currentPassword) {
      throw new AppError(400, "Nova senha deve ser diferente da senha atual", "PASSWORD_REUSED");
    }

    const user = await deps.authRepo.findAuthById(req.userId);
    if (!user) throw new AppError(404, "Usuario nao encontrado");

    const currentPasswordOk = await deps.passwordHasher.compare(req.currentPassword, user.passwordHash);
    if (!currentPasswordOk) {
      throw new AppError(401, "Senha atual invalida", "INVALID_CURRENT_PASSWORD");
    }

    const sameAsCurrentHash = await deps.passwordHasher.compare(req.newPassword, user.passwordHash);
    if (sameAsCurrentHash) {
      throw new AppError(400, "Nova senha deve ser diferente da senha atual", "PASSWORD_REUSED");
    }

    const passwordHash = await deps.passwordHasher.hash(req.newPassword);
    await deps.authRepo.updatePasswordHash(req.userId, passwordHash);

    return { ok: true };
  };
}
