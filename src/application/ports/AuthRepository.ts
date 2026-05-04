export type UserRole = "ADOPTER" | "SHELTER";

export type AuthUser = {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone?: string | null;
  passwordHash: string;
  orgName?: string | null;
  cpf?: string | null;
  birthDate?: string | null;
  address?: string | null;
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
  orgName?: string | null;
  cpf?: string | null;
  birthDate?: string | null;
  address?: string | null;
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
  cnpj?: string;
  responsible?: string;
  site?: string;
};

export type AuthRepository = {
  findByEmail(email: string): Promise<AuthUser | null>;
  findById(id: string): Promise<PublicUser | null>;
  createUser(input: RegisterInput): Promise<PublicUser>;
  updateUser(id: string, input: UpdateUserInput): Promise<PublicUser | null>;
};
