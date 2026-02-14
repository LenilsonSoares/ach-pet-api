import { AppError } from "../../../domain/errors/AppError.js";
import type { AuthRepository, PublicUser, RegisterInput, UserRole } from "../../ports/AuthRepository.js";
import { logger } from "../../../infra/observability/logger.js";
import type { PasswordHasher } from "../../ports/PasswordHasher.js";
import type { TokenService } from "../../ports/TokenService.js";

export type RegisterUserRequest = {
  role: UserRole;
  name: string;
  email: string;
  password: string;
  phone?: string;
  orgName?: string;
};

export type RegisterUserResponse = {
  user: PublicUser;
  token: string;
};

export async function registerUser(deps: {
  authRepo: AuthRepository;
  passwordHasher: PasswordHasher;
  tokenService: TokenService;
}) {
  // Importa value objects
  const { Email } = await import("../../../domain/entities/Email.js");
  const { Password } = await import("../../../domain/entities/Password.js");
  const { Phone } = await import("../../../domain/entities/Phone.js");
  return async (req: RegisterUserRequest): Promise<RegisterUserResponse> => {
    // Validação de campos obrigatórios
    if (!req.role || !["ADOPTER", "SHELTER"].includes(req.role)) {
      throw new AppError(400, "Role inválido ou ausente");
    }
    if (!req.name || req.name.trim().length < 2) {
      throw new AppError(400, "Nome obrigatório e mínimo 2 caracteres");
    }
    if (!req.email) {
      throw new AppError(400, "E-mail obrigatório");
    }
    if (!req.password) {
      throw new AppError(400, "Senha obrigatória");
    }
    // Validação de value objects
    try {
      new Email(req.email);
      new Password(req.password);
      if (req.phone) new Phone(req.phone);
    } catch (err) {
      const error = err as Error;
      throw new AppError(400, error.message);
    }

    const exists = await deps.authRepo.findByEmail(req.email);
    if (exists) throw new AppError(409, "E-mail já cadastrado");

    const passwordHash = await deps.passwordHasher.hash(req.password);

    const input: RegisterInput = {
      role: req.role,
      name: req.name,
      email: req.email,
      passwordHash,
      phone: req.phone,
      orgName: req.orgName,
    };

    const user = await deps.authRepo.createUser(input);
    logger.info({ userId: user.id, email: user.email, role: user.role }, "Usuário registrado");
    const token = deps.tokenService.signAccessToken({ sub: user.id, role: user.role });
    return { user, token };
  };
}
