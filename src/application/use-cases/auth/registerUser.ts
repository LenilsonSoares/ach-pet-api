import { AppError } from "../../../domain/errors/AppError.js";
import type { AuthRepository, PublicUser, RegisterInput, UserRole } from "../../ports/AuthRepository.js";
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

export function registerUser(deps: {
  authRepo: AuthRepository;
  passwordHasher: PasswordHasher;
  tokenService: TokenService;
}) {
  return async (req: RegisterUserRequest): Promise<RegisterUserResponse> => {
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
    const token = deps.tokenService.signAccessToken({ sub: user.id, role: user.role });

    return { user, token };
  };
}
