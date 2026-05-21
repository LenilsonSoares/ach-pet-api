import { AppError } from "../../../domain/errors/AppError.js";
import type { AuthRepository, PublicUser, RegisterInput, UserRole } from "../../ports/AuthRepository.js";
import { logger } from "../../../infra/observability/logger.js";
import type { PasswordHasher } from "../../ports/PasswordHasher.js";
import type { TokenService } from "../../ports/TokenService.js";
import { normalizeRegisterProfile } from "./profileValidation.js";

export type RegisterUserRequest = {
  role: UserRole;
  name: string;
  email: string;
  password: string;
  phone?: string;
  orgName?: string;
  cpf?: string;
  birthDate?: string;
  address?: string;
  cep?: string;
  street?: string;
  addressNumber?: string;
  addressComplement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
  cnpj?: string;
  responsible?: string;
  site?: string;
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
    } catch (err) {
      const error = err as Error;
      throw new AppError(400, error.message);
    }

    const profile = normalizeRegisterProfile(req);

    const exists = await deps.authRepo.findByEmail(profile.email ?? req.email);
    if (exists) throw new AppError(409, "E-mail já cadastrado");

    const passwordHash = await deps.passwordHasher.hash(req.password);

    const input: RegisterInput = {
      role: req.role,
      name: profile.name ?? req.name.trim(),
      email: profile.email ?? req.email.trim(),
      passwordHash,
      phone: profile.phone,
      orgName: profile.orgName,
      cpf: profile.cpf,
      birthDate: profile.birthDate,
      address: profile.address,
      cep: profile.cep,
      street: profile.street,
      addressNumber: profile.addressNumber,
      addressComplement: profile.addressComplement,
      neighborhood: profile.neighborhood,
      city: profile.city,
      state: profile.state,
      latitude: profile.latitude,
      longitude: profile.longitude,
      cnpj: profile.cnpj,
      responsible: profile.responsible,
      site: profile.site,
    };

    const user = await deps.authRepo.createUser(input);
    logger.info({ userId: user.id, email: user.email, role: user.role }, "Usuário registrado");
    const token = deps.tokenService.signAccessToken({ sub: user.id, role: user.role });
    return { user, token };
  };
}
