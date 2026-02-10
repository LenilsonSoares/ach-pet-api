export type UserRole = "ADOPTER" | "SHELTER";

export type AuthUser = {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  passwordHash: string;
};

export type PublicUser = {
  id: string;
  role: UserRole;
  name: string;
  email: string;
};

export type RegisterInput = {
  role: UserRole;
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  orgName?: string;
};

export type AuthRepository = {
  findByEmail(email: string): Promise<AuthUser | null>;
  createUser(input: RegisterInput): Promise<PublicUser>;
};
