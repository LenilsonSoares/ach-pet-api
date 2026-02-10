import type { AuthRepository, AuthUser, PublicUser, RegisterInput } from "../../application/ports/AuthRepository.js";
import { prisma } from "../db/prisma.js";

export class PrismaAuthRepository implements AuthRepository {
  async findByEmail(email: string): Promise<AuthUser | null> {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        role: true,
        name: true,
        email: true,
        passwordHash: true,
      },
    });
  }

  async createUser(input: RegisterInput): Promise<PublicUser> {
    return prisma.user.create({
      data: {
        role: input.role,
        name: input.name,
        email: input.email,
        passwordHash: input.passwordHash,
        phone: input.phone,
        shelterProfile:
          input.role === "SHELTER"
            ? { create: { orgName: input.orgName ?? input.name } }
            : undefined,
        adopterProfile: input.role === "ADOPTER" ? { create: {} } : undefined,
      },
      select: { id: true, role: true, name: true, email: true },
    });
  }
}
