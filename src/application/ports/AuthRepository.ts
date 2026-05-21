export type UserRole = "ADOPTER" | "SHELTER";

export type AuthUser = {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone?: string | null;
  passwordHash: string;
  pushChatEnabled?: boolean;
  pushAdoptionEnabled?: boolean;
  orgName?: string | null;
  cpf?: string | null;
  birthDate?: string | null;
  address?: string | null;
  cep?: string | null;
  street?: string | null;
  addressNumber?: string | null;
  addressComplement?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  cnpj?: string | null;
  responsible?: string | null;
  site?: string | null;
};

export type PublicUser = {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone?: string | null;
  pushChatEnabled?: boolean;
  pushAdoptionEnabled?: boolean;
  orgName?: string | null;
  cpf?: string | null;
  birthDate?: string | null;
  address?: string | null;
  cep?: string | null;
  street?: string | null;
  addressNumber?: string | null;
  addressComplement?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  cnpj?: string | null;
  responsible?: string | null;
  site?: string | null;
};

export type RegisterInput = {
  role: UserRole;
  name: string;
  email: string;
  passwordHash: string;
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

export type UpdateUserInput = {
  name?: string;
  email?: string;
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

export type PasswordResetTokenRecord = {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  usedAt?: Date | null;
  createdAt: Date;
};

export type CreatePasswordResetTokenInput = {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
};

export type AuthRepository = {
  findByEmail(email: string): Promise<AuthUser | null>;
  findAuthById(id: string): Promise<AuthUser | null>;
  findById(id: string): Promise<PublicUser | null>;
  createUser(input: RegisterInput): Promise<PublicUser>;
  updateUser(id: string, input: UpdateUserInput): Promise<PublicUser | null>;
  updatePasswordHash(id: string, passwordHash: string): Promise<void>;
  createPasswordResetToken(input: CreatePasswordResetTokenInput): Promise<void>;
  findPasswordResetTokenByHash(tokenHash: string): Promise<PasswordResetTokenRecord | null>;
  markPasswordResetTokenUsed(id: string, usedAt: Date): Promise<void>;
};
