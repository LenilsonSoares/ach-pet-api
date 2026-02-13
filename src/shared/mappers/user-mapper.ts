import { User } from "../../domain/entities/User.js";

export function prismaUserToDomain(user: any): User {
  return new User(
    user.id,
    user.name,
    user.email,
    user.role,
    user.passwordHash,
    user.phone,
    user.orgName,
    user.createdAt,
  );
}

export function domainUserToDTO(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    orgName: user.orgName,
    createdAt: user.createdAt,
  };
}
